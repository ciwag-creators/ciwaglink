"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ElectricityPage() {
  const [disco, setDisco] = useState("ikeja-electric");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [amount, setAmount] = useState("");

  const [customer, setCustomer] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ⚡ DISCO LIST WITH LOGOS
  const discos = [
    { id: "ikeja-electric", name: "IKEDC", logo: "/discos/ikeja.png" },
    { id: "eko-electric", name: "EKEDC", logo: "/discos/eko.png" },
    { id: "bedc", name: "BEDC", logo: "/discos/bedc.png" },
    { id: "abuja-electric", name: "AEDC", logo: "/discos/abuja.png" },
    { id: "ibadan-electric", name: "IBEDC", logo: "/discos/ibadan.png" },
    { id: "portharcourt-electric", name: "PHED", logo: "/discos/ph.png" },
    { id: "kaduna-electric", name: "KAEDCO", logo: "/discos/kaduna.png" },
    { id: "jos-electric", name: "JEDC", logo: "/discos/jos.png" },
    { id: "enugu-electric", name: "EEDC", logo: "/discos/enugu.png" }
  ];

  // 🔍 VERIFY METER
  const verifyMeter = async () => {
    if (!meterNumber || meterNumber.length < 10) {
      setError("Enter valid meter number");
      return;
    }

    setVerifying(true);
    setError("");
    setCustomer(null);

    try {
      const res = await fetch("/api/electricity/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          disco,
          meter_number: meterNumber,
          meter_type: meterType
        })
      });

      const data = await res.json();

      if (data.success) {
        setCustomer(data.customer);
      } else {
        setError(data.message || "Verification failed");
      }

    } catch {
      setError("Network error");
    }

    setVerifying(false);
  };

  // 💳 PURCHASE
  const handlePurchase = async () => {
    if (!customer) {
      setError("Please verify meter first");
      return;
    }

    setShowConfirm(false);
    setLoading(true);

    try {
      const res = await fetch("/api/electricity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo-user-id",
          disco,
          meter_number: meterNumber,
          meter_type: meterType,
          amount
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
      title="Pay Electricity"
      result={result}
      loading={loading}
      setResult={setResult}
    >

      {/* ⚡ DISCO SELECTOR */}
      <div className="disco-grid">
        {discos.map(d => (
          <div
            key={d.id}
            className={`disco-card ${disco === d.id ? "active" : ""}`}
            onClick={() => setDisco(d.id)}
          >
            <img src={d.logo} alt={d.name} />
            <p>{d.name}</p>
          </div>
        ))}
      </div>

      {/* METER NUMBER */}
      <div className="input-group">
        <label>Meter Number</label>
        <input
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          placeholder="Enter meter number"
        />
      </div>

      {/* METER TYPE */}
      <div className="input-group">
        <label>Meter Type</label>
        <select value={meterType} onChange={(e) => setMeterType(e.target.value)}>
          <option value="prepaid">Prepaid</option>
          <option value="postpaid">Postpaid</option>
        </select>
      </div>

      {/* VERIFY */}
      <button onClick={verifyMeter} disabled={verifying}>
        {verifying ? "Verifying..." : "Verify Meter"}
      </button>

      {/* VERIFIED CUSTOMER */}
      {customer && (
  <div className="verified-box">
    <p>✅ <strong>{customer.name}</strong></p>
    <p>📍 {customer.address}</p>
    <p>⚡ Tariff: {customer.tariff}</p>
  </div>
)}

      {error && <p className="error">{error}</p>}

      {/* AMOUNT */}
      <div className="input-group">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      {/* PAY */}
      <button className="pay-btn" onClick={() => setShowConfirm(true)}>
        Proceed to Pay
      </button>

      {/* CONFIRM */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Payment</h3>

         <p><strong>Name:</strong> {customer?.name}</p>
         <p><strong>Address:</strong> {customer?.address}</p>
         <p><strong>Tariff:</strong> {customer?.tariff}</p>
         <p><strong>Meter:</strong> {meterNumber}</p>
         <p><strong>Amount:</strong> ₦{amount}</p>

            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button onClick={handlePurchase} className="confirm-btn">
                Confirm
              </button>
              {result.success && (
  <button
    className="receipt-btn"
    onClick={() =>
      generateReceipt({
        name: result.customer?.name || "Customer",
        meter: result.meter_number,
        disco: result.disco,
        amount: result.amount,
        token: result.token,
        units: result.units,
        transaction_id: result.transaction_id
      })
    }
  >
    Download Receipt
  </button>
)}
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}