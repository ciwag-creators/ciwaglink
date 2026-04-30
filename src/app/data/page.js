"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { detectNetwork } from "@/lib/utils/detectNetwork";

export default function DataPage() {
  const [network, setNetwork] = useState("mtn");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const networks = [
    { id: "mtn", logo: "/networks/mtn.png" },
    { id: "airtel", logo: "/networks/airtel.png" },
    { id: "glo", logo: "/networks/glo.png" },
    { id: "9mobile", logo: "/networks/9mobile.png" }
  ];

  // 🔥 Load plans
  useEffect(() => {
    const loadPlans = async () => {
      const res = await fetch(`/api/data/plans?network=${network}`);
      const data = await res.json();

      if (data.success) {
        setPlans(data.plans);
      }
    };

    loadPlans();
  }, [network]);

  // 🔥 Phone detection + validation
  const handlePhoneChange = (value) => {
    setPhone(value);

    const detected = detectNetwork(value);

    if (value.length >= 11 && !detected) {
      setError("Invalid phone number");
    } else {
      setError("");
    }

    if (detected) {
      setNetwork(detected);
    }
  };

  // 🔥 Purchase
  const handlePurchase = async () => {
    if (!phone || !selectedPlan) {
      alert("Fill all fields");
      return;
    }

    if (error) {
      alert("Fix phone number");
      return;
    }

    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo-user-id",
          phone,
          plan_id: selectedPlan.id
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Data purchase successful!");
      } else {
        alert(data.message || "Failed");
      }

    } catch (err) {
      alert("Error processing request");
    }
  };

  return (
    <DashboardLayout title="Buy Data">

      {/* NETWORKS */}
      <div className="networks">
        {networks.map(n => (
          <div
            key={n.id}
            className={`network-card ${network === n.id ? "active" : ""}`}
            onClick={() => setNetwork(n.id)}
          >
            <img src={n.logo} />
            <p>{n.id.toUpperCase()}</p>
          </div>
        ))}
      </div>

   {/* PLANS */}
      <div className="plans">
  {plans?.length > 0 ? plans.map(plan => (
    <div
      key={plan.id}
      className={`plan-card ${
        selectedPlan?.id === plan.id ? "active" : ""
      }`}
      onClick={() => setSelectedPlan(plan)}
    >
      <p className="plan-name">{plan.name}</p>
      <strong className="plan-price">₦{plan.selling_price}</strong>

      {selectedPlan?.id === plan.id && (
        <span className="selected-badge">✓ Selected</span>
      )}
    </div>
  )) : (
    <p>No plans available</p>
  )}
</div>

{selectedPlan && (
  <div className="summary-box">
    <p><strong>Selected Plan:</strong> {selectedPlan.name}</p>
    <p><strong>Amount:</strong> ₦{selectedPlan.selling_price}</p>
  </div>
)}

      {/* PHONE */}
      <div className="input-group">
        <input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
      </div>

   
      {/* BUTTON */}
      <button
  className="pay-btn"
  onClick={handlePurchase}
  disabled={!phone || !selectedPlan || error}
>
  Proceed to Pay
</button>

    </DashboardLayout>
  );
}