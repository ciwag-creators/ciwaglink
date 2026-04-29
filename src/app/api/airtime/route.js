import { runAirtimePurchase } from "@/lib/vtu/engine";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await runAirtimePurchase({
      user_id: body.user_id,
      phone: body.phone,
      amount: body.amount,
      provider_id: body.provider_id,
      service_id: body.service_id
    });

    return Response.json(result);

  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}