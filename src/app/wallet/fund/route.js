import { initPaystackPayment } from "@/lib/paystack";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const { user_id, email, amount } = await req.json();

  const reference = `WALLET_${uuidv4()}`;

  // store pending transaction
  await supabase.from("wallet_transactions").insert({
    user_id,
    amount,
    type: "credit",
    status: "pending",
    reference,
    provider: "paystack"
  });

  const paystack = await initPaystackPayment(email, amount, reference);

  return Response.json(paystack);
}