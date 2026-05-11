"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { detectNetwork } from "@/lib/utils/detectNetwork";
import { supabase } from "@/lib/supabaseClient";

export default function DataPage() {

  // =========================
  // STATES
  // =========================

  const [network, setNetwork] = useState("mtn");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [showPlans, setShowPlans] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // NETWORKS
  // =========================

  const networks = [
    {
      id: "mtn",
      logo: "/networks/mtn.png",
    },
    {
      id: "airtel",
      logo: "/networks/airtel.png",
    },
    {
      id: "glo",
      logo: "/networks/glo.png",
    },
    {
      id: "9mobile",
      logo: "/networks/9mobile.png",
    },
  ];

  // =========================
  // LOAD PLANS
  // =========================

  useEffect(() => {

    const loadPlans = async () => {

      try {

        const res = await fetch(
          `/api/data/plans?network=${network}`
        );

        const data = await res.json();

        console.log("PLANS RESPONSE:", data);

        if (data.success) {
          setPlans(data.plans || []);
        } else {
          setPlans([]);
        }

      } catch (err) {

        console.log("LOAD PLANS ERROR:", err);

        setPlans([]);
      }
    };

    loadPlans();

  }, [network]);

  // =========================
  // CLOSE DROPDOWN
  // =========================

  useEffect(() => {

    const closeDropdown = () => {
      setShowPlans(false);
    };

    window.addEventListener(
      "click",
      closeDropdown
    );

    return () => {
      window.removeEventListener(
        "click",
        closeDropdown
      );
    };

  }, []);

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
  // PURCHASE DATA
  // =========================

  const handlePurchase = async () => {

    try {

      setLoading(true);

      // =========================
      // GET AUTH USER
      // =========================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("AUTH USER:", user);

      if (!user) {

        setResult({
          success: false,
          message: "Please login",
        });

        setLoading(false);

        return;
      }

      // =========================
      // API REQUEST
      // =========================

      const res = await fetch("/api/data", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          phone,
          network,
          plan_id: selectedPlan.id,
        }),
      });

      const data = await res.json();

      console.log(
        "DATA PURCHASE RESPONSE:",
        data
      );

      setResult(data);

      // =========================
      // RESET FORM
      // =========================

      if (data.success) {

        setPhone("");
        setSelectedPlan(null);
      }

    } catch (err) {

      console.log(
        "DATA PURCHASE ERROR:",
        err
      );

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
      title="Buy Data"
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
              network === n.id
                ? "active"
                : ""
            }`}
            onClick={() => {
              setNetwork(n.id);
              setSelectedPlan(null);
            }}
          >

            <img
              src={n.logo}
              alt={n.id}
            />

            <p>
              {n.id.toUpperCase()}
            </p>

          </div>
        ))}

      </div>

      {/* PLAN SELECTOR */}

      <div className="plan-selector">

        <div
          className="plan-dropdown"
          onClick={(e) => {

            e.stopPropagation();

            setShowPlans(
              !showPlans
            );
          }}
        >

          {selectedPlan ? (
            <span>
              {selectedPlan.name}
              {" - "}
              ₦
              {selectedPlan.selling_price}
            </span>
          ) : (
            <span>
              Select Data Plan
            </span>
          )}

        </div>

        {/* DROPDOWN LIST */}

        {showPlans && (

          <div
            className="plan-dropdown-list"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {plans.length > 0 ? (

              plans.map((plan) => (

                <div
                  key={plan.id}
                  className="plan-item"
                  onClick={() => {

                    setSelectedPlan(
                      plan
                    );

                    setShowPlans(
                      false
                    );
                  }}
                >

                  {plan.name}
                  {" - "}
                  ₦
                  {plan.selling_price}

                </div>
              ))

            ) : (

              <div
                style={{
                  padding: "10px",
                }}
              >
                No plans available
              </div>
            )}

          </div>
        )}

      </div>

      {/* SUMMARY */}

      {selectedPlan && (

        <div className="summary-box">

          <p>
            <strong>
              Network:
            </strong>{" "}
            {network.toUpperCase()}
          </p>

          <p>
            <strong>
              Plan:
            </strong>{" "}
            {selectedPlan.name}
          </p>

          <p>
            <strong>
              Amount:
            </strong>{" "}
            ₦
            {selectedPlan.selling_price}
          </p>

        </div>
      )}

      {/* PHONE */}

      <div className="input-group">

        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) =>
            handlePhoneChange(
              e.target.value
            )
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

      </div>

      {/* BUTTON */}

      <button
        className="pay-btn"
        disabled={
          !phone ||
          !selectedPlan ||
          !!error
        }
        onClick={() =>
          setShowConfirm(true)
        }
      >
        Proceed to Pay
      </button>

      {/* CONFIRM MODAL */}

      {showConfirm && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>
              Confirm Purchase
            </h3>

            <p>
              <strong>
                Network:
              </strong>{" "}
              {network.toUpperCase()}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {phone}
            </p>

            <p>
              <strong>
                Plan:
              </strong>{" "}
              {selectedPlan?.name}
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              ₦
              {
                selectedPlan?.selling_price
              }
            </p>

            <div className="modal-actions">

              <button
                onClick={() =>
                  setShowConfirm(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={async () => {

                  setShowConfirm(
                    false
                  );

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