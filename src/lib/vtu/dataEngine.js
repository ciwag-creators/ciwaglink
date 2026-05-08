import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import {
  lockWallet,
  releaseWallet
} from "./wallet";

export async function buyData({
  user_id,
  phone,
  plan_id,
  network
}) {
  try {

    // =========================
    // FETCH PLAN
    // =========================

    const { data: plan, error } = await supabase
      .from("data_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (error || !plan) {
      return {
        success: false,
        message: "Invalid plan selected"
      };
    }

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
    // CHEAPDATAHUB PAYLOAD
    // =========================

    const payload = {
      bundle_id: String(plan.api_plan_id),
      phone_number: phone
    };

    console.log("========== DATA PURCHASE ==========");
    console.log("PLAN:", plan.name);
    console.log("PLAN ID:", plan.api_plan_id);
    console.log("PHONE:", phone);
    console.log("PAYLOAD:", payload);

    // =========================
    // REQUEST
    // =========================

    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/data/purchase/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATAHUB_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // =========================
    // RAW RESPONSE
    // =========================

    console.log(
      "CHEAPDATA RAW RESPONSE:"
    );

    console.log(
      JSON.stringify(response.data, null, 2)
    );

    // =========================
    // SUCCESS DETECTION
    // =========================

    const raw = response.data;

    const success =
      raw.status === true ||
      raw.status === "true" ||
      raw.success === true ||
      raw.success === "true" ||
      raw.Status === "successful" ||
      raw.code === "success";

    console.log("SUCCESS:", success);

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
    // SAVE TRANSACTION
    // =========================

    await supabase
      .from("transactions")
      .insert({
        user_id,
        type: "data",
        network,
        phone,
        amount,
        status: success
          ? "successful"
          : "failed",
        reference:
          raw.reference ||
          transaction_id,
        provider_response: raw
      });

    // =========================
    // FAILED
    // =========================

    if (!success) {

      return {
        success: false,
        message:
          raw.message ||
          raw.api_response ||
          "Data purchase failed",
        provider_response: raw
      };
    }

    // =========================
    // SUCCESS
    // =========================

    return {
      success: true,
      message:
        raw.message ||
        "Data purchase successful",
      provider_response: raw
    };

  } catch (err) {

    console.log("========== DATA ERROR ==========");

    console.log(
      err.response?.data ||
      err.message
    );

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Data purchase failed",
      error:
        err.response?.data ||
        err.message
    };
  }
}