import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
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

            <a
              className="btn btn-leaf basket-checkout-btn"
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
            >
              Pre-order on WhatsApp
            </a>

            <p className="basket-note">
              We will confirm your order and pricing on WhatsApp.
            </p>
          </div>
        )}
      </div>
    </>
  );
}