import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { lockWallet, releaseWallet } from "./wallet";

export async function buyData({
  user_id,
  phone,
  plan_id,
}) {
  try {

    // =========================
    // GET PLAN
    // =========================

    const { data: plan, error } = await supabase
      .from("data_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (error || !plan) {
      return {
        success: false,
        message: "Plan not found",
      };
    }

    console.log("PLAN:", plan);

    const amount = Number(plan.selling_price);

    const transaction_id =
      "DATA_" + Date.now();

    // =========================
    // LOCK WALLET
    // =========================

    const lock = await lockWallet(
      user_id,
      amount,
      transaction_id
    );

    if (!lock.success) {
      return lock;
    }

    // =========================
    // BUY DATA
    // =========================

    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/data/purchase/",
      {
        bundle_id: Number(plan.api_plan_id),
        phone_number: phone,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATAHUB_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "DATA API RESPONSE:",
      response.data
    );

    // =========================
    // SUCCESS CHECK
    // =========================

    const success =
      response.data.status === "true";

    // =========================
    // RELEASE WALLET
    // =========================

    await releaseWallet(
      user_id,
      amount,
      transaction_id,
      success
    );

    // =========================
    // RESPONSE
    // =========================

    return {
      success,
      message:
        response.data.message ||
        "Data purchase completed",
      reference:
        response.data.reference ||
        null,
      transaction_id,
    };

  } catch (err) {

    console.log(
      "DATA PURCHASE ERROR:",
      err.response?.data || err.message
    );

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Data purchase failed",
    };
  }
}