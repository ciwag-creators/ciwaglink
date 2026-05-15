"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/DashboardLayout";

export default function TransactionsPage() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setTransactions(data || []);
  };

  return (
    <DashboardLayout>

      <div className="bg-white rounded-3xl p-6 shadow">

        <h1 className="text-3xl font-bold mb-6">
          Transaction History
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-3 uppercase">
                    {tx.type}
                  </td>

                  <td className="p-3">
                    ₦{Number(tx.amount).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {tx.status}
                  </td>

                  <td className="p-3">
                    {new Date(tx.created_at)
                      .toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </DashboardLayout>
  );
}
