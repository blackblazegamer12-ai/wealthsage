import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { detectSubscriptionTraps } from '@/lib/subscriptionAuditor';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
    
    // Pass the Clerk token to Supabase client so RLS is enforced
    const supabase = getSupabaseServer(token);
    
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const userId = body.userId || 'demo-user-id';

    // Fetch transactions from DB securely (RLS applies if token is present)
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true }); // Ensure chronological order for delta calc

    if (error) throw error;

    // Run the algorithmic heuristic engine
    const auditSummary = detectSubscriptionTraps(transactions || []);

    return NextResponse.json({
      success: true,
      data: auditSummary
    });
  } catch (error: any) {
    console.error('[Subscription Audit] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
