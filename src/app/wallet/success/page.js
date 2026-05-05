"use client";

export default function SuccessPage() {
  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <h1>🎉 Payment Successful</h1>
      <p>Your wallet has been funded successfully.</p>

      <a href="/dashboard">Go to Dashboard</a>
    </div>
  );
}