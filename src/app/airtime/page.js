"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { detectNetwork } from "@/lib/utils/detectNetwork";

export default function AirtimePage() {
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const networks = [
    {
      id: "mtn",
      name: "MTN",
      logo: "/networks/mtn.png",
    },
    {
      id: "airtel",
      name: "Airtel",
      logo: "/networks/airtel.png",
    },
    {
      id: "glo",
      name: "Glo",
      logo: "/networks/glo.png",
    },
    {
      id: "9mobile",
      name: "9mobile",
      logo: "/networks/9mobile.png",
    },
  ];

  // =========================
  // PHONE VALIDATION
  // =========================

  const handlePhoneChange = (value) => {
    setPhone(value);

    if (value.length < 11) {
      setError("");
      return;
    }

    const detected = detectNetwork(value);

    if (!detected) {
      setError("Invalid phone number");
    } else if (detected !== network) {
      setError(
        `This number is ${detected.toUpperCase()}, not ${network.toUpperCase()}`
      );
    } else {
      setError("");
    }
  };

  // =========================
  // PURCHASE AIRTIME
  // =========================

  const handlePurchase = async () => {
    try {
      setLoading(true);

      // GET LOGGED IN USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("LOGGED IN USER:", user);

      if (!user) {
        setResult({
          success: false,
          message: "Please login",
        });

        return;
      }

      const res = await fetch("/api/airtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          phone,
          network,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      console.log("AIRTIME RESPONSE:", data);

      setResult(data);

      // CLEAR FORM AFTER SUCCESS
      if (data.success) {
        setPhone("");
        setAmount("");
      }

    } catch (err) {
      console.log("AIRTIME ERROR:", err);

      setResult({
        success: false,
        message: "Network error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Buy Airtime"
      loading={loading}
      result={result}
      setResult={setResult}
    >
      {/* NETWORKS */}
      <div className="networks">
        {networks.map((n) => (
          <div
            key={n.id}
            className={`network-card ${
              network === n.id ? "active" : ""
            }`}
            onClick={() => setNetwork(n.id)}
          >
            <img src={n.logo} alt={n.name} />
            <p>{n.name}</p>
          </div>
        ))}
      </div>

      {/* PHONE */}
      <div className="input-group">
        <label>Phone Number</label>

        <input
          type="tel"
          placeholder="08012345678"
          value={phone}
          onChange={(e) =>
            handlePhoneChange(e.target.value)
          }
        />

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}
      </div>

      {/* AMOUNT */}
      <div className="input-group">
        <label>Amount</label>

        <input
          type="number"
          placeholder="100"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />
      </div>

      {/* SUMMARY */}
      {phone && amount && (
        <div className="summary-box">
          <p>
            <strong>Network:</strong>{" "}
            {network.toUpperCase()}
          </p>

          <p>
            <strong>Phone:</strong> {phone}
          </p>

          <p>
            <strong>Amount:</strong> ₦{amount}
          </p>
        </div>
      )}

      {/* BUTTON */}
      <button
        className="pay-btn"
        disabled={
          !phone ||
          !amount ||
          Number(amount) < 50 ||
          !!error
        }
        onClick={() => setShowConfirm(true)}
      >
        Proceed to Pay
      </button>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Airtime Purchase</h3>

            <p>
              <strong>Network:</strong>{" "}
              {network.toUpperCase()}
            </p>

            <p>
              <strong>Phone:</strong> {phone}
            </p>

            <p>
              <strong>Amount:</strong> ₦{amount}
            </p>

            <div className="modal-actions">
              <button
                onClick={() =>
                  setShowConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={async () => {
                  setShowConfirm(false);
                  await handlePurchase();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}