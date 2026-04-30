import { supabase } from "@/lib/supabaseClient";
import { calculateSellingPrice } from "@/lib/vtu/pricing";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let network = searchParams.get("network");

    if (network) {
      network = network.toLowerCase().trim();
    }

    let query = supabase.from("data_plans").select("*");

    if (network) {
      query = query.eq("network", network);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ success: false, plans: [] });
    }

    const plans = (data || []).map((plan) => ({
      id: plan.id,
      name: plan.name, // ✅ MUST MATCH FRONTEND
      network: plan.network,
      plan_id: plan.plan_id,
      provider_price: plan.provider_price,

      // 🔥 frontend expects this
      selling_price: calculateSellingPrice(plan.provider_price),
    }));
    
console.log("PLANS FROM API:", data.plans);

    return Response.json({
      success: true,
      plans,
    });

  } catch (err) {
    return Response.json({
      success: false,
      plans: [],
    });
  }
}