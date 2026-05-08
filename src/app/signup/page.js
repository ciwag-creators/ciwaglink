"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Automatically create profile and wallet
    await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: "",
      email: data.user.email
    });

    await supabase.from("wallets").insert({
      user_id: data.user.id,
      balance: 0,
      locked_balance: 0
    });

    alert("Signup successful! Please verify your email if required.");
    setLoading(false);
    router.push("/login");
  };

  return (
    <div className="auth-page">
      <h1>Signup</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
}