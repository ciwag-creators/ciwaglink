const BASE_URL =
  "https://api.monnify.com";


// =========================
// AUTH TOKEN
// =========================

export async function getMonnifyToken() {

  const res = await fetch(
    `${BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",

      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
          ).toString("base64"),
      },
    }
  );

  const data = await res.json();

  return data.responseBody.accessToken;
}


// =========================
// CREATE RESERVED ACCOUNT
// =========================

export async function createReservedAccount(user) {

  try {

    const token =
      await getMonnifyToken();

    const response = await fetch(
      `${BASE_URL}/api/v2/bank-transfer/reserved-accounts`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          accountReference:
            user.id,

          accountName:
            user.email,

          currencyCode:
            "NGN",

          contractCode:
            process.env.MONNIFY_CONTRACT_CODE,

          customerEmail:
            user.email,

          customerName:
            user.email,

          getAllAvailableBanks:
            true,
        }),
      }
    );

    return await response.json();

  } catch (err) {

    console.log(
      "MONNIFY ERROR:",
      err
    );

    return {
      requestSuccessful: false,
    };
  }
}