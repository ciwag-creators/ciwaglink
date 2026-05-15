"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import "./auth.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push("/dashboard");
        router.refresh();
      }

    } catch (err) {
      setMessage("Something went wrong");
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
            Fast, secure and reliable VTU platform
            for airtime, data, electricity,
            cable TV and exam pins.
          </p>
        </div>
      </div>

      <div className="auth-right">

        <form className="auth-card" onSubmit={handleLogin}>

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Login to continue
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
              placeholder="Enter password"
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="bottom-link">
            Don't have an account?

            <Link href="/signup">
              Create Account
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}