import { supabase } from "@/lib/supabaseClient";
import { lockWallet, releaseWallet } from "@/lib/vtu/wallet";
import { processAirtime } from "@/lib/vtu/router";
import { v4 as uuidv4 } from "uuid";

export async function runAirtimePurchase({ user_id, phone, amount, provider_id, service_id }) {
  const transaction_id = uuidv4();

  try {
    // create transaction
    await supabase.from("transactions").insert({
      id: transaction_id,
      user_id,
      service: "airtime",
      amount,
      phone,
      status: "pending",
      reference: transaction_id
    });

    // lock wallet
    await lockWallet(user_id, amount, transaction_id);

    // processing
    await supabase.from("transactions")
      .update({ status: "processing" })
      .eq("id", transaction_id);

    // call provider
    const result = await processAirtime({
      phone,
      amount,
      provider_id,
      service_id
    });

    // success
    await supabase.from("transactions")
      .update({
        status: "success",
        provider: result.provider,
        response_payload: result.response
      })
      .eq("id", transaction_id);

    await releaseWallet(user_id, amount, transaction_id, true);

    return { success: true, transaction_id };

  } catch (error) {

    await supabase.from("transactions")
      .update({
        status: "failed",
        response_payload: { error: error.message }
      })
      .eq("id", transaction_id);

    await releaseWallet(user_id, amount, transaction_id, false);

    return { success: false, message: error.message };
  }
}