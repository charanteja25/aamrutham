import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
  const {
    items,
    total,
    isOpen,
    setIsOpen,
    changeQty,
    removeItem,
    checkoutUrl,
    count,
  } = useCart();

  async function handleRazorpayCheckout() {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Could not load payment. Please check your connection and try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // set in .env
      amount: total * 100,          // Razorpay expects paise (₹1 = 100 paise)
      currency: "INR",
      name: "Aamrutham",
      description: items.map((i) => `${i.name} x${i.qty}`).join(", "),
      image: "/assets/aam-final.png",
      handler: function (response) {
        // Payment succeeded — navigate with payment details
        navigate(
          `/payment/success?payment_id=${response.razorpay_payment_id}`
        );
        setIsOpen(false);
      },
      modal: {
        ondismiss: function () {
          // User closed the modal without paying — no navigation, stay on page
        },
      },
      prefill: {
        name: "",
        contact: "",
      },
      theme: {
        color: "#2d5016",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      navigate(
        `/payment/failure?error_code=${response.error.code}&error_description=${encodeURIComponent(response.error.description)}`
      );
      setIsOpen(false);
    });

    rzp.open();
  }

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
            <div className="basket-total-row">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="btn btn-gold basket-checkout-btn"
              onClick={handleRazorpayCheckout}
            >
              Pay Now  ·  ₹{total.toLocaleString("en-IN")}
            </button>

            <a
              className="btn btn-outline basket-checkout-btn"
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
            >
              Pre-order on WhatsApp
            </a>

            <p className="basket-note">
              Secure payment powered by Razorpay.
            </p>
          </div>
        )}
      </div>
    </>
  );
}