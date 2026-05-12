import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      user_id,
      exam_type,
      product_id,
      quantity,
      amount,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !user_id ||
      !exam_type ||
      !product_id ||
      !quantity ||
      !amount
    ) {

      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // =========================
    // VALID QUANTITY
    // =========================

    if (
      ![1, 2, 5].includes(
        Number(quantity)
      )
    ) {

      return NextResponse.json({
        success: false,
        message:
          "Quantity must be 1, 2 or 5",
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
      .from(
        "exam_pin_transactions"
      )
      .insert({

        user_id,

        exam_type,

        quantity,

        amount,

        status: "pending",

      })
      .select()
      .single();

    // =========================
    // CALL CHEAPDATAHUB
    // =========================

    const response = await fetch(
      "https://www.cheapdatahub.ng/api/v1/resellers/exam-pin/purchase/",
      {
        method: "POST",

        headers: {

          Authorization:
            `Bearer ${process.env.CHEAPDATAHUB_API_KEY}`,

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          product_id,

          quantity,

        }),
      }
    );

    const result =
      await response.json();

    console.log(
      "EXAM PIN RESPONSE:",
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
          "exam_pin_transactions"
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
          "Exam pin purchase failed",

      });
    }

    // =========================
    // EXTRACT PINS
    // =========================

    const pins =
      result.data?.delivery?.pins || [];

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
        "exam_pin_transactions"
      )
      .update({

        status: "success",

        pin:
          JSON.stringify(pins),

        reference:
          result.reference || "",

      })
      .eq(
        "id",
        transaction.id
      );

    // =========================
    // SUCCESS
    // =========================

    return NextResponse.json({

      success: true,

      message:
        result.message ||
        "Exam pin purchase successful",

      pins,

      quantity:
        result.data?.delivery
          ?.quantity,

      exam_name:
        result.data?.delivery
          ?.exam_name,

      new_balance:
        newBalance,

    });

  } catch (err) {

    console.log(
      "EXAM PIN ERROR:",
      err
    );

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}