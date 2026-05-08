import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const network = searchParams.get("network");

    // VALIDATE
    if (!network) {
      return NextResponse.json({
        success: false,
        message: "Network is required",
      });
    }

    // FETCH PLANS
    const { data, error } = await supabase
      .from("data_plans")
      .select(`
        id,
        network,
        name,
        provider_price,
        selling_price,
        api_plan_id
      `)
      .eq("network", network.toLowerCase())
      .order("provider_price", { ascending: true });

    if (error) {
      console.log("SUPABASE ERROR:", error);

      return NextResponse.json({
        success: false,
        message: error.message,
      });
    }

    console.log("DATABASE PLANS:", data);

    return NextResponse.json({
      success: true,
      plans: data || [],
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}