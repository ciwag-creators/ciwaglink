"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { discos } from "@/lib/electricity/discos";

export default function ElectricityPage() {

  // =========================
  // STATES
  // =========================

  const [selectedDisco, setSelectedDisco] =
    useState(null);

  const [meterNumber, setMeterNumber] =
    useState("");

  const [meterType, setMeterType] =
    useState("prepaid");

  const [amount, setAmount] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [wallet, setWallet] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  // =========================
  // LOAD WALLET
  // =========================

  useEffect(() => {

    const loadWallet =
      async () => {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) return;

        const { data } =
          await supabase
            .from("wallets")
            .select("*")
            .eq(
              "user_id",
              user.id
            )
            .single();

        setWallet(data);
      };

    loadWallet();

  }, []);

  // =========================
  // PURCHASE
  // =========================

  const buyElectricity =
    async () => {

      try {

        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          alert(
            "Please login"
          );
          return;
        }

        const res = await fetch(
          "/api/electricity",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              user_id:
                user.id,

              disco:
                selectedDisco.id,

              meter_number:
                meterNumber,

              meter_type:
                meterType,

              amount,

              phone,
            }),
          }
        );

        const data =
          await res.json();

        console.log(
          "ELECTRICITY RESULT:",
          data
        );

        setResult(data);

        // REFRESH WALLET

        const {
          data: newWallet,
        } = await supabase
          .from("wallets")
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .single();

        setWallet(newWallet);

      } catch (err) {

        console.log(err);

        setResult({
          success: false,
          message:
            "Something went wrong",
        });

      } finally {

        setLoading(false);
      }
    };

  return (
    <DashboardLayout
      title="Electricity"
    >

      {/* WALLET */}

      <div className="wallet-card">

        <p>
          Wallet Balance
        </p>

        <h1>
          ₦
          {Number(
            wallet?.balance || 0
          ).toLocaleString()}
        </h1>

      </div>

      {/* DISCO */}

      <div className="disco-grid">

        {discos.map(disco => (

          <div
            key={disco.id}

            className={`disco-card ${
              selectedDisco?.id ===
              disco.id
                ? "active"
                : ""
            }`}

            onClick={() =>
              setSelectedDisco(
                disco
              )
            }
          >

            <img
              src={disco.logo}
              alt={disco.name}
            />

            <p>
              {disco.name}
            </p>

          </div>
        ))}

      </div>

      {/* METER NUMBER */}

      <div className="input-group">

        <label>
          Meter Number
        </label>

        <input
          type="text"
          placeholder="Enter meter number"
          value={meterNumber}
          onChange={(e) =>
            setMeterNumber(
              e.target.value
            )
          }
        />

      </div>

      {/* METER TYPE */}

      <div className="input-group">

        <label>
          Meter Type
        </label>

        <select
          value={meterType}
          onChange={(e) =>
            setMeterType(
              e.target.value
            )
          }
        >

          <option value="prepaid">
            Prepaid
          </option>

          <option value="postpaid">
            Postpaid
          </option>

        </select>

      </div>

      {/* AMOUNT */}

      <div className="input-group">

        <label>
          Amount
        </label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

      </div>

      {/* PHONE */}

      <div className="input-group">

        <label>
          Phone Number
        </label>

        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

      </div>

      {/* BUTTON */}

      <button
        className="pay-btn"

        disabled={
          !selectedDisco ||
          !meterNumber ||
          !amount ||
          !phone ||
          loading
        }

        onClick={
          buyElectricity
        }
      >

        {loading
          ? "Processing..."
          : "Buy Electricity"}

      </button>

      {/* RESULT */}

      {result && (

        <div className="result-overlay">

          <div className="result-box">

            {result.success ? (

              <>

                <h2 className="success">
                  ✅ Successful
                </h2>

                <p>
                  Electricity purchase successful
                </p>

                <div className="token-box">

                  <p>
                    <strong>
                      Token
                    </strong>
                  </p>

                  <h2>
                    {result.token}
                  </h2>

                </div>

                <p>
                  Units:
                  {" "}
                  {result.units}
                </p>

              </>

            ) : (

              <>

                <h2 className="error">
                  ❌ Failed
                </h2>

                <p>
                  {result.message}
                </p>

              </>
            )}

            <button
              onClick={() =>
                setResult(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}