"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function CablePage() {
  const [provider, setProvider] = useState("dstv");
  const [cardNumber, setCardNumber] = useState("");
  const [plan, setPlan] = useState("");
  const [customer, setCustomer] = useState(null);

  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const providers = [
    { id: "dstv", name: "DSTV", logo: "/cable/dstv.png" },
    { id: "gotv", name: "GOTV", logo: "/cable/gotv.png" },
    { id: "startimes", name: "Startimes", logo: "/cable/startimes.png" }
  ];

  // ⚡ Sample plans (later we can fetch from API)
  const plans = {
    dstv: [
      { id: "dstv-padi", name: "DStv Padi", price: 2950 },
      { id: "dstv-yanga", name: "DStv Yanga", price: 4200 }
    ],
    gotv: [
      { id: "gotv-smallie", name: "GOtv Smallie", price: 1300 },
      { id: "gotv-jolli", name: "GOtv Jolli", price: 3950 }
    ],
    startimes: [
      { id: "startimes-basic", name: "Basic", price: 2500 }
    ]
  };

  // 🔍 VERIFY SMARTCARD
  const verifyCard = async () => {
    if (!cardNumber) {
      setError("Enter smartcard number");
      return;
    }

    setVerifying(true);
    setError("");
    setCustomer(null);

    try {
      const res = await fetch("/api/cable/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          provider,
          card_number: cardNumber
        })
      });

      const data = await res.json();

      if (data.success) {
        setCustomer(data.customer);
      } else {
        setError(data.message);
      }

    } catch {
      setError("Verification failed");
    }

    setVerifying(false);
  };

  // 💳 PURCHASE
  const handlePurchase = async () => {
    if (!customer) {
      setError("Verify smartcard first");
      return;
    }

    if (!plan) {
      setError("Select a plan");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo-user-id",
          provider,
          card_number: cardNumber,
          plan_id: plan
        })
      });

      const data = await res.json();
      setResult(data);

    } catch {
      setResult({ success: false, message: "Network error" });
    }

    setLoading(false);
  };

  return (
    <DashboardLayout
      title="Cable TV"
      result={result}
      loading={loading}
      setResult={setResult}
    >

      {/* PROVIDERS */}
      <div className="disco-grid">
        {providers.map(p => (
          <div
            key={p.id}
            className={`disco-card ${provider === p.id ? "active" : ""}`}
            onClick={() => {
              setProvider(p.id);
              setPlan("");
              setCustomer(null);
            }}
          >
            <img src={p.logo} />
            <p>{p.name}</p>
          </div>
        ))}
      </div>

      {/* CARD */}
      <div className="input-group">
        <label>Smartcard Number</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <button onClick={verifyCard}>
        {verifying ? "Verifying..." : "Verify Smartcard"}
      </button>

      {/* CUSTOMER */}
      {customer && (
        <div className="verified-box">
          ✅ {customer.name}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {/* PLANS */}
      {customer && (
        <div className="plans">
          {plans[provider].map(p => (
            <div
              key={p.id}
              className={`plan-card ${plan === p.id ? "active" : ""}`}
              onClick={() => setPlan(p.id)}
            >
              <p>{p.name}</p>
              <strong>₦{p.price}</strong>
            </div>
          ))}
        </div>
      )}

      {/* PAY */}
      <button className="pay-btn" onClick={handlePurchase}>
        Proceed to Pay
      </button>

    </DashboardLayout>
  );
}