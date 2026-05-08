import { supabase } from "@/lib/supabaseClient";

/**
 * 🔒 LOCK WALLET
 */
export async function lockWallet(user_id, amount, transaction_id) {
  try {
    amount = Number(amount);

    // ✅ Fetch wallet
    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !wallet) {
      return {
        success: false,
        message: "Wallet not found"
      };
    }

    const balance = Number(wallet.balance || 0);
    const locked = Number(wallet.locked_balance || 0);

    // ✅ Available balance
    const available = balance - locked;

    console.log("BALANCE:", balance);
    console.log("LOCKED:", locked);
    console.log("AVAILABLE:", available);
    console.log("AMOUNT:", amount);

    // ❌ Insufficient
    if (available < amount) {
      return {
        success: false,
        message: "Insufficient balance"
      };
    }

    // 🔒 Update locked balance
    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        locked_balance: locked + amount
      })
      .eq("user_id", user_id);

    if (updateError) {
      return {
        success: false,
        message: "Failed to lock wallet"
      };
    }

    // 📝 Save lock record
    await supabase.from("wallet_locks").insert({
      user_id,
      transaction_id,
      amount,
      status: "locked"
    });

    return {
      success: true
    };

  } catch (err) {
    console.error("LOCK ERROR:", err);

    return {
      success: false,
      message: "Wallet error"
    };
  }
}

/**
 * 🔓 RELEASE WALLET
 */
export async function releaseWallet(
  user_id,
  amount,
  transaction_id,
  success
) {
  try {
    amount = Number(amount);

    // ✅ Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!wallet) return;

    const balance = Number(wallet.balance || 0);
    const locked = Number(wallet.locked_balance || 0);

    // ✅ SUCCESS
    if (success) {
      await supabase
        .from("wallets")
        .update({
          balance: balance - amount,
          locked_balance: locked - amount
        })
        .eq("user_id", user_id);

    } else {
      // ❌ FAILED
      await supabase
        .from("wallets")
        .update({
          locked_balance: locked - amount
        })
        .eq("user_id", user_id);
    }

    // ✅ Update lock record
    await supabase
      .from("wallet_locks")
      .update({
        status: "released"
      })
      .eq("transaction_id", transaction_id);

  } catch (err) {
    console.error("RELEASE ERROR:", err);
  }
}