import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phoneNumber, message, alertLevel } = await req.json();

    if (process.env.ENABLE_REAL_SMS === 'true') {
      // Simulate calling an external API like Twilio/Msg91
      console.log(`[REAL SMS DISPATCH] To: ${phoneNumber} | Level: ${alertLevel} | Msg: ${message}`);
      // await fetch('https://api.twilio.com/...', ...)
      return NextResponse.json({ success: true, simulated: false, status: 'delivered' });
    } else {
      console.log(`[MOCK SMS DISPATCH] To: ${phoneNumber} | Level: ${alertLevel} | Msg: ${message}`);
      return NextResponse.json({ success: true, simulated: true, status: 'delivered' });
    }
  } catch (err) {
    console.error('Alert Dispatch Error:', err);
    return NextResponse.json({ success: false, error: 'Dispatch Failed' }, { status: 500 });
  }
}
