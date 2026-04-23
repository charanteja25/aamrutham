import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config.js';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  paid:      { bg: '#e6f4ea', color: '#2e7d32' },
  pending:   { bg: '#fff8e1', color: '#f57f17' },
  shipped:   { bg: '#e3f2fd', color: '#1565c0' },
  delivered: { bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled: { bg: '#fce4ec', color: '#b71c1c' },
};

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  };
}

function fmt(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${color}`,
    }}>
      <p style={{ margin: 0, fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '0.35rem 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a' }}>{value}</p>
      {sub && <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#aaa' }}>{sub}</p>}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats }) {
  if (!stats) return <p style={{ color: '#888' }}>Loading stats…</p>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      <StatCard label="Total Orders"   value={stats.totalOrders}                color="#e8a020" />
      <StatCard label="Paid"           value={stats.paidOrders}                 color="#2e7d32" sub={fmt(stats.totalRevenue) + ' revenue'} />
      <StatCard label="Pending"        value={stats.pendingOrders}              color="#f57f17" />
      <StatCard label="Shipped"        value={stats.shippedOrders}              color="#1565c0" />
      <StatCard label="Delivered"      value={stats.deliveredOrders}            color="#6a1b9a" />
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [data, setData]       = useState(null);
  const [filter, setFilter]   = useState('');
  const [page, setPage]       = useState(1);
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    const q = filter ? `&status=${filter}` : '';
    const res = await fetch(API_BASE + '/api/admin/orders?page=' + page + '&limit=20' + q, { headers: authHeaders() });
    if (res.ok) setData(await res.json());
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    const res = await fetch(API_BASE + '/api/admin/orders/' + orderId + '/status', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) await load();
    setUpdating(null);
  }

  if (!data) return <p style={{ color: '#888' }}>Loading orders…</p>;

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: filter === s ? '#e8a020' : '#e0e0e0',
              background: filter === s ? '#fff8eb' : '#fff',
              color: filter === s ? '#c17a00' : '#555',
              fontWeight: filter === s ? 700 : 400,
              cursor: 'pointer',
              fontSize: '0.82rem',
            }}>
            {s || 'All'} {s === '' && `(${data.total})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              {['ID', 'Date', 'Customer', 'Amount', 'Items', 'Status', 'Update'].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', color: '#888', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.orders.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No orders found</td></tr>
            )}
            {data.orders.map(order => {
              const sc = STATUS_COLORS[order.status] || { bg: '#f5f5f5', color: '#555' };
              const items = Array.isArray(order.cart_items) ? order.cart_items : [];
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#333' }}>#{order.id}</td>
                  <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap', color: '#555' }}>{fmtDate(order.created_at)}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <div style={{ fontWeight: 500, color: '#333' }}>{order.customer_name || '—'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999' }}>{order.customer_contact || order.customer_email || ''}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#1a1a1a' }}>{fmt(order.amount)}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#555' }}>
                    {items.map((it, i) => (
                      <div key={i} style={{ fontSize: '0.78rem' }}>
                        {it.name || it.productName || 'Item'} × {it.qty || it.quantity || 1}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '0.25rem 0.6rem', borderRadius: 20, fontWeight: 600, fontSize: '0.78rem' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <select
                      disabled={updating === order.id}
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      style={{ padding: '0.3rem 0.5rem', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={paginBtn}>← Prev</button>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={paginBtn}>Next →</button>
        </div>
      )}
    </div>
  );
}

const paginBtn = {
  padding: '0.35rem 0.8rem',
  border: '1.5px solid #e0e0e0',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.82rem',
};

// ─── Inventory Tab ────────────────────────────────────────────────────────────
function InventoryTab() {
  const [items, setItems]   = useState(null);
  const [edits, setEdits]   = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved]   = useState(null);

  async function load() {
    const res = await fetch(API_BASE + '/api/admin/inventory', { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setItems(data);
      const initial = {};
      data.forEach(it => { initial[it.product_id] = it.stock; });
      setEdits(initial);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveStock(productId) {
    const stock = parseInt(edits[productId]);
    if (isNaN(stock) || stock < 0) return;
    setSaving(productId);
    const res = await fetch(API_BASE + '/api/admin/inventory/' + productId, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ stock }),
    });
    if (res.ok) {
      setSaved(productId);
      await load();
      setTimeout(() => setSaved(null), 1500);
    }
    setSaving(null);
  }

  if (!items) return <p style={{ color: '#888' }}>Loading inventory…</p>;

  return (
    <div>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Update available stock for each product. Changes take effect immediately.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              {['Product', 'Product ID', 'Current Stock', 'Set Stock', ''].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', color: '#888', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.product_id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#1a1a1a' }}>{item.product_id}</td>
                <td style={{ padding: '0.75rem', color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>{item.product_id}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    fontWeight: 700,
                    color: item.stock === 0 ? '#d32f2f' : item.stock < 10 ? '#f57f17' : '#2e7d32',
                    fontSize: '1rem',
                  }}>
                    {item.stock}
                  </span>
                  {item.stock === 0 && <span style={{ marginLeft: 6, fontSize: '0.75rem', color: '#d32f2f', fontWeight: 600 }}>OUT</span>}
                  {item.stock > 0 && item.stock < 10 && <span style={{ marginLeft: 6, fontSize: '0.75rem', color: '#f57f17', fontWeight: 600 }}>LOW</span>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <input
                    type="number"
                    min={0}
                    value={edits[item.product_id] ?? item.stock}
                    onChange={e => setEdits(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                    style={{ width: 80, padding: '0.35rem 0.5rem', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: '0.9rem', textAlign: 'center' }}
                  />
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {saved === item.product_id
                    ? <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.82rem' }}>✓ Saved</span>
                    : (
                      <button
                        disabled={saving === item.product_id || parseInt(edits[item.product_id]) === item.stock}
                        onClick={() => saveStock(item.product_id)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          background: '#e8a020',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: saving === item.product_id ? 'not-allowed' : 'pointer',
                          opacity: (saving === item.product_id || parseInt(edits[item.product_id]) === item.stock) ? 0.5 : 1,
                        }}
                      >
                        {saving === item.product_id ? 'Saving…' : 'Update'}
                      </button>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const navigate    = useNavigate();
  const [tab, setTab]     = useState('overview');
  const [stats, setStats] = useState(null);
  const username = localStorage.getItem('admin_username') || 'Admin';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin', { replace: true }); return; }
    fetch(API_BASE + '/api/admin/stats', { headers: authHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setStats)
      .catch(() => { localStorage.removeItem('admin_token'); navigate('/admin', { replace: true }); });
  }, [navigate]);

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin');
  }

  const tabs = [
    { key: 'overview',   label: '📊 Overview' },
    { key: 'orders',     label: '📦 Orders' },
    { key: 'inventory',  label: '🥭 Inventory' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f4', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🥭</span>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a' }}>Aamrutham Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>Signed in as <strong>{username}</strong></span>
          <button onClick={logout} style={{ padding: '0.35rem 0.85rem', border: '1.5px solid #e0e0e0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: '0.82rem', color: '#555' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '2px solid #eee' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderBottom: tab === t.key ? '3px solid #e8a020' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontWeight: tab === t.key ? 700 : 400,
              color: tab === t.key ? '#c17a00' : '#666',
              fontSize: '0.9rem',
              marginBottom: -2,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {tab === 'overview'  && <OverviewTab stats={stats} />}
          {tab === 'orders'    && <OrdersTab />}
          {tab === 'inventory' && <InventoryTab />}
        </div>
      </div>
    </div>
  );
}
