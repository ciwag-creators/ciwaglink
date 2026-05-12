"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";

export default function FundWalletPage() {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] =
    useState(false);

  const [account, setAccount] =
    useState(null);

  const [wallet, setWallet] =
    useState(null);

  const [user, setUser] =
    useState(null);

  // =========================
  // LOAD USER + WALLET
  // =========================

  useEffect(() => {

    const loadUser = async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setUser(user);

      // LOAD WALLET
      const { data: walletData } =
        await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .single();

      setWallet(walletData);

      // LOAD SAVED ACCOUNT
      const { data: existing } =
        await supabase
          .from("virtual_accounts")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (existing) {
        setAccount(existing);
      }
    };

    loadUser();

  }, []);

  // =========================
  // GENERATE MONNIFY ACCOUNT
  // =========================

  const generateAccount =
    async () => {

      try {

        setLoading(true);

        if (!user) {
          alert(
            "Please login"
          );
          return;
        }

        const res = await fetch(
          "/api/monnify/account",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user,
            }),
          }
        );

        const data =
          await res.json();

        console.log(
          "MONNIFY RESPONSE:",
          data
        );

        if (
          data.requestSuccessful
        ) {

          const accountData =
            data.responseBody;

          const bank =
            accountData.accounts?.[0];

          // SAVE TO DATABASE
          await supabase
            .from(
              "virtual_accounts"
            )
            .insert({
              user_id: user.id,

              account_name:
                accountData.accountName,

              account_number:
                bank?.accountNumber,

              bank_name:
                bank?.bankName,

              account_reference:
                accountData.accountReference,
            });

          setAccount({
            account_name:
              accountData.accountName,

            account_number:
              bank?.accountNumber,

            bank_name:
              bank?.bankName,
          });

          alert(
            "Virtual account created"
          );

        } else {

          alert(
            data.responseMessage ||
              "Failed to generate account"
          );
        }

      } catch (err) {

        console.log(err);

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <DashboardLayout
      title="Fund Wallet"
    >

      {/* WALLET CARD */}

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

      {/* FUND OPTIONS */}

      <div className="fund-box">

        <h2>
          Fund via Bank Transfer
        </h2>

        <p>
          Generate a dedicated
          Monnify virtual account
          to fund your wallet
          automatically.
        </p>

        {!account ? (

          <button
            className="pay-btn"
            onClick={
              generateAccount
            }
            disabled={loading}
          >

            {loading
              ? "Generating..."
              : "Generate Virtual Account"}

          </button>

        ) : (

          <div className="virtual-account-card">

            <h3>
              Virtual Account
            </h3>

            <div className="account-item">

              <span>
                Bank Name
              </span>

              <strong>
                {
                  account.bank_name
                }
              </strong>

            </div>

            <div className="account-item">

              <span>
                Account Number
              </span>

              <strong>
                {
                  account.account_number
                }
              </strong>

            </div>

            <div className="account-item">

              <span>
                Account Name
              </span>

              <strong>
                {
                  account.account_name
                }
              </strong>

            </div>

            <p className="fund-note">
              Transfer money to
              this account and your
              wallet will be funded
              automatically.
            </p>

          </div>
        )}

      </div>

      {/* PAYSTACK */}

      <div className="fund-box">

        <h2>
          Fund with Paystack
        </h2>

        <p>
          Use ATM card, bank
          transfer, USSD or bank
          app.
        </p>

        <button
          className="pay-btn"
          onClick={() => {
            window.location.href =
              "/wallet/paystack";
          }}
        >
          Continue with Paystack
        </button>

      </div>

    </DashboardLayout>
  );
}