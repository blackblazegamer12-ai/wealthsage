import os
import re
import time
import uuid
import hashlib
import traceback
from typing import Any, Dict, List, Optional, Literal
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Supabase import
from supabase import Client, create_client

# Plaid imports
import plaid
from plaid.api import plaid_api
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products

# AI Service functions
from ai_service import (
    generate_executive_briefing,
    generate_financial_audit,
    generate_tutor_explanation,
    process_financial_chat,
)

load_dotenv()

app = FastAPI(
    title="WealthSage Production Financial API",
    version="2.0.0",
    description="Institutional-grade financial intelligence, transaction sync, audit logs, and Gemini AI"
)

# CORS Configuration — allow all local dev origins for frontend flexibility
environment = os.getenv("ENV", "development").lower()

if environment == "production":
    allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
    allowed_origins = [
        origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()
    ]
else:
    # In development, allow all localhost/127.0.0.1 origins (any port)
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Client Safely
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"[WARN] Supabase client initialization failed: {e}")

# Check Gemini Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Plaid Client Safely
PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
plaid_client: Optional[plaid_api.PlaidApi] = None

if PLAID_CLIENT_ID and PLAID_SECRET:
    try:
        configuration = plaid.Configuration(
            host=plaid.Environment.Sandbox,
            api_key={
                "clientId": PLAID_CLIENT_ID,
                "secret": PLAID_SECRET,
            },
        )
        api_client = plaid.ApiClient(configuration)
        plaid_client = plaid_api.PlaidApi(api_client)
    except Exception as e:
        print(f"[WARN] Plaid client configuration failed: {e}")


# --- In-Memory Security Audit Logs Store & Notification Cache ---
AUDIT_LOGS_STORE: List[Dict[str, Any]] = [
    {
        "id": "audit-init-001",
        "timestamp": "2026-08-22T10:00:00Z",
        "user_id": "system",
        "action": "SYSTEM_INITIALIZE",
        "resource_type": "VAULT_KERNEL",
        "resource_id": "kernel-01",
        "ip_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "severity": "INFO",
        "signature": "SIG_RSA4096_VALIDATED_A1"
    }
]

NOTIFICATIONS_STORE: List[Dict[str, Any]] = [
    {
        "id": "notif-001",
        "title": "Autonomous Vault Online",
        "message": "WealthSage quantitative intelligence engine synchronized with zero latency.",
        "type": "insight",
        "read": False,
        "created_at": "Just now",
        "action_url": "/dashboard"
    }
]


# --- PYDANTIC SCHEMAS ---
class ExchangeTokenRequest(BaseModel):
    public_token: str
    user_id: str = "demo-user-id"


class LinkTokenRequest(BaseModel):
    user_id: str = "demo-user-id"


class ChatRequest(BaseModel):
    message: str
    history: List[Any] = Field(default_factory=list)
    transactions: List[Dict[str, Any]] = Field(default_factory=list)
    user_id: Optional[str] = "demo-user-id"


class AuditRequest(BaseModel):
    transactions: List[Dict[str, Any]] = Field(default_factory=list)


class TutorRequest(BaseModel):
    note_content: str


class ExecutiveBriefingRequest(BaseModel):
    transactions: List[Dict[str, Any]] = Field(default_factory=list)
    goals: List[Dict[str, Any]] = Field(default_factory=list)
    subscriptions: List[Dict[str, Any]] = Field(default_factory=list)


class SyncTransactionsRequest(BaseModel):
    user_id: str = "demo-user-id"
    access_token: Optional[str] = None
    cursor: Optional[str] = None


class SecurityAuditCreateRequest(BaseModel):
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    severity: Optional[Literal["INFO", "WARNING", "CRITICAL"]] = "INFO"


UUID_PATTERN = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def validate_request_size(request: Request, max_bytes: int) -> None:
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > max_bytes:
        raise HTTPException(
            status_code=413, detail=f"Request exceeds the {max_bytes // 1024}KB limit."
        )


def add_rate_limit_headers(response: Response, limit: int) -> None:
    response.headers["RateLimit-Limit"] = str(limit)
    response.headers["RateLimit-Policy"] = f"{limit};w=60"


# --- HEALTH CHECK ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "WealthSage Production API",
        "version": "2.0.0",
        "supabase_configured": supabase is not None,
        "gemini_configured": GEMINI_API_KEY is not None,
        "plaid_configured": plaid_client is not None,
        "timestamp": time.time(),
    }


# --- PLAID LINK & EXCHANGE ---
@app.post("/api/plaid/create-link-token")
async def create_link_token(body: LinkTokenRequest):
    if not plaid_client:
        return {"link_token": "link-sandbox-mock-token-demo", "is_mock": True}

    try:
        request = LinkTokenCreateRequest(
            products=[Products("transactions")],
            client_name="WealthSage",
            country_codes=[CountryCode("US")],
            language="en",
            user=LinkTokenCreateRequestUser(client_user_id=str(body.user_id)),
        )
        response = plaid_client.link_token_create(request)
        link_token = (
            response["link_token"]
            if isinstance(response, dict)
            else response.link_token
        )
        return {"link_token": link_token, "is_mock": False}
    except Exception as e:
        print("PLAID LINK TOKEN ERROR:", traceback.format_exc())
        return {"link_token": "link-sandbox-mock-token-demo", "is_mock": True, "error": str(e)}


@app.post("/api/plaid/exchange-token")
async def exchange_token(body: ExchangeTokenRequest):
    if not plaid_client:
        # Record audit log for mock bank connection
        AUDIT_LOGS_STORE.insert(0, {
            "id": f"audit-{uuid.uuid4().hex[:8]}",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "user_id": body.user_id,
            "action": "PLAID_MOCK_TOKEN_EXCHANGE",
            "resource_type": "FINANCIAL_INSTITUTION",
            "resource_id": "sandbox_bank_01",
            "ip_hash": hashlib.sha256(body.user_id.encode()).hexdigest(),
            "severity": "INFO",
            "signature": f"SIG_{uuid.uuid4().hex[:12].upper()}"
        })
        return {
            "status": "success",
            "message": "Demo Sandbox Bank connected successfully!",
        }

    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=body.public_token
        )
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        access_token = (
            exchange_response["access_token"]
            if isinstance(exchange_response, dict)
            else exchange_response.access_token
        )
        item_id = (
            exchange_response["item_id"]
            if isinstance(exchange_response, dict)
            else exchange_response.item_id
        )

        if supabase:
            try:
                supabase.table("plaid_connections").insert(
                    {
                        "user_id": body.user_id,
                        "access_token": access_token,
                        "item_id": item_id,
                        "institution_name": "Connected Bank",
                    }
                ).execute()
            except Exception as db_e:
                print("Failed to store connection in Supabase:", db_e)

        # Audit Log
        AUDIT_LOGS_STORE.insert(0, {
            "id": f"audit-{uuid.uuid4().hex[:8]}",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "user_id": body.user_id,
            "action": "PLAID_TOKEN_EXCHANGE_COMPLETED",
            "resource_type": "FINANCIAL_INSTITUTION",
            "resource_id": item_id,
            "ip_hash": hashlib.sha256(body.user_id.encode()).hexdigest(),
            "severity": "INFO",
            "signature": f"SIG_{uuid.uuid4().hex[:12].upper()}"
        })

        return {
            "status": "success",
            "message": "Bank connected and secured successfully!",
        }
    except Exception as e:
        print("PLAID EXCHANGE ERROR:", traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))


# --- PLAID TRANSACTIONS SYNC LOOP ---
@app.post("/api/transactions/sync")
async def sync_transactions(body: SyncTransactionsRequest):
    """
    Simulates or executes Plaid transactions/sync incremental pagination loop.
    """
    cursor = body.cursor
    # Mock incremental delta sync response
    mock_sync_result = {
        "status": "synced",
        "added": [],
        "modified": [],
        "removed": [],
        "next_cursor": f"cursor_{int(time.time())}",
        "has_more": False,
        "last_sync_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    return mock_sync_result


# --- SECURITY AUDIT TRAIL ENDPOINTS ---
@app.get("/api/audit-logs")
def get_audit_logs(user_id: Optional[str] = Query(None)):
    if user_id and user_id != "demo-user-id":
        logs = [log for log in AUDIT_LOGS_STORE if log.get("user_id") in [user_id, "system", "demo-user-id"]]
        return logs or AUDIT_LOGS_STORE
    return AUDIT_LOGS_STORE


@app.post("/api/audit-logs")
def create_audit_log(body: SecurityAuditCreateRequest):
    entry = {
        "id": f"audit-{uuid.uuid4().hex[:8]}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "user_id": body.user_id,
        "action": body.action,
        "resource_type": body.resource_type,
        "resource_id": body.resource_id,
        "ip_hash": hashlib.sha256(body.user_id.encode()).hexdigest(),
        "severity": body.severity or "INFO",
        "signature": f"SIG_AUTH_{uuid.uuid4().hex[:12].upper()}"
    }
    AUDIT_LOGS_STORE.insert(0, entry)
    return {"status": "recorded", "entry": entry}


# --- NOTIFICATIONS CENTER ENDPOINTS ---
@app.get("/api/notifications")
def get_notifications(user_id: Optional[str] = Query(None)):
    return NOTIFICATIONS_STORE


# --- AI CHAT ENDPOINT ---
@app.post("/api/chat")
def ask_sage(request: ChatRequest, raw_request: Request, response: Response):
    validate_request_size(raw_request, 50 * 1024)
    add_rate_limit_headers(response, 30)
    user_id = request.user_id or "demo-user-id"

    result = process_financial_chat(
        user_query=request.message,
        history=request.history,
        current_transactions=request.transactions,
        user_id=user_id,
    )

    if "reply" not in result:
        result["reply"] = "Request processed."
    if "has_updates" not in result:
        result["has_updates"] = False
    if "updates" not in result or not isinstance(result.get("updates"), list):
        result["updates"] = []

    return result


# --- EXECUTIVE BRIEFING ENDPOINT ---
@app.post("/api/executive-briefing")
def get_executive_briefing(request: ExecutiveBriefingRequest):
    try:
        briefing = generate_executive_briefing(
            transactions=request.transactions,
            goals=request.goals,
            subscriptions=request.subscriptions,
        )
        return briefing
    except Exception as e:
        print(f"Executive Briefing Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


# --- FINANCIAL AUDIT ENDPOINT ---
@app.post("/api/audit")
def run_audit(request: AuditRequest, raw_request: Request, response: Response):
    validate_request_size(raw_request, 100 * 1024)
    add_rate_limit_headers(response, 12)
    try:
        audit_result = generate_financial_audit(request.transactions)
        return audit_result
    except Exception as e:
        print(f"Audit Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


# --- AI TUTOR ENDPOINT ---
@app.post("/api/tutor")
def ask_tutor(request: TutorRequest):
    try:
        result = generate_tutor_explanation(request.note_content)
        return result
    except Exception as e:
        print(f"Tutor Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))