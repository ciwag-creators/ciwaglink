import { supabase } from "@/lib/supabaseClient";
import { lockWallet, releaseWallet } from "./wallet";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function runDataPurchase(payload) {
  const transaction_id = uuidv4();

  try {
    await supabase.from("transactions").insert({
      id: transaction_id,
      user_id: payload.user_id,
      service: "data",
      amount: payload.amount,
      phone: payload.phone,
      status: "pending"
    });

    await lockWallet(payload.user_id, payload.amount, transaction_id);

    // 🔥 CALL CHEAPDATAHUB
    const res = await axios.post(
      `${process.env.CHEAPDATAHUB_BASE_URL}/data/purchase/`,
      {
        bundle_id: payload.bundle_id,
        phone_number: payload.phone
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATAHUB_KEY}`
        }
      }
    );

    await supabase.from("transactions")
      .update({
        status: "success",
        response_payload: res.data
      })
      .eq("id", transaction_id);

    await releaseWallet(payload.user_id, payload.amount, transaction_id, true);

    return { success: true };

  } catch (err) {

    await releaseWallet(payload.user_id, payload.amount, transaction_id, false);

    return { success: false, message: err.message };
  }
}