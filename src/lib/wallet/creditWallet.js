import { supabase } from "@/lib/supabaseClient";

export async function creditWallet(user_id, amount, reference, source = "paystack") {
  try {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!wallet) {
      return { success: false, message: "Wallet not found" };
    }

    const newBalance = Number(wallet.balance) + Number(amount);

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user_id);

    await supabase.from("transactions").insert({
      user_id,
      type: "wallet_funding",
      amount,
      status: "success",
      reference,
      channel: source,
    });

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}