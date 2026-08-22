import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

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
  const body = await req.json();
  const { message, history = [], transactions = [], user_id = "demo-user-id" } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

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
  const income = transactions.filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const expense = transactions.filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const net = income - expense;

  // Log expense
  if (q.match(/log|expense|spent|bought|\$/)) {
    const amtMatch = message.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
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
      reply: `✅ Logged expense of **$${amount.toFixed(2)}** under \`${cat}\`. Your ledger has been updated.`,
      has_updates: true,
      updates: [{ action: "add", name, amount, type: "expense", category: cat }],
    };
  }

  // Log income
  if (q.match(/income|earned|received|paycheck|salary/)) {
    const amtMatch = message.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : 5000;
    return {
      reply: `✅ Logged income of **$${amount.toFixed(2)}**. Your revenue telemetry is updated.`,
      has_updates: true,
      updates: [{ action: "add", name: "Income Record", amount, type: "income", category: "Salary" }],
    };
  }

  // Trend analysis
  if (q.match(/trend|analysis|report|pattern|history|over time|month|week/)) {
    const catSpend: Record<string, number> = {};
    transactions.filter((t: any) => t.type === "expense").forEach((t: any) => {
      const c = t.category || "General";
      catSpend[c] = (catSpend[c] || 0) + (Number(t.amount) || 0);
    });
    const topCats = Object.entries(catSpend).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const catLines = topCats.map(([c, v]) => `- **${c}**: $${v.toFixed(2)}`).join("\n");
    const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : "0";

    return {
      reply: `### 📊 Financial Trend Analysis\n\n**Current Period Overview:**\n- **Total Income**: $${income.toFixed(2)}\n- **Total Expenses**: $${expense.toFixed(2)}\n- **Net Surplus**: $${net.toFixed(2)}\n- **Savings Rate**: ${savingsRate}%\n\n**Expense Distribution by Category:**\n${catLines || "- No expense data available"}\n\n**Trend Insights:**\n${net > 0 ? `✅ Positive cash flow trend — you're saving ${savingsRate}% of income.` : `⚠️ Negative cash flow detected — expenses exceed income by $${Math.abs(net).toFixed(2)}.`}\n\n$${net > 0 ? `$$\\text{Velocity}_{\\text{wealth}} = \\frac{\\text{Net Surplus}}{\\text{Income}} = ${(net / income * 100).toFixed(1)}\\%$$` : ""}\n\nAsk me to **forecast 5-year compounding**, **audit specific categories**, or **modify individual records**.`,
      has_updates: false,
      updates: [],
    };
  }

  // 5-year forecast
  if (q.match(/forecast|compound|5-year|trajectory|surplus|projection/)) {
    const surplus = Math.max(0, net) || 1500;
    const months = 60;
    const r_m = 0.08 / 12;
    const futureVal = surplus * ((Math.pow(1 + r_m, months) - 1) / r_m);

    return {
      reply: `### 5-Year Compounding Projection\n\nBased on your monthly surplus of **$${surplus.toFixed(2)}**:\n\n$$A(t) = S \\times \\frac{(1 + r/n)^{nt} - 1}{r/n} = \$${futureVal.toFixed(2)}$$\n\n- **Principal Invested**: $${(surplus * 60).toFixed(2)}\n- **Compound Alpha**: $${(futureVal - surplus * 60).toFixed(2)}\n- **Growth Multiplier**: ${(futureVal / (surplus * 60 || 1)).toFixed(1)}x`,
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
      reply: `### Zero-Revenue Survival Runway\n\n$$\\text{Runway} = \\frac{\\text{Reserves}}{\\text{Burn Rate}} = ${months}\\text{ months}$$\n\n- **Estimated Reserves**: $${reserve.toFixed(2)}\n- **Monthly Burn**: $${burn.toFixed(2)}\n- **Runway**: **${months} months** ${parseFloat(months) >= 6 ? "✅" : "⚠️ Below 6-month safeguard"}`,
      has_updates: false,
      updates: [],
    };
  }

  // Audit
  if (q.match(/audit|leak|waste|spending|outflow/)) {
    const catSpend: Record<string, number> = {};
    transactions.filter((t: any) => t.type === "expense").forEach((t: any) => {
      const c = t.category || "General";
      catSpend[c] = (catSpend[c] || 0) + (Number(t.amount) || 0);
    });
    const top = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];

    return {
      reply: `### Cash Flow Audit\n\n- **Total Outflow**: $${expense.toFixed(2)}/mo\n- **Top Leak**: ${top ? `${top[0]} ($${top[1].toFixed(2)})` : "N/A"}\n- **Status**: ${income > expense ? "✅ Safe" : "⚠️ Warning — expenses exceed income"}\n\n**Recommendation**: Review ${top ? top[0] : "subscription"} spending for potential savings.`,
      has_updates: false,
      updates: [],
    };
  }

  // Reset
  if (q.includes("reset") && (q.includes("ledger") || q.includes("all") || q.includes("everything"))) {
    return {
      reply: "🔄 Executing full ledger reset. All transactions, goals, subscriptions, and chat history will be cleared.",
      has_updates: true,
      updates: [{ action: "reset" }],
    };
  }

  // General
  return {
    reply: `### WealthSage AI\n\nAnalyzing: *"${message}"*\n\n**Active Ledger:**\n- Income: $${income.toFixed(2)}/mo\n- Expenses: $${expense.toFixed(2)}/mo\n- Net: $${net.toFixed(2)}/mo\n\nYou can ask me to:\n- **Log expenses/income** — "Log $45 grocery run"\n- **Trend analysis** — "Show me my spending trends"\n- **5-year forecast** — "Forecast my compound growth"\n- **Audit spending** — "Audit my cash leaks"\n- **Evaluate runway** — "What's my zero-income runway?"`,
    has_updates: false,
    updates: [],
  };
}
