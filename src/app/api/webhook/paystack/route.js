import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const body = await req.json();

  const event = body.event;
  const data = body.data;

  if (event === "charge.success") {
    const reference = data.reference;

    // update transaction
    const { data: tx } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("reference", reference)
      .single();

    if (!tx) return Response.json({ ok: true });

    // credit wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", tx.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({
          balance: wallet.balance + tx.amount
        })
        .eq("user_id", tx.user_id);
    }

    // mark success
    await supabase
      .from("wallet_transactions")
      .update({ status: "success" })
      .eq("reference", reference);
  }

  return Response.json({ ok: true });
}