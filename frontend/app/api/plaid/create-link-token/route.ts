import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

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

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user_id,
      },
      client_name: 'WealthSage',
      products: [Products.Transactions],
      country_codes: ['US'] as CountryCode[],
      language: 'en',
    });

    return NextResponse.json(createTokenResponse.data);
  } catch (error: any) {
    console.error('Error creating link token:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.error_message || 'Failed to create link token' },
      { status: 500 }
    );
  }
}
