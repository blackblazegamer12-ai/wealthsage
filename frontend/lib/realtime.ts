import { SupabaseClient } from '@supabase/supabase-js';

export type RealtimeCallback = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: any;
  old: any;
}) => void;

/**
 * Subscribes to Supabase Realtime changes on transactions, goals, or subscriptions.
 */
export function subscribeToTableChanges(
  supabase: SupabaseClient,
  table: 'transactions' | 'goals' | 'subscriptions' | 'notes',
  userId: string,
  onEvent: RealtimeCallback
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`public:${table}:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onEvent({
          eventType: payload.eventType as any,
          new: payload.new,
          old: payload.old,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
