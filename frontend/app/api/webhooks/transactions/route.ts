import { NextRequest, NextResponse } from "next/server";
import { evaluateTransaction, categorizeTransaction } from "../../../../lib/ruleEngine";

/**
 * Webhook Listener for Account Aggregator (Setu/Finvu) Payloads
 * Accepts standard AA-formatted JSON and runs it through the Guardian Shield rule engine.
 *
 * POST /api/webhooks/transactions
 * Body: { transactionId, merchant, amount, category, actor, timestamp }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      transactionId,
      merchant = "Unknown",
      amount = 0,
      category,
      actor = "parent",
      timestamp,
    } = body;

    // Auto-categorize if category not provided
    const resolvedCategory = category || categorizeTransaction(merchant);

    // Run through the Guardian Shield rule engine
    const alert = evaluateTransaction({
      id: transactionId,
      merchant,
      amount: Number(amount),
      category: resolvedCategory,
      actor: actor as "parent" | "child",
      timestamp,
    });

    return NextResponse.json({
      status: "processed",
      transactionId: transactionId || crypto.randomUUID(),
      merchant,
      amount,
      category: resolvedCategory,
      actor,
      alert: {
        level: alert.alertLevel,
        shouldFlag: alert.shouldFlag,
        reason: alert.reason,
        emoji: alert.emoji,
      },
      timestamp: timestamp || new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid payload format" },
      { status: 400 }
    );
  }
}
