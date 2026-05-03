import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config.js';

const STATUS_LABEL = {
  paid:      { text: 'Confirmed',  bg: '#e8f5e9', color: '#2e7d32' },
  shipped:   { text: 'Shipped',    bg: '#e3f2fd', color: '#1565c0' },
  delivered: { text: 'Delivered',  bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled: { text: 'Cancelled',  bg: '#fce4ec', color: '#c62828' },
};

function StatusBadge({ status }) {
  const s = STATUS_LABEL[status] || { text: status, bg: '#f5f5f5', color: '#555' };
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.7rem',
      borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
      background: s.bg, color: s.color, letterSpacing: '0.04em',
    }}>{s.text}</span>
  );
}

function OrderCard({ order }) {
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const items = order.cart_items || [];
  const total = (order.amount / 100).toLocaleString('en-IN');

  return (
    <div style={{
      border: '1px solid #e8dfc8', borderRadius: 14, padding: '1.1rem 1.25rem',
      marginBottom: '1rem', background: '#fffdf7',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#2d5016', letterSpacing: '0.02em' }}>
            {order.aam_order_id || `Order #${order.id}`}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8a7560', marginTop: 2 }}>{date}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div style={{ margin: '0.75rem 0 0.5rem', borderTop: '1px solid #f0e8d4', paddingTop: '0.65rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
            <span style={{ color: '#3a2a14' }}>
              {item.name} <span style={{ color: '#8a7560' }}>· {item.packLabel}</span>
            </span>
            <span style={{ color: '#3a2a14', fontWeight: 600 }}>×{item.qty}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#8a7560' }}>{order.address_city}</span>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>₹{total}</span>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const [step, setStep]         = useState('phone'); // 'phone' | 'otp' | 'orders'
  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState('');
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  function startResendTimer() {
    setResendTimer(60);
    const iv = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(iv); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/order-history/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: digits }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); return; }
      setStep('otp');
      startResendTimer();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp.trim().length !== 6) { setError('Enter the 6-digit code'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/order-history/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: phone.replace(/\D/g, '').slice(-10), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid code'); return; }
      setOrders(data.orders);
      setStep('orders');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setError(''); setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/order-history/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: phone.replace(/\D/g, '').slice(-10) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to resend'); return; }
      startResendTimer();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf7f2', padding: '2rem 0 4rem' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 1.25rem' }}>

        <Link to="/" style={{ fontSize: '0.85rem', color: '#8a7560', textDecoration: 'none' }}>← Back to Home</Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', margin: '1.25rem 0 0.25rem', color: '#1a1a1a' }}>
          Your Orders
        </h1>
        <p style={{ color: '#8a7560', fontSize: '0.92rem', marginBottom: '2rem' }}>
          Enter your mobile number to see your Aamrutham order history.
        </p>

        {/* ── Phone step ── */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <label style={labelStyle}>Mobile Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={prefixStyle}>🇮🇳 +91</span>
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="tel" inputMode="numeric"
                placeholder="9876543210"
                maxLength={10}
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button style={btnStyle} type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send WhatsApp Code →'}
            </button>
          </form>
        )}

        {/* ── OTP step ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              background: '#e8f5e9', border: '1px solid #c8e6c9',
              borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
              fontSize: '0.85rem', color: '#2e7d32',
            }}>
              ✅ WhatsApp code sent to +91 {phone}
            </div>

            <label style={labelStyle}>Enter 6-digit Code</label>
            <input
              style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: '1.4rem', textAlign: 'center' }}
              type="tel" inputMode="numeric"
              placeholder="• • • • • •"
              maxLength={6}
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
              autoFocus
            />
            {error && <p style={errorStyle}>{error}</p>}
            <button style={btnStyle} type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'View My Orders →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#8a7560' }}>
              Didn't get it?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                style={{
                  background: 'none', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer',
                  color: resendTimer > 0 ? '#aaa' : '#2d5016', fontWeight: 600, fontSize: '0.82rem', padding: 0,
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
              {' · '}
              <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2d5016', fontWeight: 600, fontSize: '0.82rem', padding: 0 }}>
                Change number
              </button>
            </div>
          </form>
        )}

        {/* ── Orders step ── */}
        {step === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#8a7560' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧺</div>
                <p style={{ fontWeight: 600, color: '#3a2a14' }}>No orders yet</p>
                <p style={{ fontSize: '0.85rem' }}>Looks like +91 {phone} hasn't placed an order.</p>
                <Link to="/products" style={{ display: 'inline-block', marginTop: '1rem', color: '#2d5016', fontWeight: 700 }}>
                  Browse Mangoes →
                </Link>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.82rem', color: '#8a7560', marginBottom: '1rem' }}>
                  {orders.length} order{orders.length !== 1 ? 's' : ''} for +91 {phone}
                </p>
                {orders.map(o => <OrderCard key={o.id} order={o} />)}
              </>
            )}
            <button
              onClick={() => { setStep('phone'); setPhone(''); setOtp(''); setOrders([]); setError(''); }}
              style={{ ...btnStyle, background: 'transparent', color: '#2d5016', border: '1.5px solid #2d5016', marginTop: '0.5rem' }}
            >
              Look up another number
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: '#6b5535', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
};
const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  border: '1.5px solid #e3d9c2', borderRadius: 10,
  fontSize: '1rem', background: '#fff', color: '#1a1a1a',
  fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
};
const prefixStyle = {
  display: 'flex', alignItems: 'center', padding: '0 0.75rem',
  background: '#f5ede0', border: '1.5px solid #e3d9c2',
  borderRadius: 10, fontSize: '0.9rem', color: '#5B3A15', whiteSpace: 'nowrap',
};
const btnStyle = {
  display: 'block', width: '100%', marginTop: '1rem',
  padding: '0.85rem', borderRadius: 50,
  background: '#2d5016', color: '#fff', border: 'none',
  fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit',
};
const errorStyle = { margin: '6px 0 0', fontSize: '0.78rem', color: '#b91c1c' };
