import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/dashboard.css";
import { generateReceipt } from "@/lib/utils/generateReceipt";

export default function DashboardLayout({
  children,
  title,
  result,
  loading,
  setResult
}) {
  return (
    <>
      {/* RESULT MODAL */}
      {result && (
        <div className="result-overlay">
          <div className="result-box">

            {result.success ? (
              <>
                <h2 className="success">✅ Payment Successful</h2>

<p>{result.message}</p>

{result.token && (
  <div className="token-box">
    <p><strong>Token:</strong></p>

    <div className="token-value">
      {result.token}
    </div>

    <button
      onClick={() => navigator.clipboard.writeText(result.token)}
      className="copy-btn"
    >
      Copy Token
    </button>

    {result.units && (
      <p>Units: {result.units}</p>
    )}
  </div>
)}
              </>
            ) : (
              <>
                <h2 className="error">❌ Failed</h2>
                <p>{result.message || "Transaction failed"}</p>
              </>
            )}

            <button onClick={() => setResult(null)}>
              Close
            </button>

          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Processing your purchase...</p>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="dashboard">
        <Sidebar />

        <div className="main">
          <Header />

          <div className="content">
            <h1>{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}