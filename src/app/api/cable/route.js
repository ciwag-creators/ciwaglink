import axios from "axios";
import { lockWallet, releaseWallet } from "@/lib/vtu/wallet";

export async function POST(req) {
  try {
    const { user_id, provider, card_number, plan_id } = await req.json();

    const transaction_id = "CABLE_" + Date.now();

    // 🔒 Lock wallet
    await lockWallet(user_id, 1000, transaction_id); // Replace with real price

    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/cable/purchase/",
      {
        service_id: provider,
        smartcard_number: card_number,
        plan_id
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`
        }
      }
    );

    const success = response.data.status === "true";

    await releaseWallet(user_id, 1000, transaction_id, success);

    return Response.json({
      success,
      message: response.data.message
    });

  } catch (err) {
    return Response.json({
      success: false,
      message: "Cable purchase failed"
    });
  }
}