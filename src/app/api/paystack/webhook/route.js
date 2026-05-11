import { headers } from "next/headers";
import { creditWallet } from "@/lib/wallet/creditWallet";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  const signature = headers().get("x-paystack-signature");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { user_id } = event.data.metadata;

    await creditWallet(
      user_id,
      event.data.amount / 100,
      event.data.reference,
      "paystack"
    );
  }

  return new Response("OK");
}