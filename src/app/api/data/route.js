import { NextResponse } from "next/server";

import { supabase }
from "@/lib/supabaseClient";

import {
  buyData
} from "@/lib/vtu/cheapdatahub";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      user_id,
      phone,
      network,
      plan_id
    } = body;

    // ======================
    // VALIDATION
    // ======================

    if (
      !user_id ||
      !phone ||
      !network ||
      !plan_id
    ) {

      return NextResponse.json({
        success: false,
        message: "Missing fields"
      });
    }

    // ======================
    // GET PLAN
    // ======================

    const {
      data: plan
    } = await supabase
      .from("data_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (!plan) {

      return NextResponse.json({
        success: false,
        message: "Invalid plan"
      });
    }

    // ======================
    // GET WALLET
    // ======================

    const {
      data: wallet
    } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!wallet) {

      return NextResponse.json({
        success: false,
        message: "Wallet not found"
      });
    }

    if (
      Number(wallet.balance) <
      Number(plan.selling_price)
    ) {

      return NextResponse.json({
        success: false,
        message:
          "Insufficient balance"
      });
    }

    // ======================
    // PURCHASE
    // ======================

    const result =
      await buyData({
        bundle_id:
          Number(plan.api_plan_id),

        phone_number: phone
      });

    console.log(
      "DATA RESPONSE:",
      result
    );

    const success =
      result.status === "true";

    if (!success) {

      return NextResponse.json({
        success: false,
        message:
          result.message ||
          "Data purchase failed"
      });
    }

    // ======================
    // DEDUCT WALLET
    // ======================

    const newBalance =
      Number(wallet.balance) -
      Number(plan.selling_price);

    await supabase
      .from("wallets")
      .update({
        balance: newBalance
      })
      .eq("user_id", user_id);

    // ======================
    // SAVE TRANSACTION
    // ======================

    await supabase
      .from("transactions")
      .insert({
        user_id,
        type: "data",
        amount:
          plan.selling_price,
        network,
        phone,
        status: "successful",
        reference:
          result.reference
      });

    return NextResponse.json({
      success: true,
      message:
        result.message,
      balance: newBalance
    });

  } catch (err) {

    console.log(
      "DATA ERROR:",
      err.response?.data ||
      err.message
    );

    return NextResponse.json({
      success: false,
      message:
        err.response?.data?.message ||
        "Server error"
    });
  }
}