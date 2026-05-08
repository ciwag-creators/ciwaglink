export async function POST(req) {
  try {
    const { provider, card_number } = await req.json();

    // 🔥 Replace with real provider when available
    return Response.json({
      success: true,
      customer: {
        name: "Cable Customer"
      }
    });

  } catch {
    return Response.json({
      success: false,
      message: "Verification failed"
    });
  }
}