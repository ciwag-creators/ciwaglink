"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./auth.css";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const user = data?.user;

      if (user) {

        await supabase
          .from("wallets")
          .upsert({
            user_id: user.id,
            balance: 0,
            currency: "NGN",
          });

        router.push("/dashboard");
      }

    } catch (err) {
      setMessage("Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="overlay"></div>

        <div className="left-content">

          <h1>CIWAGLINK</h1>

          <p>
            Join thousands of users enjoying
            instant VTU services nationwide.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <form
          className="auth-card"
          onSubmit={handleSignup}
        >

          <h2>Create Account</h2>

          <p className="subtitle">
            Start using CIWAGLINK today
          </p>

          {message && (
            <div className="auth-error">
              {message}
            </div>
          )}

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          <div className="bottom-link">
            Already have an account?

            <Link href="/login">
              Login
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}