import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/dashboard.css";

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
                <h2 className="success">✅ Success</h2>
                <p>Transaction successful!</p>
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