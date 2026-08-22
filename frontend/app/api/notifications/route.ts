import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/notifications?user_id=xxx — Fetch notifications
 * PATCH /api/notifications — Mark all as read
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer();
  const userId = req.nextUrl.searchParams.get("user_id") || "demo-user-id";

  if (!supabase) {
    return NextResponse.json([
      {
        id: "notif-001",
        title: "Sovereign Vault Synchronized",
        message: "Autonomous telemetry engine online with zero latency buffer loss.",
        type: "insight",
        read: false,
        created_at: "Just now",
      },
    ]);
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("[Notifications] Fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }

  const notifications = (data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    created_at: n.created_at,
  }));

  return NextResponse.json(notifications);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { user_id = "demo-user-id", mark_all_read = false } = body;

  const supabase = getSupabaseServer();

  if (!supabase || !mark_all_read) {
    return NextResponse.json({ status: "no-op" });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user_id)
    .eq("read", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "all-read" });
}
