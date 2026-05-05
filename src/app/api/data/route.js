import { buyData } from "@/lib/vtu/dataEngine";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await buyData(body);

    return Response.json(result);

  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}