import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { z } from "zod";

const chatPayloadSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z.array(z.any()).optional(),
  transactions: z.array(z.any()).optional(),
  user_id: z.string().optional()
});

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * POST /api/chat — Send a message and persist both user + assistant messages
 * GET  /api/chat?user_id=xxx — Fetch chat history from Supabase
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer();
  const userId = req.nextUrl.searchParams.get("user_id") || "demo-user-id";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100", 10);

  if (!supabase) {
    return NextResponse.json({ messages: [], error: "Supabase not configured" }, { status: 200 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[Chat API] Fetch error:", error);
    return NextResponse.json({ messages: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = chatPayloadSchema.parse(body);
    
    const { message, history = [], transactions = [], user_id = "demo-user-id" } = validatedData;

    const supabase = getSupabaseServer();

  // 1. Save user message to Supabase
  if (supabase) {
    try {
      await supabase.from("chat_messages").insert({
        user_id,
        role: "user",
        content: message,
      });
    } catch (e) {
      console.warn("[Chat] Failed to save user message:", e);
    }
  }

  // 2. Call the backend API for AI response (or use fallback)
  let aiResult: any;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, transactions, user_id }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    aiResult = await res.json();
  } catch (err) {
    console.warn("[Chat] Backend unavailable, using client-side fallback:", err);
    // Client-side fallback for Vercel (no Python backend)
    aiResult = generateClientSideChat(message, transactions);
  }

  const reply = aiResult?.reply || "Request processed.";
  const hasUpdates = aiResult?.has_updates || false;
  const updates = aiResult?.updates || [];

  // 3. Save assistant message to Supabase
  if (supabase) {
    try {
      await supabase.from("chat_messages").insert({
        user_id,
        role: "assistant",
        content: reply,
      });
    } catch (e) {
      console.warn("[Chat] Failed to save assistant message:", e);
    }

    // 4. Log audit entry
    try {
      await supabase.from("audit_logs").insert({
        user_id,
        action: "AI_CHAT_INTERACTION",
        resource_type: "CHAT_ENGINE",
        resource_id: `msg-${Date.now()}`,
        severity: "INFO",
      });
    } catch {
      // Non-critical
    }
  }

  return NextResponse.json({
    reply,
    has_updates: hasUpdates,
    updates,
  });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload format", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — Clear all chat history for a user
export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseServer();
  const userId = req.nextUrl.searchParams.get("user_id") || "demo-user-id";

  if (!supabase) {
    return NextResponse.json({ status: "no-op", message: "Supabase not configured" });
  }

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "cleared" });
}

/**
 * Client-side chat fallback when Python backend is unavailable.
 * Handles common financial queries and CRUD intents.
 */
function generateClientSideChat(message: string, transactions: any[]) {
  const q = message.toLowerCase();
  const income = transactions.filter((t: any) => t.type === "inflow").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const expense = transactions.filter((t: any) => t.type === "outflow").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const net = income - expense;

  // Log expense
  if (q.match(/log|expense|spent|bought/)) {
    const amtMatch = message.match(/₹\s*(\d+(?:\.\d{1,2})?)/) || message.match(/(\d+(?:\.\d{1,2})?)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : 45;
    const cat = q.includes("grocery") || q.includes("food") ? "Groceries"
      : q.includes("gas") || q.includes("fuel") ? "Transport"
      : q.includes("rent") || q.includes("housing") ? "Housing"
      : "Miscellaneous";
    const name = q.includes("grocery") || q.includes("food") ? "Groceries"
      : q.includes("gas") || q.includes("fuel") ? "Fuel / Transit"
      : q.includes("rent") ? "Rent Payment"
      : "General Expense";

    return {
      reply: `🚀 **Expense Successfully Logged!**

💡 **Quick Breakdown:**
* **Amount:** ₹${amount.toFixed(2)}
* **Category:** ${cat}
* **Ledger Status:** Real-time sync complete

🎯 **Tactical Advice:** If this is a recurring subscription, ensure it's not a zombie sub! Tracking small recurring leaks is key to building wealth.

Would you like me to scan your recent expenses for any duplicate charges?`,
      has_updates: true,
      updates: [{ action: "add", description: name, amount, type: "outflow", category: cat }],
    };
  }

  // Log income
  if (q.match(/income|earned|received|paycheck|salary/)) {
    const amtMatch = message.match(/₹\s*(\d+(?:\.\d{1,2})?)/) || message.match(/(\d+(?:\.\d{1,2})?)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : 5000;
    return {
      reply: `🚀 **Income Successfully Logged!**

💡 **Quick Breakdown:**
* **Amount:** ₹${amount.toFixed(2)}
* **Type:** Inflow / Salary
* **Telemetry Status:** Cash flow updated

🎯 **Tactical Advice:** When fresh income hits, consider immediately sweeping a percentage into a low-cost index fund before lifestyle creep catches up. 

Would you like me to simulate how much this could compound over the next 5 years?`,
      has_updates: true,
      updates: [{ action: "add", description: "Income Record", amount, type: "inflow", category: "Salary" }],
    };
  }

  // Trend analysis (Summary / Audit)
  if (q.match(/trend|analysis|report|summary|total ledger/)) {
    const catSpend: Record<string, number> = {};
    transactions.filter((t: any) => t.type === "outflow").forEach((t: any) => {
      const c = t.category || "General";
      catSpend[c] = (catSpend[c] || 0) + (Number(t.amount) || 0);
    });
    const topCats = Object.entries(catSpend).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const catLines = topCats.map(([c, v]) => `* **${c}**: ₹${v.toFixed(2)}`).join("\n");
    const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : "0";

    return {
      reply: `🚀 **Your Cash Flow Summary**

💡 **The Simple Breakdown:**
* **Total Inflow:** ₹${income.toFixed(2)}
* **Total Outflow:** ₹${expense.toFixed(2)}
* **Net Surplus:** ₹${net.toFixed(2)} (**${savingsRate}%** savings rate)

🎯 **Tactical Action:**
Your top expenses are:
${catLines || "* No expense data yet"}
Consider optimizing your largest category first. For example, if 'Digital' is high, switching to JioFiber or canceling unused OTT platforms can boost your savings rate immediately.

Which category should we audit first to find leaks?`,
      has_updates: false,
      updates: [],
    };
  }

  // 5-year forecast
  if (q.match(/forecast|compound|what if|years|projection|invest|save/)) {
    const amtMatch = message.match(/₹\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/) || message.match(/(\d+(?:,\d{3})*(?:\.\d{1,2})?)/);
    const parsedAmt = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : 0;
    
    // For hypotheticals, don't use the net ledger surplus if they explicitly gave a number
    const surplus = parsedAmt > 0 ? parsedAmt : (Math.max(0, net) || 1500);
    const months = 60;
    const r_m = 0.08 / 12;
    const futureVal = surplus * ((Math.pow(1 + r_m, months) - 1) / r_m);

    return {
      reply: `🚀 **Your 5-Year Wealth Trajectory**

💡 **The Simple Breakdown:**
* **Monthly Contribution:** ₹${surplus.toFixed(2)}
* **Total Principal Invested:** ₹${(surplus * 60).toFixed(2)}
* **Estimated Wealth at Year 5:** **₹${futureVal.toFixed(2)}** (assuming 8% annualized return)

🎯 **Tactical Action:**
Consistent compounding is powerful. You don't need fancy hedge funds; an automated SIP into a low-cost NIFTY 50 index fund is often enough to outpace inflation.

Would you like to simulate a different monthly amount or change the timeline?`,
      has_updates: false,
      updates: [],
    };
  }

  // Runway
  if (q.match(/runway|zero|survival|emergency|burn/)) {
    const burn = expense || 2400;
    const reserve = Math.max(12000, net * 6);
    const months = (reserve / burn).toFixed(1);

    return {
      reply: `You currently have a **${months}-month** emergency runway.\n\n- **Estimated Reserves:** ₹${reserve.toFixed(2)}\n- **Monthly Burn:** ₹${burn.toFixed(2)}\n\nIt is generally recommended to maintain at least a 6-month safety net to protect against unexpected financial disruptions. Would you like to explore strategies for building a stronger emergency fund?`,
      has_updates: false,
      updates: [],
    };
  }

  // Audit
  if (q.match(/audit|leak|waste|spending|outflow/)) {
    const catSpend: Record<string, number> = {};
    transactions.filter((t: any) => t.type === "outflow").forEach((t: any) => {
      const c = t.category || "General";
      catSpend[c] = (catSpend[c] || 0) + (Number(t.amount) || 0);
    });
    const top = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];

    return {
      reply: `Your top spending category is currently **${top ? top[0] : "General"}**.\n\n- **Total Monthly Outflow:** ₹${expense.toFixed(2)}\n- **Highest Spend:** ₹${top ? top[1].toFixed(2) : "0.00"}\n- **Cash Flow Status:** ${income > expense ? "Positive" : "Warning"}\n\nReviewing your expenses in ${top ? top[0] : "General"} could help identify subscriptions or services that can be swapped for more cost-effective alternatives. Would you like me to suggest some options?`,
      has_updates: false,
      updates: [],
    };
  }

  // Reset
  if (q.includes("reset") && (q.includes("ledger") || q.includes("all") || q.includes("everything"))) {
    return {
      reply: "Executing full ledger reset. All transactions, goals, subscriptions, and chat history will be cleared.",
      has_updates: true,
      updates: [{ action: "reset" }],
    };
  }

  // Greeting
  const greetingMatch = ["hi", "hello", "hey", "help", "greetings"].includes(q.trim());
  if (greetingMatch) {
    return {
      reply: `Hi there! 👋 I am WealthSage, your personal financial mentor. 

I'm here to help you ruthlessly optimize your expenses, protect your capital, and accelerate your compound growth.

What's on your mind today? Are we logging an expense or auditing your subscriptions?`,
      has_updates: false,
      updates: [],
    };
  }

  // General Fallback
  return {
    reply: `🚀 **Ready to Optimize**

💡 **Your Current Standing:**
* **Monthly Inflow:** ₹${income.toFixed(2)}
* **Monthly Outflow:** ₹${expense.toFixed(2)}
* **Cash Surplus:** ₹${net.toFixed(2)}

🎯 **Tactical Action:**
We can use this surplus to build an emergency runway or funnel it into your growth simulator. Try asking me: *"What if I save ₹5000 a month?"*

How would you like to proceed?`,
    has_updates: false,
    updates: [],
  };
}
