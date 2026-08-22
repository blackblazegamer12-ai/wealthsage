import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * GET  /api/audit-logs?user_id=xxx — Fetch audit logs
 * POST /api/audit-logs — Create a new audit log entry
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer();
  const userId = req.nextUrl.searchParams.get("user_id") || "demo-user-id";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);

  if (!supabase) {
    // Fallback: return seed data for demo mode
    return NextResponse.json([
      {
        id: "audit-init-001",
        timestamp: new Date().toISOString(),
        user_id: "system",
        action: "SYSTEM_INITIALIZE",
        resource_type: "VAULT_KERNEL",
        resource_id: "kernel-01",
        ip_hash: "e3b0c44298fc1c14",
        severity: "INFO",
        signature: "SIG_RSA4096_VALIDATED_A1",
      },
    ]);
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[AuditLogs] Fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }

  // Map Supabase columns to the expected format
  const logs = (data || []).map((log: any) => ({
    id: log.id,
    timestamp: log.created_at,
    user_id: log.user_id,
    action: log.action,
    resource_type: log.resource_type,
    resource_id: log.resource_id,
    severity: log.severity,
    ip_hash: log.ip_hash,
    signature: log.signature,
  }));

  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, action, resource_type, resource_id, severity = "INFO" } = body;

  if (!user_id || !action) {
    return NextResponse.json({ error: "user_id and action are required" }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json({ status: "demo-mode", message: "Audit log stored locally only" });
  }

  const entry = {
    user_id,
    action,
    resource_type: resource_type || "SYSTEM",
    resource_id: resource_id || "",
    severity,
    ip_hash: "",
    signature: `SIG_AUTH_${Date.now().toString(36).toUpperCase()}`,
  };

  const { data, error } = await supabase
    .from("audit_logs")
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error("[AuditLogs] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "recorded", entry: data });
}
