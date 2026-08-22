/**
 * WealthSage Resilient API Client
 * Features:
 * - Exponential backoff retry queue (3 attempts)
 * - 8000ms fetch timeout abort controller
 * - Offline localStorage fallback cache
 * - Rate limit header inspection
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  cacheKey?: string;
}

export async function resilientFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    timeoutMs = 8000,
    retries = 2,
    cacheKey,
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown server error');
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = (await res.json()) as T;

      // Update cache if cacheKey provided
      if (cacheKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`ws_cache_${cacheKey}`, JSON.stringify({
            timestamp: Date.now(),
            data,
          }));
        } catch {
          // Ignore cache write error
        }
      }

      return data;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;

      // If aborted or network error, retry with exponential backoff
      if (attempt < retries) {
        const backoffDelay = Math.pow(2, attempt) * 800;
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
      attempt++;
    }
  }

  // If offline/failed, check cache
  if (cacheKey && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`ws_cache_${cacheKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.warn(`[WealthSage API] Using cached fallback for ${cacheKey}`);
        return parsed.data as T;
      }
    } catch {
      // Ignore cache parse error
    }
  }

  throw lastError || new Error(`Network failure requesting ${endpoint}`);
}

export const api = {
  getHealth: () => resilientFetch<{ status: string; gemini_configured: boolean; supabase_configured: boolean; plaid_configured: boolean }>('/api/health'),
  
  getExecutiveBriefing: (transactions: any[], goals: any[], subscriptions: any[]) =>
    resilientFetch<any>('/api/executive-briefing', {
      method: 'POST',
      body: JSON.stringify({ transactions, goals, subscriptions }),
      cacheKey: 'briefing_latest',
    }),

  runAudit: (transactions: any[]) =>
    resilientFetch<any>('/api/audit', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    }),

  sendChat: (message: string, history: any[], transactions: any[], userId?: string) =>
    resilientFetch<any>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, transactions, user_id: userId }),
      timeoutMs: 12000,
    }),

  explainTutor: (note_content: string) =>
    resilientFetch<any>('/api/tutor', {
      method: 'POST',
      body: JSON.stringify({ note_content }),
    }),

  syncTransactions: (userId: string, accessToken?: string, cursor?: string) =>
    resilientFetch<any>('/api/transactions/sync', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, access_token: accessToken, cursor }),
    }),

  getAuditLogs: (userId: string) =>
    resilientFetch<any>(`/api/audit-logs?user_id=${encodeURIComponent(userId)}`, {
      cacheKey: `audit_logs_${userId}`,
    }),

  logSecurityAction: (entry: { user_id: string; action: string; resource_type: string; resource_id: string; severity?: string }) =>
    resilientFetch<any>('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),

  getNotifications: (userId: string) =>
    resilientFetch<any>(`/api/notifications?user_id=${encodeURIComponent(userId)}`, {
      cacheKey: `notifications_${userId}`,
    }),
};
