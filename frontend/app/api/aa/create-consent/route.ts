import { NextResponse } from 'next/server';

const SETU_CLIENT_ID = process.env.SETU_CLIENT_ID;
const SETU_CLIENT_SECRET = process.env.SETU_CLIENT_SECRET;
// Setu sandbox base url
const SETU_API_URL = 'https://fiu-sandbox.setu.co/v2';

export async function POST(req: Request) {
  try {
    if (!SETU_CLIENT_ID || !SETU_CLIENT_SECRET) {
      // Fallback to local mock for demo degradation
      return NextResponse.json({
        success: true,
        url: '/dashboard/aa-callback?success=true&id=mock-consent-id-1234',
        mock: true
      });
    }

    // Call Setu AA Consent Creation API
    // We mock the exact payload format based on Setu AA Docs
    const response = await fetch(`${SETU_API_URL}/consents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': SETU_CLIENT_ID,
        'x-client-secret': SETU_CLIENT_SECRET,
      },
      body: JSON.stringify({
        Detail: {
          consentStart: new Date().toISOString(),
          consentExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          Customer: { id: "9999999999@onemoney" },
          FIDataRange: {
            from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString()
          },
          ConsentMode: "STORE",
          ConsentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
          FetchType: "PERIODIC",
          Frequency: { unit: "HOUR", value: 24 },
          DataFilter: [
            { type: "TRANSACTIONAMOUNT", operator: ">=", value: "0" }
          ],
          DataLife: { unit: "MONTH", value: 6 },
          DataConsumer: { type: "FIU", id: SETU_CLIENT_ID },
          Purpose: {
            code: "101",
            refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
            text: "Wealth Management",
            Category: { type: "string" }
          },
          fiTypes: ["DEPOSIT"]
        },
        context: [
          { key: "accounttype", value: "SAVINGS" }
        ],
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/aa-callback`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create consent on Setu');
    }

    return NextResponse.json({
      success: true,
      url: data.url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/aa-callback?success=true&id=${data.id}`
    });

  } catch (error: any) {
    console.error('Setu AA Create Consent Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
