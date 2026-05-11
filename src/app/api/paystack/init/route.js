import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, amount, user_id } = await req.json();

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
        metadata: { user_id },
        callback_url: "http://localhost:3000/wallet/success",
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}