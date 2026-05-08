"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ExampinPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔥 LOAD PRODUCTS
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/exam-pin/products");
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    };

    load();
  }, []);

  // 💳 PURCHASE
  const handlePurchase = async () => {
    if (!selectedProduct) {
      alert("Select exam type");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/exam-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo-user-id",
          product_id: selectedProduct.product_id,
          quantity
        })
      });

      const data = await res.json();
      setResult(data);

    } catch {
      setResult({ success: false, message: "Network error" });
    }

    setLoading(false);
  };

  return (
    <DashboardLayout
      title="Exam PIN"
      result={result}
      loading={loading}
      setResult={setResult}
    >

      {/* PRODUCTS */}
      <div className="plans">
        {products.map(p => (
          <div
            key={p.product_id}
            className={`plan-card ${selectedProduct?.product_id === p.product_id ? "active" : ""}`}
            onClick={() => setSelectedProduct(p)}
          >
            <p>{p.name}</p>
            <strong>₦{p.selling_price}</strong>
          </div>
        ))}
      </div>

      {/* QUANTITY */}
      <div className="input-group">
        <label>Quantity</label>
        <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={5}>5</option>
        </select>
      </div>

      {/* SUMMARY */}
      {selectedProduct && (
        <div className="summary-box">
          <p>{selectedProduct.name}</p>
          <p>Total: ₦{selectedProduct.selling_price * quantity}</p>
        </div>
      )}

      <button className="pay-btn" onClick={handlePurchase}>
        Buy PIN
      </button>

    </DashboardLayout>
  );
}