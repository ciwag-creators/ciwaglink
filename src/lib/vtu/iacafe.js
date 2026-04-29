import axios from "axios";

const BASE_URL = "https://iacafe.com.ng/devapi/v1";

export async function iCafeAirtime(payload) {
  const res = await axios.post(
    `${BASE_URL}/airtime`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.IACAFE_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
}