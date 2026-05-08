import { NextResponse } from "next/server";

import { supabase }
from "@/lib/supabaseClient";

import {
  buyAirtime
} from "@/lib/vtu/cheapdatahub";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      user_id,
      phone,
      network,
      amount
    } = body;

    // ======================
    // VALIDATION
    // ======================

    if (
      !user_id ||
      !phone ||
      !network ||
      !amount
    ) {

      return NextResponse.json({
        success: false,
        message: "Missing fields"
      });
    }

    // ======================
    // GET WALLET
    // ======================

    const { data: wallet, error: walletError } = await supabase
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
      Number(amount)
    ) {

      return NextResponse.json({
        success: false,
        message:
          "Insufficient balance"
      });
    }

    // ======================
    // NETWORK IDS
    // ======================

    const providerMap = {
      mtn: 1,
      airtel: 2,
      glo: 3,
      "9mobile": 4
    };

    const provider_id =
      providerMap[network];

    // ======================
    // PURCHASE
    // ======================

    const result =
      await buyAirtime({
        provider_id,
        phone_number: phone,
        amount
      });

    console.log(
      "AIRTIME RESPONSE:",
      result
    );

    const success =
      result.status === "true";

    if (!success) {

      return NextResponse.json({
        success: false,
        message:
          result.message ||
          "Airtime failed"
      });
    }

    // ======================
    // DEDUCT WALLET
    // ======================

    const newBalance =
      Number(wallet.balance) -
      Number(amount);

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
        type: "airtime",
        amount,
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
      "AIRTIME ERROR:",
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