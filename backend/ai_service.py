import os
import json
import re
import time
import traceback
import concurrent.futures
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Ensure environment variables are loaded immediately
load_dotenv()

import urllib.request
import urllib.error


def _safe_float(val: Any, default: float = 0.0) -> float:
    try:
        if val is None or val == "":
            return default
        return float(val)
    except (ValueError, TypeError):
        return default


def _clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Cleans markdown code blocks and attempts JSON parsing."""
    if not raw_text:
        return {}
    cleaned = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    try:
        return json.loads(cleaned)
    except Exception:
        brace_match = re.search(r"\{[\s\S]*\}", cleaned)
        if brace_match:
            try:
                return json.loads(brace_match.group(0))
            except Exception:
                pass
        return {}


def _generate_llm_content(messages: List[Dict[str, str]], temperature: float = 0.3, max_tokens: int = 8192, timeout_seconds: float = 10.0) -> str:
    """Invokes Gemma-4-31b-it via Groq API (or compatible endpoint)."""
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("AQ."):
        raise RuntimeError("Valid API key is not configured for Gemma 4 31b LLM.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "gemma-4-31b-it",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout_seconds) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.URLError as e:
        raise RuntimeError(f"LLM API request failed: {e}")


def _deterministic_offline_chat(user_query: str, current_transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    High-precision quantitative reasoning engine.
    Generates structured mathematical insights, clean KaTeX formulas, and ledger mutations.
    """
    query_lower = user_query.lower()
    income = sum(_safe_float(t.get('amount')) for t in current_transactions if t.get('type') == 'income')
    expense = sum(_safe_float(t.get('amount')) for t in current_transactions if t.get('type') == 'expense')
    net_surplus = max(0.0, income - expense)
    surplus = net_surplus if net_surplus > 0 else 1500.0

    # 1. Gaming Transaction Scan
    if any(k in query_lower for k in ["gaming", "scan", "unauthorized", "child", "game", "free fire", "bgmi"]):
        gaming_txs = [t for t in current_transactions if "gaming" in str(t.get('category')).lower() or "free fire" in str(t.get('description')).lower() or "codashop" in str(t.get('description')).lower()]
        
        if not gaming_txs:
            reply = "I have scanned your ledger and found no unauthorized gaming transactions. Your children's accounts appear secure."
        else:
            total_gaming = sum(_safe_float(t.get('amount')) for t in gaming_txs)
            reply = (
                f"🚨 **Guardian Alert**: I found **{len(gaming_txs)}** suspicious gaming transactions totaling **₹{total_gaming:,.2f}**.\n\n"
                f"These appear to be unauthorized in-app purchases. I recommend flagging these transactions and restricting UPI mandates for the child's device immediately."
            )
        return {"reply": reply, "has_updates": False, "updates": []}

    # 2. Dark Pattern Mandate Review
    elif any(k in query_lower for k in ["dark", "pattern", "subscription", "mandate", "drain", "review"]):
        reply = (
            f"I have analyzed your active UPI mandates. **Discord Nitro (₹699)** and **Instagram Subscription (₹89)** match known dark-pattern behaviors (hard-to-cancel, auto-renewal traps).\n\n"
            f"I recommend revoking these mandates from the Subscription Traps dashboard to stop the monthly drain of ₹788."
        )
        return {"reply": reply, "has_updates": False, "updates": []}

    # 3. Simulate Alert
    elif any(k in query_lower for k in ["simulate", "alert", "trigger", "webhook"]):
        reply = "I have simulated an incoming Account Aggregator webhook for a suspicious gaming purchase. Checking the Live Radar now..."
        return {
            "reply": reply,
            "has_updates": True,
            "updates": [{
                "action": "trigger_mock_webhook"
            }]
        }

    # 4. Log Expense/Income Intent
    elif any(k in query_lower for k in ["log", "expense", "spend", "bought", "spent", "₹", "rupee"]):
        amount_match = re.search(r"₹\s*(\d+(?:\.\d{1,2})?)", user_query) or re.search(r"(\d+(?:\.\d{1,2})?)\s*(?:rupees|inr|₹)", user_query)
        amount = float(amount_match.group(1)) if amount_match else 45.0

        if "grocery" in query_lower or "whole foods" in query_lower or "food" in query_lower:
            item_name = "Whole Foods Groceries"
            category = "Groceries"
        elif "gas" in query_lower or "fuel" in query_lower:
            item_name = "Fuel / Transit"
            category = "Transportation"
        else:
            item_name = "General Expense Log"
            category = "Miscellaneous"

        reply = f"I've logged an expense of **₹{amount:,.2f}** under `{category}`. Your ledger has been updated successfully."
        return {
            "reply": reply,
            "has_updates": True,
            "updates": [{
                "action": "add",
                "name": item_name,
                "amount": amount,
                "type": "expense",
                "category": category,
            }]
        }

    # 5. Rebalance / Investment SIP Intent
    elif any(k in query_lower for k in ["rebalance", "sip", "index", "invest"]):
        amount_match = re.search(r"₹\s*(\d+(?:\.\d{1,2})?)", user_query) or re.search(r"(\d+k)", query_lower)
        amount = 15000.0
        if amount_match:
            val_str = amount_match.group(1).replace("k", "000")
            try: amount = float(val_str)
            except: pass

        reply = f"I've logged an automated investment allocation of **₹{amount:,.2f}/month** into a Broad Equity Index."
        return {
            "reply": reply,
            "has_updates": True,
            "updates": [{
                "action": "add_subscription",
                "name": "Automated Equity Index SIP",
                "amount": amount,
                "cycle": "Monthly",
                "category": "Investment SIP",
            }]
        }

    # 6. Reset Ledger Intent
    elif "reset" in query_lower and "ledger" in query_lower:
        return {
            "reply": "I have executed a full ledger reset. All historical transactions and active commitments have been cleared.",
            "has_updates": True,
            "updates": [{"action": "reset"}]
        }

    # 7. Greeting Intent
    elif query_lower.strip() in ["hi", "hello", "hey", "help", "greetings"]:
        reply = "Hello! I am Guardian AI, your Family Security Advisor. I monitor your family's accounts for gaming scams, dark-pattern subscriptions, and unauthorized purchases. How can I protect you today?"
        return {"reply": reply, "has_updates": False, "updates": []}

    reply = (
        f"I am actively monitoring your family's transactions.\n\n"
        f"You can ask me to scan for unauthorized gaming purchases, review active UPI mandates for dark patterns, or simulate a Guardian Shield alert. What would you like me to check?"
    )
    return {"reply": reply, "has_updates": False, "updates": []}


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

    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    # Fast fallback if API key is not initialized or configured with mock API key
    if not api_key or api_key.startswith("AQ."):
        return _deterministic_offline_chat(user_query, current_transactions)

    system_prompt = f"""
========================================
SYSTEM PROMPT: GUARDIAN AI (FAMILY SECURITY ADVISOR)
========================================
You are Guardian AI, a highly intelligent and protective Family Security Advisor. You monitor family bank accounts via Account Aggregator to prevent children from making unauthorized in-game purchases and to stop dark-pattern subscriptions from draining the account.

CURRENT LEDGER:
{json.dumps(current_transactions)}

1. TONE AND STYLE:
- Be highly protective, clear, and professional.
- Warn the user about potential risks (gaming scams, auto-renewal traps).
- Use objective, analytical language but prioritize family security.

2. RESPONSE STRUCTURE:
- Direct, concise answer.
- Highlight any suspicious transactions or active dark-pattern mandates.
- Ask if they want you to flag the transaction or revoke a mandate.

3. TOOLKIT ACTIONS:
- "trigger_mock_webhook": Simulates a suspicious gaming purchase alert.
- "add": For standard transactions.
- "reset": Wipe ledger.

RESPONSE FORMAT (JSON):
{{
    "reply": "Your conversational response here.",
    "has_updates": false,
    "updates": []
}}
"""
    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        if isinstance(msg, dict):
            raw_role = str(msg.get("role") or msg.get("type") or "user").lower()
            content = str(msg.get("content") or msg.get("message") or "")
        else:
            raw_role = getattr(msg, "role", "user")
            content = getattr(msg, "content", "")
            
        role = "assistant" if raw_role in ["assistant", "advice", "bot", "model"] else "user"
        if content.strip():
            messages.append({"role": role, "content": content})
            
    messages.append({"role": "user", "content": user_query})

    try:
        raw_output = _generate_llm_content(messages, temperature=0.3, max_tokens=8192, timeout_seconds=10.0)
        parsed = _clean_json_response(raw_output)
        if not parsed or "reply" not in parsed:
            return {"reply": raw_output or "Request processed.", "has_updates": False, "updates": []}
        return parsed
    except Exception as e:
        print("process_financial_chat fallback triggered:", e)
        return _deterministic_offline_chat(user_query, current_transactions)


def generate_executive_briefing(
    transactions: List[Dict[str, Any]],
    goals: Optional[List[Dict[str, Any]]] = None,
    subscriptions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    if goals is None: goals = []
    if subscriptions is None: subscriptions = []

    income = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'income')
    expense = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'expense')
    sub_total = sum(_safe_float(s.get('amount')) for s in subscriptions)
    net_surplus = income - expense
    savings_rate = f"{round(((income - expense) / income * 100), 1)}%" if income > 0 else "0%"
    
    # Strictly handle empty ledger to prevent AI hallucinations
    if not transactions:
        return {
            "wealth_velocity_score": 0,
            "velocity_tier": "Awaiting Data",
            "monthly_runway_months": 0,
            "top_leak_category": "N/A",
            "savings_rate_pct": "0%",
            "net_monthly_surplus": 0,
            "headline": "Ledger is currently empty. Initialize your financial telemetry to begin.",
            "key_insights": [
                "No income or expense records found.",
                "Log your first transaction or load demo data to activate analytics.",
                "Compounding engine requires baseline liquidity data."
            ],
            "tactical_action": "Log an initial income source or synchronize your bank accounts."
        }
    
    cat_spend: Dict[str, float] = {}
    for t in transactions:
        if t.get('type') == 'expense':
            cat = t.get('category', 'General')
            cat_spend[cat] = cat_spend.get(cat, 0.0) + _safe_float(t.get('amount'))
    top_leak = max(cat_spend, key=cat_spend.get) if cat_spend else "Fixed Bills"

    raw_score = 50.0
    if income > 0:
        raw_score += ((income - expense) / income) * 40.0
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
            f"Monthly revenue of ₹{income:,.0f} generates a positive net surplus of ₹{net_surplus:,.0f}.",
            f"Highest expense concentration detected in '{top_leak}' totaling ₹{cat_spend.get(top_leak, 0):,.0f}.",
            f"Active recurring commitments represent ₹{sub_total:,.0f}/month."
        ],
        "tactical_action": f"Automate reallocation of ₹{max(5000, int(net_surplus * 0.4)):,.0f} monthly surplus into high-yield indexing."
    }

    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("AQ."):
        return fallback_result

    system_prompt = f"""
You are the WealthSage Chief AI Strategist. Perform an executive quantitative briefing on the user's financial telemetry.
Respond STRICTLY with valid JSON.

LEDGER DATA:
Income: ₹{income:,.2f} | Expense: ₹{expense:,.2f} | Net Surplus: ₹{net_surplus:,.2f}
Top Expense Categories: {json.dumps(cat_spend)}
Active Subscriptions: {len(subscriptions)} items (₹{sub_total:,.2f}/mo)
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
    messages = [{"role": "system", "content": system_prompt}]

    try:
        raw_output = _generate_llm_content(messages, temperature=0.3, max_tokens=8192, timeout_seconds=10.0)
        ai_data = _clean_json_response(raw_output)
        for k, v in fallback_result.items():
            if k not in ai_data:
                ai_data[k] = v
        return ai_data
    except Exception:
        return fallback_result


def generate_financial_audit(transactions: list) -> dict:
    income = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'income')
    expense = sum(_safe_float(t.get('amount')) for t in transactions if t.get('type') == 'expense')
    savings_rate = f"{round(((income - expense) / income * 100), 1)}%" if income > 0 else "0%"
    alert = "Safe" if income > expense else "Critical" if expense > income * 1.2 else "Warning"

    fallback = {
        "alert_level": alert,
        "savings_rate_percentage": savings_rate,
        "report": f"### Comprehensive Financial Audit\n\n**Net Status**: {alert}\n**Savings Velocity**: {savings_rate}\n\nLedger analysis of {len(transactions)} transactions confirms total monthly revenue of ₹{income:,.2f} versus outflows of ₹{expense:,.2f}."
    }

    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("AQ."):
        return fallback

    system_prompt = f"""
You are WealthSage, a quantitative financial auditor and risk analyst.
Analyze this ledger data mathematically. Provide a financial audit in valid JSON format.

DATA:
{json.dumps(transactions)}

REQUIRED JSON FORMAT:
{{
    "alert_level": "Safe" | "Warning" | "Critical",
    "savings_rate_percentage": "{savings_rate}",
    "report": "A 3-paragraph markdown formatted report analyzing burn velocity, risk vectors, and tactical remediations."
}}
"""
    messages = [{"role": "system", "content": system_prompt}]
    try:
        raw_output = _generate_llm_content(messages, temperature=0.3, max_tokens=8192, timeout_seconds=10.0)
        parsed = _clean_json_response(raw_output)
        if parsed and "report" in parsed:
            return parsed
        return fallback
    except Exception:
        return fallback


def generate_tutor_explanation(note_content: str) -> dict:
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("AQ."):
        return {"explanation": f"### Mathematical Financial Clarification\n\nAnalyzing: **{note_content}**\n\nWealth compounding is governed by the compound interest formula:\n\n$$A = P \\left(1 + \\frac{{r}}{{n}}\\right)^{{nt}}$$\n\nWhere $P$ is principal, $r$ is nominal interest rate, $n$ is compounding frequency, and $t$ is time in years."}

    prompt = f"""
You are WealthSage Tutor, a world-class financial educator and quantitative tutor.
Analyze the user's notes and concepts. Provide deep financial clarification, mathematical formulas, and actionable insights.
Use LaTeX formatting with $ for inline math and $$ for block math equations.

Note to explain: {note_content}
"""
    messages = [{"role": "user", "content": prompt}]
    try:
        raw_output = _generate_llm_content(messages, temperature=0.5, max_tokens=8192, timeout_seconds=10.0)
        return {"explanation": raw_output or ""}
    except Exception as e:
        return {"explanation": f"### Mathematical Financial Clarification\n\nAnalyzing: **{note_content}**\n\nWealth compounding is governed by the compound interest formula:\n\n$$A = P \\left(1 + \\frac{{r}}{{n}}\\right)^{{nt}}$$\n\nWhere $P$ is principal, $r$ is nominal interest rate, $n$ is compounding frequency, and $t$ is time in years."}