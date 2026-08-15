const HTML_TAG_PATTERN = /<[^>]*>/g;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Sanitizes short, user-entered labels before they are persisted or rendered. */
export function sanitizeTextInput(input: string, maxLength = 160): string {
  return input
    .replace(HTML_TAG_PATTERN, "")
    .replace(CONTROL_CHARACTERS, "")
    .trim()
    .slice(0, maxLength);
}

/** Parses a currency value into a safe, bounded amount. */
export function sanitizeAmount(input: string | number): number {
  const parsed = typeof input === "number" ? input : Number.parseFloat(input);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(parsed, 0), 999_999_999);
}

/** Returns true only for an actual public Supabase configuration. */
export function isValidSupabaseConfig(url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY): boolean {
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder.supabase.co") &&
      url !== "https://placeholder.supabase.co" &&
      key !== "placeholder"
  );
}
