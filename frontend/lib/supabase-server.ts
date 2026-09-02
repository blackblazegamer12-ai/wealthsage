import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Server-side Supabase client (for API routes).
 * Uses SUPABASE_URL and SUPABASE_SERVICE_KEY (service role key) for full access.
 * Falls back to NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseServer(clerkToken?: string): SupabaseClient | null {
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

  const options: any = {
    auth: { persistSession: false },
  };

  if (clerkToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    };
  }

  try {
    return createClient(url, key, options);
  } catch {
    return null;
  }
}
