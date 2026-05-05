import { supabase } from "@/lib/supabaseClient";

/**
 * LOCK WALLET
 */
export async function lockWallet(user_id, amount, transaction_id) {
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  await supabase.from("wallets").update({
    balance: wallet.balance - amount,
    locked_balance: wallet.locked_balance + amount
  }).eq("user_id", user_id);

  await supabase.from("wallet_locks").insert({
    user_id,
    amount,
    transaction_id,
    status: "locked"
  });
}


/**
 * RELEASE WALLET
 */
export async function releaseWallet(user_id, amount, transaction_id, success) {
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (!wallet) return;

  if (!success) {
    // refund
    await supabase.from("wallets").update({
      balance: wallet.balance + amount,
      locked_balance: wallet.locked_balance - amount
    }).eq("user_id", user_id);
  } else {
    // finalize deduction
    await supabase.from("wallets").update({
      locked_balance: wallet.locked_balance - amount
    }).eq("user_id", user_id);
  }

  await supabase.from("wallet_locks")
    .update({ status: "released" })
    .eq("transaction_id", transaction_id);
}