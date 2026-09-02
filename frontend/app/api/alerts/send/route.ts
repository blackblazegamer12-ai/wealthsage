import { NextRequest, NextResponse } from "next/server";
import { formatAlertMessage } from "../../../../lib/alertService";

/**
 * Alert Send API Route — Client-Side Simulation
 * Formats and "sends" a WhatsApp/SMS alert (logged to server console).
 *
 * POST /api/alerts/send
 * Body: { merchant, amount, actor, childLabel?, phoneNumber? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      merchant = "Unknown",
      amount = 0,
      actor = "child",
      childLabel = "Child's Account",
      phoneNumber = "+91-XXXXXXXXXX",
    } = body;

    const message = formatAlertMessage({
      merchant,
      amount: Number(amount),
      actor,
      childLabel,
      phoneNumber,
    });

    // Server-side log (simulates Twilio dispatch)
    console.log("━━━ WEALTHSAGE ALERT API ━━━");
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      status: "sent",
      channel: "simulated_whatsapp_sms",
      message,
      recipient: phoneNumber,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid alert payload" },
      { status: 400 }
    );
  }
}
