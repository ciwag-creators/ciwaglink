"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { exams } from "@/lib/exam/exams";

export default function ExamPinPage() {

  const [selectedExam, setSelectedExam] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

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
  // TOTAL
  // =========================

  const total =
    selectedExam
      ? selectedExam.price *
        quantity
      : 0;

  // =========================
  // BUY PIN
  // =========================

  const buyPin =
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
          "/api/exam-pin",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              user_id:
                user.id,

              exam_type:
                selectedExam.id,

              product_id:
                selectedExam.product_id,

              quantity,

              amount: total,

            }),
          }
        );

        const data =
          await res.json();

        console.log(
          "EXAM RESULT:",
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
      title="Exam PIN"
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

      {/* EXAMS */}

      <div className="disco-grid">

        {exams.map(exam => (

          <div
            key={exam.id}

            className={`disco-card ${
              selectedExam?.id ===
              exam.id
                ? "active"
                : ""
            }`}

            onClick={() =>
              setSelectedExam(
                exam
              )
            }
          >

            <img
              src={exam.logo}
              alt={exam.name}
            />

            <p>
              {exam.name}
            </p>

          </div>
        ))}

      </div>

      {/* QUANTITY */}

      <div className="input-group">

        <label>
          Quantity
        </label>

        <select
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Number(
                e.target.value
              )
            )
          }
        >

          <option value={1}>
            1 PIN
          </option>

          <option value={2}>
            2 PINS
          </option>

          <option value={5}>
            5 PINS
          </option>

        </select>

      </div>

      {/* SUMMARY */}

      {selectedExam && (

        <div className="summary-box">

          <p>
            <strong>
              Exam:
            </strong>{" "}
            {
              selectedExam.name
            }
          </p>

          <p>
            <strong>
              Quantity:
            </strong>{" "}
            {quantity}
          </p>

          <p>
            <strong>
              Total:
            </strong>{" "}
            ₦
            {Number(
              total
            ).toLocaleString()}
          </p>

        </div>
      )}

      {/* BUTTON */}

      <button
        className="pay-btn"

        disabled={
          !selectedExam ||
          loading
        }

        onClick={buyPin}
      >

        {loading
          ? "Processing..."
          : "Buy PIN"}

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
                  {
                    result.exam_name
                  } PIN generated successfully
                </p>

                <div className="pins-wrapper">

                  {result.pins?.map(
                    (
                      pin,
                      index
                    ) => (

                      <div
                        key={index}
                        className="token-box"
                      >

                        <h3>
                          PIN{" "}
                          {index + 1}
                        </h3>

                        <p>
                          {pin}
                        </p>

                      </div>
                    )
                  )}

                </div>

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