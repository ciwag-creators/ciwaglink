import axios from "axios";

const BASE_URL = "https://www.cheapdatahub.ng/api/v1/resellers";

export async function cheapAirtime(payload) {
  const res = await axios.post(
    `${BASE_URL}/airtime/purchase/`,
    {
      provider_id: payload.provider_id,
      phone_number: payload.phone,
      amount: payload.amount
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHEAPDATAHUB_KEY}`
      }
    }
  );

  return res.data;
}