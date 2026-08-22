import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * POST /api/reset — Full ledger reset: clears ALL data tables for a user
 * Body: { user_id: string, scope?: "all" | "transactions" | "goals" | "subscriptions" | "chat" }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id = "demo-user-id", scope = "all" } = body;

  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json({
      status: "demo-mode",
      message: "Supabase not configured — reset is local-only. Deploy with Supabase env vars for persistence.",
      cleared: [],
    });
  }

  const cleared: string[] = [];
  const errors: string[] = [];

  const tablesToReset = scope === "all"
    ? ["transactions", "goals", "subscriptions", "notes", "chat_messages"]
    : [scope];

  for (const table of tablesToReset) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("user_id", user_id);

      if (error) {
        console.error(`[Reset] Failed to clear ${table}:`, error);
        errors.push(`${table}: ${error.message}`);
      } else {
        cleared.push(table);
      }
    } catch (e: any) {
      errors.push(`${table}: ${e.message}`);
    }
  }

  // Log the reset action in audit_logs (before clearing audit logs if scope is all)
  if (scope === "all" && cleared.length > 0) {
    try {
      await supabase.from("audit_logs").insert({
        user_id,
        action: "FULL_LEDGER_RESET",
        resource_type: "ALL_TABLES",
        resource_id: user_id,
        severity: "WARNING",
      });
    } catch {
      // Non-critical
    }
  }

  return NextResponse.json({
    status: errors.length === 0 ? "success" : "partial",
    cleared,
    errors: errors.length > 0 ? errors : undefined,
    message: `Reset completed. Cleared tables: ${cleared.join(", ")}`,
  });
}
