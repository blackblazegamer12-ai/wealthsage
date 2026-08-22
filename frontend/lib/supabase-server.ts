import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Server-side Supabase client (for API routes).
 * Uses SUPABASE_URL and SUPABASE_SERVICE_KEY (service role key) for full access.
 * Falls back to NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseServer(): SupabaseClient | null {
  if (_client) return _client;

  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !key || url === "https://localhost.invalid") {
    return null;
  }

  try {
    _client = createClient(url, key, {
      auth: { persistSession: false },
    });
    return _client;
  } catch {
    return null;
  }
}
