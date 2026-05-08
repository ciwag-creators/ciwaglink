import axios from "axios";

export async function GET() {
  try {
    const res = await axios.get(
      "https://www.cheapdatahub.ng/api/v1/resellers/exam-pin/products/",
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`
        }
      }
    );

    const products = res.data.data || [];

    // 🔥 Add your profit here
    const formatted = products.map(p => {
      let price = p.price;

      let selling_price =
        price < 2000 ? price + 200 :
        price < 5000 ? price * 1.15 :
        price * 1.2;

      return {
        product_id: p.id,
        name: p.name,
        selling_price: Math.round(selling_price)
      };
    });

    return Response.json({
      success: true,
      products: formatted
    });

  } catch {
    return Response.json({
      success: false,
      products: []
    });
  }
}