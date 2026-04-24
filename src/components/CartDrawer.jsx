import React, { useState } from "react";
import { API_BASE } from "../config.js";

export const LAST_ORDER_KEY = 'aam_last_order';
const CUSTOMER_KEY = 'aam_last_customer';
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { HYD_PINCODES } from "../data/products";
import { isSeasonPassActive } from "../data/season";
import LockTimer from "./LockTimer";

const API = import.meta.env.VITE_API_URL || "";

const EMPTY_CUSTOMER = {
  name: '',
  email: '',
  contact: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: 'Telangana',
  pincode: '',
  landmark: '',
};

function loadSavedCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return EMPTY_CUSTOMER;
    return { ...EMPTY_CUSTOMER, ...JSON.parse(raw) };
  } catch {
    return EMPTY_CUSTOMER;
  }
}

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

  // Address step: 'cart' → review items, 'address' → collect shipping info.
  const [step, setStep]          = useState('cart');
  const [customer, setCustomer]  = useState(loadSavedCustomer);
  const [formErrors, setFormErrors] = useState({});

  function updateCustomer(field, value) {
    setCustomer((c) => ({ ...c, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  function validateCustomer() {
    const errs = {};
    if (!customer.name.trim()) errs.name = 'Required';
    if (!/^[0-9]{10}$/.test(customer.contact.replace(/\D/g, '').slice(-10))) {
      errs.contact = 'Enter a 10-digit mobile number';
    }
    if (customer.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email.trim())) {
      errs.email = 'Enter a valid email';
    }
    if (!customer.address_line1.trim()) errs.address_line1 = 'Required';
    if (!customer.city.trim()) errs.city = 'Required';
    if (!customer.state.trim()) errs.state = 'Required';
    const pin = customer.pincode.trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      errs.pincode = '6-digit pincode';
    } else if (!HYD_PINCODES.includes(Number(pin))) {
      errs.pincode = 'We currently deliver within Hyderabad only.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

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
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim() || null,
            contact: customer.contact.replace(/\D/g, '').slice(-10),
            address_line1: customer.address_line1.trim(),
            address_line2: customer.address_line2.trim() || null,
            city: customer.city.trim(),
            state: customer.state.trim(),
            pincode: customer.pincode.trim(),
            landmark: customer.landmark.trim() || null,
          },
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
            const verifyData = await verifyRes.json();
            sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({
              aamOrderId: verifyData.aamOrderId,
              paymentId: response.razorpay_payment_id,
              items: items.map(i => ({ name: i.name, packLabel: i.packLabel, qty: i.qty, price: i.price })),
              total: items.reduce((s, i) => s + i.price * i.qty, 0),
              customer: { ...customer },
            }));
            // Save for next time — makes repeat checkout one-click.
            try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); } catch {}
            setActiveOrderId(null);
            setLockExpiresAt(null);
            setIsOpen(false);
            setStep('cart');
            refreshInventory();
            navigate('/payment/success');
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
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact.replace(/\D/g, '').slice(-10),
      },
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

  function handleContinueToAddress() {
    setStockError(null);
    if (items.length === 0) return;
    setStep('address');
  }

  async function handleSubmitAddress() {
    if (!validateCustomer()) return;
    await handleRazorpayCheckout();
  }

  // ── Open drawer ───────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="basket-overlay"
        onClick={() => { setIsOpen(false); setStep('cart'); }}
      />

      <div className="basket-popup">
        <div className="basket-popup-header">
          <h3>{step === 'address' ? 'Delivery Address' : 'Your Cart'}</h3>
          <button
            className="basket-close-btn"
            onClick={() => { setIsOpen(false); setStep('cart'); }}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {step === 'cart' && count >= 2 && isSeasonPassActive() &&
         !items.some((i) => (i.id || '').toLowerCase().includes('season-pass')) && (() => {
          // Personalised comparison — pick the Season Pass tier closest to the user's cart.
          const PASS_12 = 2499;
          const PASS_24 = 4499;
          const totalPieces = items.reduce((sum, it) => {
            const pcs = parseInt(it.packLabel, 10) || 0;
            return sum + pcs * it.qty;
          }, 0);
          const passPrice = totalPieces >= 18 ? PASS_24 : PASS_12;
          const passLabel = totalPieces >= 18 ? '24 pcs/week × 4 weeks' : '12 pcs/week × 4 weeks';
          const savings = total - passPrice;

          return (
            <Link
              to="/maas"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                margin: '0.75rem 1rem 0',
                padding: '0.85rem 1rem',
                background: 'linear-gradient(135deg, #fff7e0 0%, #fde9b8 100%)',
                border: '1px solid #f0d28c',
                borderLeft: '3px solid #e8a020',
                borderRadius: 10,
                textDecoration: 'none',
                color: '#5B3A15',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#b67014', letterSpacing: '0.04em' }}>
                ⚡ SAVE WITH SEASON PASS
              </div>
              {savings > 200 ? (
                <div style={{ fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  Your cart is <strong>₹{total.toLocaleString('en-IN')}</strong>. A Season Pass
                  ({passLabel}) is <strong>₹{passPrice.toLocaleString('en-IN')}</strong> —
                  {' '}you'd save <strong style={{ color: '#2d5016' }}>₹{savings.toLocaleString('en-IN')}</strong>. →
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  Prefer variety every week? Our Season Pass delivers rare heritage mangoes for 4 weeks —
                  {' '}<strong>₹{passPrice.toLocaleString('en-IN')}</strong>, one payment. →
                </div>
              )}
            </Link>
          );
        })()}

        {step === 'cart' && (
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
        )}

        {step === 'address' && (
          <AddressForm
            customer={customer}
            errors={formErrors}
            onChange={updateCustomer}
          />
        )}

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

            {step === 'cart' ? (
              <button
                className="btn btn-gold basket-checkout-btn"
                onClick={handleContinueToAddress}
              >
                Continue to Address →
              </button>
            ) : (
              <>
                <button
                  className="btn btn-gold basket-checkout-btn"
                  onClick={handleSubmitAddress}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading
                    ? "Reserving…"
                    : `Pay Now · ₹${total.toLocaleString("en-IN")}`}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  disabled={checkoutLoading}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    padding: '0.55rem',
                    background: 'transparent',
                    border: '1px solid #e0d9c6',
                    borderRadius: 8,
                    color: '#5B3A15',
                    fontSize: '0.85rem',
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Back to Cart
                </button>
              </>
            )}

            <p className="basket-note">
              Your cart is reserved for 5 minutes once you click Pay Now.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Address form ──────────────────────────────────────────────────────────────
const fieldLabel = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#6b5535',
  fontWeight: 600,
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
const fieldInput = {
  width: '100%',
  padding: '0.55rem 0.7rem',
  border: '1.5px solid #e3d9c2',
  borderRadius: 8,
  fontSize: '0.92rem',
  background: '#fff',
  color: '#1a1a1a',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
const fieldInputError = { ...fieldInput, borderColor: '#dc2626' };
const fieldErrorText = { margin: '4px 0 0', fontSize: '0.72rem', color: '#b91c1c' };

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={fieldLabel}>{label}</label>
      {children}
      {error && <p style={fieldErrorText}>{error}</p>}
    </div>
  );
}

function AddressForm({ customer, errors, onChange }) {
  const inp = (field, error) => (error ? fieldInputError : fieldInput);
  return (
    <div className="basket-items" style={{ padding: '1rem 1.1rem' }}>
      <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#6b5535' }}>
        Where should we deliver your mangoes?
      </p>

      <Field label="Full Name *" error={errors.name}>
        <input
          style={inp('name', errors.name)}
          value={customer.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ravi Kumar"
          autoComplete="name"
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <Field label="Mobile *" error={errors.contact}>
          <input
            style={inp('contact', errors.contact)}
            value={customer.contact}
            onChange={(e) => onChange('contact', e.target.value.replace(/[^0-9+ ]/g, ''))}
            placeholder="10-digit number"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
        <Field label="Email (optional)" error={errors.email}>
          <input
            style={inp('email', errors.email)}
            value={customer.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="you@email.com"
            inputMode="email"
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Address Line 1 *" error={errors.address_line1}>
        <input
          style={inp('address_line1', errors.address_line1)}
          value={customer.address_line1}
          onChange={(e) => onChange('address_line1', e.target.value)}
          placeholder="House / flat no, street"
          autoComplete="address-line1"
        />
      </Field>

      <Field label="Address Line 2" error={errors.address_line2}>
        <input
          style={fieldInput}
          value={customer.address_line2}
          onChange={(e) => onChange('address_line2', e.target.value)}
          placeholder="Area, locality"
          autoComplete="address-line2"
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <Field label="City *" error={errors.city}>
          <input
            style={inp('city', errors.city)}
            value={customer.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Hyderabad"
            autoComplete="address-level2"
          />
        </Field>
        <Field label="State *" error={errors.state}>
          <input
            style={inp('state', errors.state)}
            value={customer.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Telangana"
            autoComplete="address-level1"
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <Field label="Pincode *" error={errors.pincode}>
          <input
            style={inp('pincode', errors.pincode)}
            value={customer.pincode}
            onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="500001"
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </Field>
        <Field label="Landmark (optional)">
          <input
            style={fieldInput}
            value={customer.landmark}
            onChange={(e) => onChange('landmark', e.target.value)}
            placeholder="Near…"
          />
        </Field>
      </div>
    </div>
  );
}
