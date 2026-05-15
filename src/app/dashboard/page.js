"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {

  const router = useRouter();

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Login successful.</p>
    </div>
  );
}