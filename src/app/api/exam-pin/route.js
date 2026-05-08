import axios from "axios";
import { lockWallet, releaseWallet } from "@/lib/vtu/wallet";

export async function POST(req) {
  try {
    const { user_id, product_id, quantity } = await req.json();

    const transaction_id = "EXAM_" + Date.now();

    // 🔥 Fetch product again for correct price
    const productRes = await axios.get(
      "https://www.cheapdatahub.ng/api/v1/resellers/exam-pin/products/",
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`
        }
      }
    );

    const product = productRes.data.data.find(p => p.id == product_id);

    const total = product.price * quantity;

    // 🔒 LOCK WALLET
    const lock = await lockWallet(user_id, total, transaction_id);

    if (!lock.success) {
      return Response.json({ success: false, message: lock.message });
    }

    // 🚀 BUY PIN
    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/exam-pin/purchase/",
      {
        product_id,
        quantity
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`
        }
      }
    );

    const success = response.data.status === "true";

    await releaseWallet(user_id, total, transaction_id, success);

    const pins = response.data.data?.delivery?.pins || [];

    return Response.json({
      success,
      message: response.data.message,
      pins,
      transaction_id
    });

  } catch (err) {
    return Response.json({
      success: false,
      message: "Exam purchase failed"
    });
  }
}