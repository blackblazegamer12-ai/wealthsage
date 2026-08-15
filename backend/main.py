from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import traceback
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Supabase import
from supabase import create_client, Client

# Plaid imports
import plaid
from plaid.api import plaid_api
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

# Groq Import
from groq import Groq

from ai_service import (
    generate_financial_audit,
    generate_tutor_explanation,
    process_financial_chat,
    generate_executive_briefing
)

load_dotenv()

app = FastAPI(title="WealthSage API", version="1.0.0")

# Enable CORS for Next.js frontend
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
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

# Initialize Groq Client Safely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client: Optional[Groq] = None
if GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"[WARN] Groq client initialization failed: {e}")

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
            }
        )
        api_client = plaid.ApiClient(configuration)
        plaid_client = plaid_api.PlaidApi(api_client)
    except Exception as e:
        print(f"[WARN] Plaid client configuration failed: {e}")

# --- REQUEST / RESPONSE SCHEMAS ---
class ExchangeTokenRequest(BaseModel):
    public_token: str
    user_id: str = "demo-user-id"

class LinkTokenRequest(BaseModel):
    user_id: str = "demo-user-id"

class ChatMessage(BaseModel):
    role: str = "user"
    content: str = ""

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

# --- HEALTH CHECK ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "WealthSage API",
        "supabase_configured": supabase is not None,
        "groq_configured": groq_client is not None,
        "plaid_configured": plaid_client is not None,
    }

# --- PLAID ENDPOINTS ---
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
            user=LinkTokenCreateRequestUser(client_user_id=str(body.user_id))
        )
        response = plaid_client.link_token_create(request)
        link_token = response["link_token"] if isinstance(response, dict) else response.link_token
        return {"link_token": link_token, "is_mock": False}
    except Exception as e:
        print("PLAID LINK TOKEN ERROR:", traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/plaid/exchange-token")
async def exchange_token(body: ExchangeTokenRequest):
    if not plaid_client:
        return {"status": "success", "message": "Demo Bank connected successfully (Mock Mode)!"}

    try:
        exchange_request = ItemPublicTokenExchangeRequest(public_token=body.public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        access_token = exchange_response["access_token"] if isinstance(exchange_response, dict) else exchange_response.access_token
        item_id = exchange_response["item_id"] if isinstance(exchange_response, dict) else exchange_response.item_id

        if supabase:
            try:
                supabase.table("plaid_connections").insert({
                    "user_id": body.user_id,
                    "access_token": access_token,
                    "item_id": item_id,
                    "institution_name": "Sandbox Bank"
                }).execute()
            except Exception as db_e:
                print("Failed to store connection in Supabase:", db_e)

        return {"status": "success", "message": "Bank connected and secured successfully!"}
    except Exception as e:
        print("PLAID EXCHANGE ERROR:", traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

# --- AI CHAT ENDPOINT ---
@app.post("/api/chat")
async def ask_sage(request: ChatRequest):
    user_id = request.user_id or "demo-user-id"

    if not groq_client:
        return {
            "reply": "WealthSage AI is online in Demo Mode. Connect your GROQ_API_KEY in backend/.env for real-time LLaMA-3.3 financial intelligence.",
            "has_updates": False,
            "updates": [],
            "action": None
        }

    try:
        # Delegate to the structured AI service which returns JSON with CRUD operations
        result = process_financial_chat(
            user_query=request.message,
            history=request.history,
            current_transactions=request.transactions,
            user_id=user_id
        )

        # Ensure response always has the fields the frontend expects
        if "reply" not in result:
            result["reply"] = "Request processed."
        if "has_updates" not in result:
            result["has_updates"] = False
        if "updates" not in result or not isinstance(result.get("updates"), list):
            result["updates"] = []
        if "action" not in result:
            result["action"] = None

        return result

    except Exception as e:
        print(f"Chat Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# --- EXECUTIVE BRIEFING ENDPOINT ---
@app.post("/api/executive-briefing")
async def get_executive_briefing(request: ExecutiveBriefingRequest):
    try:
        briefing = generate_executive_briefing(
            transactions=request.transactions,
            goals=request.goals,
            subscriptions=request.subscriptions
        )
        return briefing
    except Exception as e:
        print(f"Executive Briefing Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# --- FINANCIAL AUDIT ENDPOINT ---
@app.post("/api/audit")
async def run_audit(request: AuditRequest):
    try:
        audit_result = generate_financial_audit(request.transactions)
        return audit_result
    except Exception as e:
        print(f"Audit Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# --- AI TUTOR NOTE ENDPOINT ---
@app.post("/api/tutor")
async def ask_tutor(request: TutorRequest):
    try:
        result = generate_tutor_explanation(request.note_content)
        return result
    except Exception as e:
        print(f"Tutor Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))