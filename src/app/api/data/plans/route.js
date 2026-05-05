import { supabase } from "@/lib/supabaseClient";
import { calculateSellingPrice } from "@/lib/vtu/pricing";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const network = searchParams.get("network");

    console.log("API NETWORK:", network);

    const { data, error } = await supabase
      .from("data_plans")
      .select("*")
      .eq("network", network);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return Response.json({
        success: false,
        plans: []
      });
    }

    console.log("RAW DATA:", data);

    const plans = (data || []).map(plan => ({
      ...plan,
      selling_price: calculateSellingPrice(plan.provider_price)
    }));

    console.log("FINAL PLANS:", plans);

    return Response.json({
      success: true,
      plans: plans || []
    });

  } catch (err) {
    console.log("API ERROR:", err);
    return Response.json({
      success: false,
      plans: []
    });
  }
}