import os
import json
import traceback
from typing import List, Dict, Any, Optional
from groq import Groq
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# --- Initialize Groq ---
api_key = os.getenv("GROQ_API_KEY")
client: Optional[Groq] = None
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"[WARN] Groq client initialization failed in ai_service: {e}")

# --- Initialize Supabase ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"[WARN] Supabase initialization failed in ai_service: {e}")


def _safe_float(val: Any, default: float = 0.0) -> float:
    try:
        if val is None or val == "":
            return default
        return float(val)
    except (ValueError, TypeError):
        return default


def process_financial_chat(
    user_query: str,
    history: Optional[List[Any]] = None,
    current_transactions: Optional[List[Dict[str, Any]]] = None,
    user_id: str = "demo-user-id"
) -> Dict[str, Any]:
    if history is None:
        history = []
    if current_transactions is None:
        current_transactions = []

    if not client:
        return {
            "reply": "WealthSage AI is currently running in offline mode. Please configure GROQ_API_KEY in your backend/.env",
            "has_updates": False,
            "updates": []
        }

    system_prompt = f"""
You are WealthSage, an elite, highly autonomous financial AI.
You are not a simple chatbot; you are a mathematical reasoning engine.
You have full CRUD access to the user's financial dashboard. Respond strictly in valid JSON format.

CURRENT LEDGER:
{json.dumps(current_transactions)}

YOUR DIRECTIVES (THINK BEFORE YOU ACT):
1. Mathematical Autonomy: Do not just blindly log numbers. If the user gives you a complex scenario, calculate accurately.
2. Holistic Wealth Tracking:
   - "Net Worth" updates should immediately log as massive "income" transactions to correct their overall portfolio.
   - "SIPs" (Systematic Investment Plans) or recurring investments should be logged as Monthly Subscriptions.
3. The Toolkit Mapping: You have access to distinct action types. Map user intent to these tools dynamically:
   - "add": For one-time incomes, expenses, or net-worth corrections.
   - "add_subscription": For ANY recurring monthly cost, SIP, or automated investment.
   - "update": To modify an existing entry in the CURRENT LEDGER by its ID.
   - "delete": To remove a specific entry from the CURRENT LEDGER by its ID.
   - "reset": To wipe the ENTIRE ledger clean. Use ONLY when the user explicitly asks to reset, clear, or delete ALL transactions.
4. Auto-Categorization: You must invent hyper-accurate categories based on context (e.g., "Equities", "Liquidity").

RESPONSE RULES:
- If the user asks a general question or wants advice, set "has_updates" to false and "updates" to an empty array.
- If the user wants to log, add, modify, delete, or reset data, set "has_updates" to true and include the operations in "updates".
- You can chain multiple updates at once.
- Always include a clear "reply" explaining what you did or your analysis.

JSON FORMAT MUST MATCH EXACTLY:
{{
    "reply": "Your explanation to the user.",
    "has_updates": true,
    "updates": [
        {{
            "action": "add",
            "name": "Grocery Shopping",
            "amount": 120,
            "type": "expense",
            "category": "Groceries"
        }},
        {{
            "action": "reset"
        }}
    ]
}}
"""

    messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
    
    for msg in history:
        if isinstance(msg, dict):
            raw_role = str(msg.get("role") or msg.get("type") or "user").lower()
            content = str(msg.get("content") or msg.get("message") or "")
        else:
            raw_role = getattr(msg, "role", "user")
            content = getattr(msg, "content", "")

        norm_role = "assistant" if raw_role in ["assistant", "advice", "bot"] else "user"
        if content.strip():
            messages.append({"role": norm_role, "content": content})

    messages.append({"role": "user", "content": user_query})

    try:
        response = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=1024
        )
        
        # Parse the JSON response from the AI
        ai_data = json.loads(response.choices[0].message.content or "{}")

        # --- Intercept and process Supabase subscriptions in the background ---
        if ai_data.get("has_updates") and "updates" in ai_data and isinstance(ai_data["updates"], list) and supabase:
            for update in ai_data["updates"]:
                if update.get("action") == "add_subscription":
                    try:
                        # Write directly to your Supabase Cloud Database!
                        supabase.table("subscriptions").insert({
                            "user_id": user_id,
                            "name": update.get("name", "New Sub"),
                            "amount": _safe_float(update.get("amount", 0)),
                            "cycle": "Monthly",
                            "nextDate": update.get("nextDate", "1st"),
                            "icon": update.get("icon", "🌿"),
                            "color": update.get("color", "#10B981")
                        }).execute()
                    except Exception as db_err:
                        print("Supabase Insert Error:", db_err)

        return ai_data

    except Exception as e:
        print("process_financial_chat Error:", traceback.format_exc())
        return {"reply": f"System Error: {str(e)}", "has_updates": False, "updates": []}


def generate_executive_briefing(
    transactions: List[Dict[str, Any]],
    goals: Optional[List[Dict[str, Any]]] = None,
    subscriptions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    if goals is None:
        goals = []
    if subscriptions is None:
        subscriptions = []

    income = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'income')
    expense = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'expense')
    sub_total = sum(_safe_float(s.get('amount')) for s in subscriptions)
    net_surplus = income - expense
    savings_rate = f"{round(((income - expense) / income * 100), 1)}%" if income > 0 else "0%"
    
    # Calculate categories
    cat_spend: Dict[str, float] = {}
    for t in transactions:
        if t.get('type') == 'expense':
            cat = t.get('category', 'General')
            cat_spend[cat] = cat_spend.get(cat, 0.0) + _safe_float(t.get('amount'))
    top_leak = max(cat_spend, key=cat_spend.get) if cat_spend else "Fixed Bills"

    # Velocity score calculation
    raw_score = 50.0
    if income > 0:
        ratio = (income - expense) / income
        raw_score += ratio * 40.0
    if len(transactions) > 5:
        raw_score += 10.0
    velocity_score = max(10, min(99, int(round(raw_score))))
    
    tier = (
        "Hyper-Compounding" if velocity_score >= 80 else
        "Steady Accumulation" if velocity_score >= 60 else
        "Balanced Liquidity" if velocity_score >= 40 else
        "High Outflow Alert"
    )

    runway_months = round(max(0.5, (income - expense * 0.4) / (expense or 1.0) * 3), 1) if expense > 0 else 12.0

    fallback_result = {
        "wealth_velocity_score": velocity_score,
        "velocity_tier": tier,
        "monthly_runway_months": runway_months,
        "top_leak_category": top_leak,
        "savings_rate_pct": savings_rate,
        "net_monthly_surplus": max(0, int(round(net_surplus))),
        "headline": f"Cash flow velocity is {tier.lower()} with {savings_rate} retention capacity.",
        "key_insights": [
            f"Monthly revenue of ${income:,.0f} generates a positive net surplus of ${net_surplus:,.0f}.",
            f"Highest expense concentration detected in '{top_leak}' totaling ${cat_spend.get(top_leak, 0):,.0f}.",
            f"Active recurring commitments account for ${sub_total:,.0f}/mo across {len(subscriptions)} tracked services."
        ],
        "tactical_action": f"Automate reallocation of ${max(500, int(net_surplus * 0.4)):,.0f} monthly surplus into tax-advantaged compound index vehicles."
    }

    if not client:
        return fallback_result

    system_prompt = f"""
You are the WealthSage Chief AI Strategist. Perform an executive quantitative briefing on the user's financial telemetry.
Respond STRICTLY with valid JSON.

LEDGER DATA:
Income: ${income:,.2f} | Expense: ${expense:,.2f} | Net Surplus: ${net_surplus:,.2f}
Top Expense Categories: {json.dumps(cat_spend)}
Active Subscriptions: {len(subscriptions)} items (${sub_total:,.2f}/mo)
Goals: {json.dumps(goals)}

REQUIRED JSON FORMAT:
{{
    "wealth_velocity_score": {velocity_score},
    "velocity_tier": "{tier}",
    "monthly_runway_months": {runway_months},
    "top_leak_category": "{top_leak}",
    "savings_rate_pct": "{savings_rate}",
    "net_monthly_surplus": {max(0, int(round(net_surplus)))},
    "headline": "One impactful executive summary sentence with precise numbers",
    "key_insights": [
        "First quantitative strategic observation",
        "Second quantitative risk or allocation observation",
        "Third forward-looking compounding observation"
    ],
    "tactical_action": "One high-yield tactical instruction with projected ROI"
}}
"""

    try:
        response = client.chat.completions.create(
            messages=[{"role": "system", "content": system_prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=800
        )
        ai_data = json.loads(response.choices[0].message.content or "{}")
        # Ensure all keys exist
        for k, v in fallback_result.items():
            if k not in ai_data:
                ai_data[k] = v
        return ai_data
    except Exception as e:
        print("generate_executive_briefing Error:", traceback.format_exc())
        return fallback_result


def generate_financial_audit(transactions: list) -> dict:
    income = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'income')
    expense = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'expense')
    savings_rate = f"{round(((income - expense) / income * 100), 1)}%" if income > 0 else "0%"
    alert = "Safe" if income > expense else "Critical" if expense > income * 1.2 else "Warning"

    if not client:
        return {
            "alert_level": alert,
            "savings_rate_percentage": savings_rate,
            "report": f"Audit calculated based on ledger data ({len(transactions)} transactions). Total Income: ${income:,.2f} | Total Expenses: ${expense:,.2f}."
        }

    system_prompt = f"""
You are WealthSage, a brutal, honest, and highly intelligent financial advisor.
The user is providing their entire transaction history:
{json.dumps(transactions)}

Analyze this data mathematically and logically. Provide a financial audit in valid JSON format.
You MUST respond in valid JSON format exactly matching this structure:
{{
    "alert_level": "Safe" | "Warning" | "Critical",
    "savings_rate_percentage": "Calculate the percentage of income saved",
    "report": "A 3-paragraph markdown formatted report. Paragraph 1: Brutal summary of their spending habits..."
}}
"""

    try:
        response = client.chat.completions.create(
            messages=[{"role": "system", "content": system_prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1024
        )
        return json.loads(response.choices[0].message.content or "{}")
    except Exception as e:
        print("generate_financial_audit Error:", traceback.format_exc())
        return {"report": f"Audit calculated based on ledger: Savings rate is {savings_rate}. Status: {alert}.", "alert_level": alert, "savings_rate_percentage": savings_rate}


def generate_tutor_explanation(note_content: str) -> dict:
    if not client:
        return {
            "explanation": "WealthSage Tutor is operating in offline mode. Please configure GROQ_API_KEY to activate."
        }

    system_prompt = """
You are WealthSage Tutor, a world-class financial educator and quant tutor.
Analyze the user's notes and concepts. Provide deep financial clarification, mathematical formulas, and actionable insights.
Use LaTeX formatting with $ for inline math and $$ for block math equations.
Keep the explanation lucid, rigorous, and inspiring.
"""

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Please review and explain this financial note in depth:\n\n{note_content}"}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            max_tokens=1024
        )
        return {"explanation": response.choices[0].message.content or ""}
    except Exception as e:
        return {"explanation": f"Tutor reasoning failed: {str(e)}"}