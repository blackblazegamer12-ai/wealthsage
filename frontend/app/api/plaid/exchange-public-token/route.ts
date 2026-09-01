import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const exchangePayloadSchema = z.object({
  public_token: z.string().min(1),
  user_id: z.string().min(1)
});

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = exchangePayloadSchema.parse(body);
    const { public_token, user_id } = validatedData;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const exchangeResponse = await plaidClient.itemPublicTokenExchange(
      { public_token },
      { signal: controller.signal as any }
    );
    clearTimeout(timeout);

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Save to Supabase
    if (supabaseUrl && supabaseKey) {
      const { error } = await supabase
        .from('bank_connections')
        .insert([
          {
            user_id,
            access_token: accessToken,
            item_id: itemId,
            status: 'active',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error saving bank connection to Supabase:', error);
        // We still return success for the exchange, but warn about DB insertion failure
      }
    } else {
       console.warn('Supabase credentials not fully configured, skipping bank_connections insert.');
    }

    return NextResponse.json({ success: true, item_id: itemId });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload format", details: error.issues }, { status: 400 });
    }
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Plaid API timeout" }, { status: 504 });
    }
    console.error('Error exchanging public token:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.error_message || 'Failed to exchange public token' },
      { status: 500 }
    );
  }
}
