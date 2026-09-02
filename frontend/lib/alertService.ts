/**
 * WealthSage Alert Service — Client-Side Simulation
 * Formats WhatsApp/SMS alerts and logs to console.
 * Triggers high-visibility toast notifications in lieu of real Twilio API calls.
 */

export interface AlertPayload {
  merchant: string;
  amount: number;
  actor: string;
  childLabel?: string;
  phoneNumber?: string;
}

export function formatAlertMessage(payload: AlertPayload): string {
  const childName = payload.childLabel || "Child's Account";
  return `🚨 WealthSage Alert: A ₹${payload.amount.toLocaleString('en-IN')} purchase was just attempted on ${payload.merchant} by ${childName}. Reply BLOCK to stop.`;
}

export function sendSimulatedAlert(payload: AlertPayload): {
  success: boolean;
  message: string;
  timestamp: string;
  toastTitle: string;
  toastDescription: string;
} {
  const message = formatAlertMessage(payload);
  const timestamp = new Date().toISOString();

  // Console log for debugging/demo
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📲 WEALTHSAGE GUARDIAN ALERT (SIMULATED)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Channel: WhatsApp / SMS`);
  console.log(`To: ${payload.phoneNumber || '+91-XXXXXXXXXX'}`);
  console.log(`Message: ${message}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return {
    success: true,
    message,
    timestamp,
    toastTitle: '🚨 Guardian Alert Sent',
    toastDescription: `₹${payload.amount.toLocaleString('en-IN')} ${payload.merchant} flagged — alert dispatched to parent.`,
  };
}
