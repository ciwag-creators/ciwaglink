import axios from "axios";
import { lockWallet, releaseWallet } from "@/lib/vtu/wallet";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      user_id,
      disco,
      meter_number,
      meter_type,
      amount
    } = body;

    // ✅ Validate input
    if (!user_id || !meter_number || !amount) {
      return Response.json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 🔐 Generate transaction ID
    const transaction_id = "ELEC_" + Date.now();

    // 🔒 LOCK WALLET
    const lock = await lockWallet(user_id, Number(amount), transaction_id);

    if (!lock.success) {
      return Response.json({
        success: false,
        message: lock.message || "Insufficient balance"
      });
    }

    // 🚀 CALL CHEAPDATAHUB
    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/electricity/purchase/",
      {
        disco,
        meter_number,
        meter_type,
        amount,
        phone_number: "08000000000" // required fallback field
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const resData = response.data;

    const success = resData.status === "true";

    // 🎯 EXTRACT TOKEN SAFELY
    const tokenData = resData.data || {};

    const token =
      tokenData.token ||
      tokenData.pin ||
      tokenData.units_token ||
      null;

    const units =
      tokenData.units ||
      tokenData.unit ||
      null;

    // 🔓 RELEASE WALLET
    await releaseWallet(user_id, Number(amount), transaction_id, success);

   return Response.json({
  success,
  message: resData.message,

  token,
  units,
  disco,

  transaction_id,

  meter_number,
  amount,

  customer: {
    name: "Verified Customer"
  }
});

  } catch (err) {
    console.error("ELECTRICITY ERROR:", err?.response?.data || err.message);

    return Response.json({
      success: false,
      message:
        err?.response?.data?.message ||
        "Electricity purchase failed"
    });
  }
}