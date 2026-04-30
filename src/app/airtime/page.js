"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AirtimePage() {
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const networks = [
    { id: "mtn", name: "MTN", provider_id: 1, logo: "/networks/mtn.png" },
    { id: "airtel", name: "Airtel", provider_id: 2, logo: "/networks/airtel.png" },
    { id: "glo", name: "Glo", provider_id: 3, logo: "/networks/glo.png" },
    { id: "9mobile", name: "9mobile", provider_id: 4, logo: "/networks/9mobile.png" },
  ];

  const amounts = [100, 200, 500, 1000, 2000, 5000];

  const handlePurchase = async () => {
    if (!phone || !amount) {
      alert("Enter phone and amount");
      return;
    }

    const selected = networks.find(n => n.id === network);

    try {
      const res = await fetch("/api/airtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo-user-id", // replace later with auth user
          phone,
          amount,
          provider_id: selected.provider_id,
          service_id: selected.id
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Airtime purchase successful!");
      } else {
        alert(data.message || "Failed");
      }

    } catch (err) {
      alert("Error processing request");
    }
  };

  return (
    <DashboardLayout title="Buy Airtime">
      <div className="airtime-box">

        <h3>Select Network</h3>

        <div className="networks">
          {networks.map(n => (
            <div
              key={n.id}
              className={`network-card ${network === n.id ? "active" : ""}`}
              onClick={() => setNetwork(n.id)}
            >
              <img src={n.logo} />
              <p>{n.name}</p>
            </div>
          ))}
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <h4>Select Amount</h4>

        <div className="amounts">
          {amounts.map(a => (
            <div
              key={a}
              className={`amount-btn ${amount === a ? "active" : ""}`}
              onClick={() => setAmount(a)}
            >
              ₦{a}
            </div>
          ))}
        </div>

        <button className="pay-btn" onClick={handlePurchase}>
          Proceed to Pay
        </button>

      </div>
    </DashboardLayout>
  );
}