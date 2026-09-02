import { NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateTransaction } from '@/lib/ruleEngine';
import { getSupabaseServer } from '@/lib/supabase-server';

const aaPayloadSchema = z.object({
  transactionId: z.string().optional(),
  amount: z.number(),
  merchant: z.string(),
  category: z.string(),
  actor: z.enum(['parent', 'child']),
  timestamp: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = aaPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const payload = result.data;

    // Process via Rule Engine for systemic fraud defense
    const tx = {
      id: payload.transactionId || crypto.randomUUID(),
      description: payload.merchant,
      amount: payload.amount,
      type: 'outflow' as 'outflow' | 'inflow',
      category: payload.category,
      date: payload.timestamp,
      created_at: new Date().toISOString(),
      user_id: 'demo-user-id',
      merchant: payload.merchant,
      status: 'approved',
      actor: payload.actor
    };

    // Insert into Supabase
    const supabase = getSupabaseServer();
    let currentLedger: any[] = [];
    if (supabase) {
      const { data } = await supabase.from('transactions').select('*').eq('user_id', 'demo-user-id').order('created_at', { ascending: false }).limit(20);
      if (data) currentLedger = data;
    }

    const alertResult = evaluateTransaction(tx, currentLedger);
    if (alertResult.shouldFlag) {
      tx.status = 'flagged';
    }

    if (supabase) {
      const { error } = await supabase.from('transactions').insert([tx]);
      if (error) {
        console.error('Webhook Supabase Insert Error:', error);
        return NextResponse.json({ success: false, error: 'Database insert failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, status: tx.status, transaction: tx, alert: alertResult });
  } catch (err: any) {
    console.error('AA Webhook Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
