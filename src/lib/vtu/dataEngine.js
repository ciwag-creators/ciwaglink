import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { lockWallet, releaseWallet } from "./wallet";
import { calculateSellingPrice } from "./pricing";
import { v4 as uuidv4 } from "uuid";

export async function buyData({ user_id, phone, plan }) {
  const transaction_id = uuidv4();

  const sellingPrice = calculateSellingPrice(plan.provider_price);

  try {
    // create transaction
    await supabase.from("transactions").insert({
      id: transaction_id,
      user_id,
      service: "data",
      amount: sellingPrice,
      phone,
      status: "pending",
      reference: transaction_id
    });

    // lock wallet
    await lockWallet(user_id, sellingPrice);

    // call CheapDataHub
    const res = await axios.post(
      `${process.env.CHEAPDATAHUB_BASE_URL}/data/purchase/`,
      {
        bundle_id: plan.bundle_id,
        phone_number: phone
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATAHUB_KEY}`
        }
      }
    );

    // success
    await supabase
      .from("transactions")
      .update({
        status: "success",
        response_payload: res.data
      })
      .eq("id", transaction_id);

    await releaseWallet(user_id, sellingPrice, true);

    return { success: true };

  } catch (err) {
    await releaseWallet(user_id, sellingPrice, false);

    return { success: false, message: err.message };
  }
}