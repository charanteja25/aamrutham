import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { LAST_ORDER_KEY } from '../components/CartDrawer';

const STEPS = [
  { label: 'Order Confirmed', sub: 'We have your order', icon: '✅' },
  { label: 'Handpicking', sub: 'Farmers selecting your mangoes', icon: '🧺' },
  { label: 'Packed & Dispatched', sub: 'On its way to you', icon: '📦' },
  { label: 'Out for Delivery', sub: 'Almost there!', icon: '🚐' },
  { label: 'Delivered', sub: 'Enjoy your mangoes!', icon: '🥭' },
];

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    clearCart?.();
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (raw) {
      try { setOrder(JSON.parse(raw)); } catch {}
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fffdf8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#2d5016', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 32 }}>✓</div>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>Order Confirmed!</h1>
        <p style={{ color: '#b8d4a0', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Your mangoes are being handpicked</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '1.5rem' }}>

        {/* AAM Order ID */}
        {order?.aamOrderId && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Your Order ID</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#2d5016', letterSpacing: '0.06em', fontFamily: 'monospace' }}>{order.aamOrderId}</p>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#aaa' }}>Save this for tracking and support</p>
          </div>
        )}

        {/* Order Summary */}
        {order?.items?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>What You Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < order.items.length - 1 ? '1px solid #f5f0e8' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>{item.packLabel} × {item.qty}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#2d5016', fontSize: '0.95rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '2px solid #f5f0e8' }}>
              <span style={{ fontWeight: 700, color: '#1a1a1a' }}>Total Paid</span>
              <span style={{ fontWeight: 800, color: '#2d5016', fontSize: '1.1rem' }}>₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Delivery Journey */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Delivery Status</h3>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: i < STEPS.length - 1 ? '0' : '0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i === 0 ? '#2d5016' : '#f0ebe0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: i === 0 ? 16 : 14,
                  flexShrink: 0,
                }}>
                  {i === 0 ? '✓' : <span style={{ opacity: 0.4 }}>{step.icon}</span>}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, height: 28, background: i === 0 ? '#2d5016' : '#e8e0d0', margin: '2px 0' }} />
                )}
              </div>
              <div style={{ paddingTop: 6, paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                <div style={{ fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#2d5016' : '#aaa', fontSize: '0.9rem' }}>{step.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#bbb', marginTop: 1 }}>{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div style={{ background: '#f0f7ec', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>📧</span>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#2d5016', lineHeight: 1.5 }}>
            A confirmation email has been sent to you. For any queries, WhatsApp us at <strong>+91 76708 26759</strong> with your Order ID.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '0.85rem', background: '#2d5016', color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Order More
          </Link>
          <Link to="/" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '0.85rem', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
