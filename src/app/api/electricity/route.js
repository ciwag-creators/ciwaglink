import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      user_id,
      disco,
      meter_number,
      meter_type,
      amount,
      phone,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !user_id ||
      !disco ||
      !meter_number ||
      !meter_type ||
      !amount ||
      !phone
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // =========================
    // GET WALLET
    // =========================

    const {
      data: wallet,
      error: walletError,
    } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    console.log("WALLET:", wallet);

    if (walletError || !wallet) {

      console.log(
        "WALLET ERROR:",
        walletError
      );

      return NextResponse.json({
        success: false,
        message: "Wallet not found",
      });
    }

    // =========================
    // CHECK BALANCE
    // =========================

    if (
      Number(wallet.balance) <
      Number(amount)
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Insufficient wallet balance",
      });
    }

    // =========================
    // CREATE TRANSACTION
    // =========================

    const {
      data: transaction,
    } = await supabase
      .from("electricity_transactions")
      .insert({
        user_id,

        disco,

        meter_number,

        meter_type,

        amount,

        status: "pending",
      })
      .select()
      .single();

    // =========================
    // CALL CHEAPDATAHUB
    // =========================

    const response = await fetch(
      "https://www.cheapdatahub.ng/api/v1/resellers/electricity/purchase/",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATAHUB_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          disco_id: disco,

          meter_number,

          amount,

          meter_type,

          phone,
        }),
      }
    );

    const result =
      await response.json();

    console.log(
      "ELECTRICITY RESPONSE:",
      result
    );

    // =========================
    // FAILED
    // =========================

    if (
      result.status !== "true"
    ) {

      await supabase
        .from(
          "electricity_transactions"
        )
        .update({
          status: "failed",
        })
        .eq(
          "id",
          transaction.id
        );

      return NextResponse.json({
        success: false,

        message:
          result.message ||
          "Electricity purchase failed",
      });
    }

    // =========================
    // DEDUCT WALLET
    // =========================

    const newBalance =
      Number(wallet.balance) -
      Number(amount);

    await supabase
      .from("wallets")
      .update({
        balance: newBalance,
      })
      .eq("user_id", user_id);

    // =========================
    // UPDATE TRANSACTION
    // =========================

    await supabase
      .from(
        "electricity_transactions"
      )
      .update({

        status: "success",

        token:
          result.data?.token || "",

        units:
          result.data?.units || "",

        reference:
          result.reference || "",

      })
      .eq(
        "id",
        transaction.id
      );

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return NextResponse.json({

      success: true,

      message:
        result.message ||
        "Electricity purchase successful",

      token:
        result.data?.token,

      units:
        result.data?.units,

      new_balance:
        newBalance,

    });

  } catch (err) {

    console.log(
      "ELECTRICITY ERROR:",
      err
    );

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}