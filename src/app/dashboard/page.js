"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import "./dashboard.css";

export default function DashboardPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [wallet, setWallet] = useState(0);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    try {

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {

        router.push("/login");
        return;

      }

      setUser(user);

      await loadWallet(user.id);

      await loadTransactions(user.id);

    } catch (err) {

      console.log(err);

      router.push("/login");

    }

    setLoading(false);
  };

  const loadWallet = async (userId) => {

    const { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {

      setWallet(data.balance || 0);

    }
  };

  const loadTransactions = async (userId) => {

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (data) {

      setTransactions(data);

    }
  };

  const logout = async () => {

    await supabase.auth.signOut();

    router.push("/login");
  };

  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* TOP BAR */}

      <div className="topbar">

        <div>
          <h2>
            Welcome Back
          </h2>

          <p>
            {user?.email}
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* WALLET */}

      <div className="wallet-card">

        <p>
          Wallet Balance
        </p>

        <h1>
          ₦{Number(wallet).toLocaleString()}
        </h1>

        <Link href="/fund-wallet">
          <button className="fund-btn">
            Fund Wallet
          </button>
        </Link>

      </div>

      {/* SERVICES */}

      <div className="services-grid">

        <Link href="/airtime" className="service-card">
          <h3>Airtime</h3>
          <p>Buy airtime instantly</p>
        </Link>

        <Link href="/data" className="service-card">
          <h3>Data</h3>
          <p>Affordable data plans</p>
        </Link>

        <Link href="/electricity" className="service-card">
          <h3>Electricity</h3>
          <p>Pay electricity bills</p>
        </Link>

        <Link href="/exam-pin" className="service-card">
          <h3>Exam PIN</h3>
          <p>WAEC, NECO & NABTEB</p>
        </Link>

      </div>

      {/* TRANSACTIONS */}

      <div className="transactions-section">

        <div className="transaction-header">

          <h3>
            Recent Transactions
          </h3>

          <Link href="/transactions">
            View All
          </Link>

        </div>

        {
          transactions.length === 0 ? (

            <div className="empty-transactions">

              No transactions yet

            </div>

          ) : (

            transactions.map((trx) => (

              <div
                key={trx.id}
                className="transaction-card"
              >

                <div>

                  <h4>
                    {trx.type?.toUpperCase()}
                  </h4>

                  <p>
                    {trx.phone || trx.reference}
                  </p>

                </div>

                <div className="trx-right">

                  <h4>
                    ₦{trx.amount}
                  </h4>

                  <span
                    className={`status ${trx.status}`}
                  >
                    {trx.status}
                  </span>

                </div>

              </div>

            ))

          )
        }

      </div>

    </div>
  );
}