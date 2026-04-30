import { runDataPurchase } from "@/lib/vtu/dataEngine";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await runDataPurchase(body);

    return Response.json(result);

  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}