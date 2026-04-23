import React, { useState } from "react";
import { API_BASE } from "../config.js";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import LockTimer from "./LockTimer";

const API = import.meta.env.VITE_API_URL || "";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, total, isOpen, setIsOpen, changeQty, removeItem, count } = useCart();
  const { refreshInventory } = useInventory();

  // State for the active Razorpay order (set once we lock inventory)
  const [activeOrderId, setActiveOrderId]       = useState(null);
  const [lockExpiresAt, setLockExpiresAt]       = useState(null);
  const [checkoutLoading, setCheckoutLoading]   = useState(false);
  const [stockError, setStockError]             = useState(null);

  // ── Release helper ────────────────────────────────────────────────────────
  async function releaseOrder(orderId) {
    if (!orderId) return;
    try {
      await fetch(API_BASE + '/api/payments/release', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpay_order_id: orderId }),
      });
    } catch { /* best-effort */ }
    setActiveOrderId(null);
    setLockExpiresAt(null);
    refreshInventory();
  }

  // Called when the 5-min timer expires while the drawer is open
  function handleLockExpired() {
    setActiveOrderId(null);
    setLockExpiresAt(null);
    refreshInventory();
    setStockError("Your reservation expired. Please try again.");
  }

  // ── Main checkout flow ────────────────────────────────────────────────────
  async function handleRazorpayCheckout() {
    setStockError(null);
    setCheckoutLoading(true);

    // 1. Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setCheckoutLoading(false);
      alert("Could not load payment gateway. Please check your connection and try again.");
      return;
    }

    // 2. Call backend — creates Razorpay order + locks inventory for 5 min
    let orderData;
    try {
      const res = await fetch(API_BASE + '/api/orders/create', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          cartItems: items.map((i) => ({
            productId: i.id,
            packLabel: i.packLabel,
            qty: i.qty,
            name: i.name,
            price: i.price,
            ...(i.meta ? { meta: i.meta } : {}),
          })),
        }),
      });

      if (res.status === 409) {
        // Insufficient stock
        const err = await res.json();
        setCheckoutLoading(false);
        setStockError(
          `Sorry, only ${err.available} pack(s) of "${err.packLabel}" are available right now.`
        );
        refreshInventory();
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setCheckoutLoading(false);
        setStockError(err.error || "Order creation failed. Please try again.");
        return;
      }

      orderData = await res.json();
    } catch {
      setCheckoutLoading(false);
      setStockError("Network error. Please check your connection and try again.");
      return;
    }

    setActiveOrderId(orderData.orderId);
    setLockExpiresAt(orderData.lockExpiresAt);
    setCheckoutLoading(false);

    // 3. Open Razorpay modal
    const options = {
      key: orderData.keyId,
      order_id: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Aamrutham",
      description: items.map((i) => `${i.name} ×${i.qty}`).join(", "),
      image: "/assets/aam-final.png",
      handler: async function (response) {
        // Payment succeeded — verify on backend
        try {
          const verifyRes = await fetch(API_BASE + '/api/payments/verify', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            setActiveOrderId(null);
            setLockExpiresAt(null);
            setIsOpen(false);
            refreshInventory();
            navigate(`/payment/success?payment_id=${response.razorpay_payment_id}`);
          } else {
            setStockError("Payment verification failed. Please contact support.");
          }
        } catch {
          setStockError("Payment verification error. Please contact support.");
        }
      },
      modal: {
        ondismiss: async function () {
          // User closed modal without paying — release the lock immediately
          await releaseOrder(orderData.orderId);
        },
      },
      prefill: { name: "", contact: "" },
      theme: { color: "#2d5016" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      await releaseOrder(orderData.orderId);
      navigate(
        `/payment/failure?error_code=${response.error.code}&error_description=${encodeURIComponent(response.error.description)}`
      );
      setIsOpen(false);
    });

    rzp.open();
  }

  // ── Floating basket button (closed state) ─────────────────────────────────
  if (!isOpen) {
    return (
      <button
        className="basket-float"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
      >
        <span className="basket-icon">🧺</span>
        {count > 0 && <span className="basket-count">{count}</span>}
      </button>
    );
  }

  // ── Open drawer ───────────────────────────────────────────────────────────
  return (
    <>
      <div className="basket-overlay" onClick={() => setIsOpen(false)} />

      <div className="basket-popup">
        <div className="basket-popup-header">
          <h3>Your Cart</h3>
          <button
            className="basket-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="basket-items">
          {items.length === 0 ? (
            <div className="basket-empty">
              <div className="basket-empty-icon">🧺</div>
              <p>Your cart is empty</p>
              <Link to="/products" onClick={() => setIsOpen(false)}>
                Browse mangoes →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="basket-item" key={item.key}>
                <div className="basket-item-info">
                  <div className="basket-item-name">{item.name}</div>
                  <div className="basket-item-pack">
                    {item.packLabel} · ₹{item.price.toLocaleString("en-IN")} each
                  </div>

                  <div className="basket-qty-row">
                    <button
                      className="basket-qty-btn"
                      onClick={() => changeQty(item.key, -1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className="basket-qty-val">{item.qty}</span>
                    <button
                      className="basket-qty-btn"
                      onClick={() => changeQty(item.key, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="basket-item-right">
                  <div className="basket-item-price">
                    ₹{(item.qty * item.price).toLocaleString("en-IN")}
                  </div>
                  <button
                    className="basket-remove-btn"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="basket-footer">
            {/* Lock countdown — only visible while Razorpay is open */}
            {lockExpiresAt && (
              <LockTimer expiresAt={lockExpiresAt} onExpired={handleLockExpired} />
            )}

            {/* Stock / network error banner */}
            {stockError && (
              <div
                style={{
                  padding: "0.55rem 0.8rem",
                  borderRadius: "8px",
                  background: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.25)",
                  color: "#b91c1c",
                  fontSize: "0.82rem",
                  lineHeight: 1.4,
                }}
              >
                ⚠️ {stockError}
              </div>
            )}

            <div className="basket-total-row">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="btn btn-gold basket-checkout-btn"
              onClick={handleRazorpayCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading
                ? "Reserving…"
                : `Pay Now · ₹${total.toLocaleString("en-IN")}`}
            </button>

            <p className="basket-note">
              Secure payment powered by Razorpay. Your cart is reserved for 5 minutes once you click Pay Now.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
