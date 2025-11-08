import React, { useState } from "react";

export default function CheckoutModal({ onClose, onSubmit, cart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }
    onSubmit({ name, email });
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <h2 style={{ marginBottom: "10px", color: "#111827" }}>Checkout</h2>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          Please enter your details to complete the purchase
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <span style={{ fontWeight: 500, color: "#374151" }}>Full Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{ marginTop: "6px" }}
            />
          </label>

          <label style={{ marginTop: "12px" }}>
            <span style={{ fontWeight: 500, color: "#374151" }}>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              style={{ marginTop: "6px" }}
            />
          </label>

          <div
            className="checkout-summary"
            style={{
              background: "#f9fafb",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "18px",
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>
              🛍️ <strong>{cart.items.length}</strong> item(s)
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "1rem", color: "#111827" }}>
              <strong>Total:</strong> Rs.{Number(cart.total).toFixed(2)}
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              style={{
                background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                border: "none",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
