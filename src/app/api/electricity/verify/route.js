import axios from "axios";

export async function POST(req) {
  try {
    const { disco, meter_number, meter_type } = await req.json();

    const response = await axios.post(
      "https://www.cheapdatahub.ng/api/v1/resellers/electricity/verify/",
      {
        disco,
        meter_number,
        meter_type
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`
        }
      }
    );

    const data = response.data;

    return Response.json({
      success: true,
      customer: {
        name: data.name || "Verified Customer",
        address: data.address || "No address provided",
        tariff: data.tariff || meter_type.toUpperCase()
      }
    });

  } catch (err) {
    return Response.json({
      success: false,
      message: err.response?.data?.message || "Verification failed"
    });
  }
}