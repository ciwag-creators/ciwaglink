import axios from "axios";

const api = axios.create({
  baseURL:
    "https://www.cheapdatahub.ng/api/v1/resellers",

  headers: {
    Authorization:
      `Bearer ${process.env.CHEAPDATAHUB_API_KEY}`,

    "Content-Type":
      "application/json"
  }
});

/**
 * AIRTIME
 */
export async function buyAirtime({
  provider_id,
  phone_number,
  amount
}) {

  const res = await api.post(
    "/airtime/purchase/",
    {
      provider_id,
      phone_number,
      amount
    }
  );

  return res.data;
}

/**
 * DATA
 */
export async function buyData({
  bundle_id,
  phone_number
}) {

  const res = await api.post(
    "/data/purchase/",
    {
      bundle_id,
      phone_number
    }
  );

  return res.data;
}

/**
 * WALLET BALANCE
 */
export async function getWalletBalance() {

  const res = await api.get(
    "/wallet/balance/"
  );

  return res.data;
}