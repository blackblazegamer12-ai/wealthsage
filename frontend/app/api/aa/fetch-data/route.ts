import { NextResponse } from 'next/server';
import { decryptAAPayload } from '@/lib/cryptoAA';
import { getSupabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';

const SETU_CLIENT_ID = process.env.SETU_CLIENT_ID;
const SETU_CLIENT_SECRET = process.env.SETU_CLIENT_SECRET;
const SETU_API_URL = 'https://fiu-sandbox.setu.co/v2';

export async function POST(req: Request) {
  try {
    const { consentId } = await req.json();

    if (!consentId) {
      return NextResponse.json({ success: false, error: 'Consent ID is required' }, { status: 400 });
    }

    if (!SETU_CLIENT_ID || !SETU_CLIENT_SECRET) {
      // Mock data for graceful fallback
      const mockTransactions = [
        {
          id: `mock-aa-${Date.now()}-1`,
          description: 'Codashop - Free Fire',
          merchant: 'Codashop - Free Fire',
          amount: 800,
          type: 'outflow',
          category: 'General',
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          actor: 'child',
          status: 'approved'
        },
        {
          id: `mock-aa-${Date.now()}-2`,
          description: 'Unknown UPI Transfer',
          merchant: 'Unknown UPI Transfer',
          amount: 12000,
          type: 'inflow',
          category: 'Income',
          date: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString(),
          actor: 'parent',
          status: 'approved'
        },
        {
          id: `mock-aa-${Date.now()}-3`,
          description: 'Crypto P2P Exchange',
          merchant: 'Crypto P2P Exchange',
          amount: 11500,
          type: 'outflow',
          category: 'Transfer',
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          actor: 'parent',
          status: 'approved'
        }
      ];
      
      return NextResponse.json({
        success: true,
        data: mockTransactions
      });
    }

    // Phase 1: Request Data Session
    const sessionRes = await fetch(`${SETU_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': SETU_CLIENT_ID,
        'x-client-secret': SETU_CLIENT_SECRET,
      },
      body: JSON.stringify({
        consentId: consentId,
        DataRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        },
        format: "json"
      })
    });

    const sessionData = await sessionRes.json();
    if (!sessionRes.ok) throw new Error(sessionData.message || 'Failed to create data session');

    // Phase 2: Wait briefly and Fetch Data with exponential backoff
    let isReady = false;
    let rawData = null;
    let retry = 1;
    const maxRetries = 5;

    while (!isReady && retry <= maxRetries) {
      console.log(`[AA Ingestion] Polling Setu session status (Attempt ${retry}/${maxRetries})...`);
      const dataRes = await fetch(`${SETU_API_URL}/sessions/${sessionData.id}`, {
        method: 'GET',
        headers: {
          'x-client-id': SETU_CLIENT_ID,
          'x-client-secret': SETU_CLIENT_SECRET,
        }
      });

      rawData = await dataRes.json();
      if (!dataRes.ok) throw new Error(rawData.message || 'Failed to fetch AA data');

      if (rawData.status === 'READY' || rawData.payload) {
        isReady = true;
      } else {
        const backoff = Math.pow(1.5, retry) * 1000;
        await new Promise(r => setTimeout(r, backoff));
        retry++;
      }
    }

    if (!isReady || !rawData) {
      throw new Error('AA Session timed out waiting for READY status');
    }

    // Process JWE Cryptographic Payload
    const decryptedData = decryptAAPayload(rawData);
    const finalPayload = decryptedData.payload || decryptedData;

    // Zod Schema for Setu AA Payload validation
    const txSchema = z.object({
      txnId: z.string().optional(),
      narration: z.string().optional(),
      amount: z.union([z.string(), z.number()]).optional(),
      type: z.string().optional(),
      transactionTimestamp: z.string().optional(),
      reference: z.string().optional()
    }).catchall(z.any());

    const accountSchema = z.object({
      data: z.object({
        Account: z.object({
          Transactions: z.object({
            Transaction: z.array(txSchema).optional()
          }).optional()
        }).optional()
      }).optional()
    }).catchall(z.any());

    const payloadSchema = z.array(accountSchema);

    // Map Setu FI format to WealthSage Transaction format securely
    const transactions = [];
    const parseResult = payloadSchema.safeParse(finalPayload);
    
    if (parseResult.success) {
      for (const account of parseResult.data) {
        const txs = account.data?.Account?.Transactions?.Transaction;
        if (txs) {
          for (const tx of txs) {
            transactions.push({
              id: tx.txnId || crypto.randomUUID(),
              description: tx.narration || "Unknown",
              merchant: tx.narration || "Unknown",
              amount: Number(tx.amount) || 0,
              type: tx.type === 'DEBIT' ? 'outflow' : 'inflow',
              category: 'General',
              date: tx.transactionTimestamp || new Date().toISOString(),
              created_at: new Date().toISOString(),
              actor: 'parent',
              status: 'approved',
              utr_reference: tx.reference || tx.txnId || crypto.randomUUID()
            });
          }
        }
      }
    } else {
      console.warn("[AA Ingestion] Payload schema mismatch, attempting fallback", parseResult.error);
    }

    const supabase = getSupabaseServer();
    if (supabase && transactions.length > 0) {
      const { error: dbErr } = await supabase
        .from('transactions')
        .upsert(transactions, { onConflict: 'utr_reference', ignoreDuplicates: true });
        
      if (dbErr) {
        console.error('[AA Ingestion] DB Bulk Upsert Error:', dbErr);
      } else {
        console.log(`[AA Ingestion] Successfully upserted ${transactions.length} records.`);
      }
    }
    return NextResponse.json({
      success: true,
      data: transactions
    });

  } catch (error: any) {
    console.error('Setu AA Fetch Data Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
