import { creditWallet } from "@/lib/wallet/creditWallet";

export async function POST(req) {
  const body = await req.json();

  if (body.eventType === "SUCCESSFUL_TRANSACTION") {
    const user_id = body.eventData.paymentReference;
    const amount = body.eventData.amountPaid;

    await creditWallet(
      user_id,
      amount,
      body.eventData.transactionReference,
      "monnify"
    );
  }

  return Response.json({ success: true });
}