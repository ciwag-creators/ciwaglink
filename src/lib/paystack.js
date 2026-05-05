export async function initPaystackPayment(email, amount, reference) {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/success`
    })
  });

  return res.json();
}