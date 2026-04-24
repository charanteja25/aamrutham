import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config.js';

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

// Action row beneath an address: copy-to-clipboard + open in Google Maps.
function AddressActions({ oneLine }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(oneLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Some browsers block clipboard in non-secure contexts — fallback.
      window.prompt('Copy address:', oneLine);
    }
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(oneLine)}`;

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
      <button
        type="button"
        onClick={copy}
        style={{
          padding: '3px 8px',
          fontSize: '0.72rem',
          background: '#fff',
          border: '1px solid #d9c791',
          borderRadius: 4,
          cursor: 'pointer',
          color: '#5B3A15',
          fontWeight: 600,
        }}
      >
        {copied ? '✓ Copied' : '📋 Copy'}
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          padding: '3px 8px',
          fontSize: '0.72rem',
          background: '#fff',
          border: '1px solid #d9c791',
          borderRadius: 4,
          textDecoration: 'none',
          color: '#5B3A15',
          fontWeight: 600,
        }}
      >
        🗺️ Maps
      </a>
    </div>
  );
}

function formatAddress(o) {
  const lines = [
    o.address_line1,
    o.address_line2,
    [o.address_city, o.address_state].filter(Boolean).join(', '),
    o.address_pincode ? 'PIN ' + o.address_pincode : null,
    o.address_landmark ? 'Landmark: ' + o.address_landmark : null,
  ].filter(Boolean);
  return lines;
}

// Single-line address string used for one-click copy to clipboard and Maps link.
function addressOneLine(o) {
  return [
    o.address_line1,
    o.address_line2,
    o.address_city,
    o.address_state,
    o.address_pincode,
  ]
    .filter(Boolean)
    .join(', ');
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [data, setData]       = useState(null);
  const [filter, setFilter]   = useState('');
  const [page, setPage]       = useState(1);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null); // orderId or null

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
              {['', 'ID', 'Date', 'Customer & Delivery Address', 'Amount', 'Items', 'Status', 'Update'].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', color: '#888', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.orders.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No orders found</td></tr>
            )}
            {data.orders.map(order => {
              const sc = STATUS_COLORS[order.status] || { bg: '#f5f5f5', color: '#555' };
              const items = Array.isArray(order.cart_items) ? order.cart_items : [];
              const isOpen = expanded === order.id;
              const addressLines = formatAddress(order);

              return (
                <React.Fragment key={order.id}>
                <tr style={{ borderBottom: isOpen ? 'none' : '1px solid #f5f5f5', background: isOpen ? '#fffaf0' : 'transparent' }}>
                  <td style={{ padding: '0.65rem 0.5rem' }}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      style={{
                        width: 24, height: 24, border: '1px solid #e0e0e0',
                        background: '#fff', borderRadius: 4, cursor: 'pointer',
                        fontSize: 12, color: '#666',
                      }}>
                      {isOpen ? '▾' : '▸'}
                    </button>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#333' }}>
                    #{order.id}
                    {order.aam_order_id && (
                      <div style={{ fontSize: '0.7rem', color: '#999', fontFamily: 'monospace', fontWeight: 400 }}>{order.aam_order_id}</div>
                    )}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap', color: '#555' }}>{fmtDate(order.created_at)}</td>
                  <td style={{ padding: '0.65rem 0.75rem', minWidth: 280 }}>
                    <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{order.customer_name || '—'}</div>

                    <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: '#666', marginTop: 2, flexWrap: 'wrap' }}>
                      {order.customer_contact && (
                        <a href={`tel:${order.customer_contact}`} style={{ color: '#2d5016', textDecoration: 'none' }}>📞 {order.customer_contact}</a>
                      )}
                      {order.customer_email && (
                        <a href={`mailto:${order.customer_email}`} style={{ color: '#2d5016', textDecoration: 'none' }}>✉️ {order.customer_email}</a>
                      )}
                    </div>

                    {addressLines.length > 0 ? (
                      <div style={{
                        marginTop: 6,
                        padding: '6px 10px',
                        background: '#fbf6ec',
                        border: '1px solid #f0e3c0',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        color: '#3b2507',
                        lineHeight: 1.5,
                      }}>
                        {addressLines.map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                        <AddressActions oneLine={addressOneLine(order)} />
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#bbb', fontStyle: 'italic' }}>
                        No address on file (legacy order)
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#1a1a1a' }}>{fmt(order.amount)}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#555' }}>
                    {items.map((it, i) => {
                      const gift = it.meta && it.meta.gift ? it.meta : null;
                      return (
                        <div key={i} style={{ fontSize: '0.78rem', marginBottom: gift ? 6 : 0 }}>
                          <div>
                            {it.name || it.productName || 'Item'}
                            {it.packLabel ? ` · ${it.packLabel}` : ''}
                            {' × ' + (it.qty || it.quantity || 1)}
                          </div>
                          {gift && (
                            <div style={{
                              marginTop: 4,
                              padding: '6px 8px',
                              background: '#fff3e0',
                              border: '1px solid #f0d28c',
                              borderLeft: '3px solid #e8a020',
                              borderRadius: 5,
                              fontSize: '0.75rem',
                              color: '#5B3A15',
                              lineHeight: 1.45,
                            }}>
                              <div style={{ fontWeight: 700, color: '#b67014', marginBottom: 2 }}>
                                🎁 Gift Order
                              </div>
                              {gift.recipientName && (
                                <div><strong>To:</strong> {gift.recipientName}</div>
                              )}
                              {gift.recipientPhone && (
                                <div>
                                  <strong>WhatsApp:</strong>{' '}
                                  <a
                                    href={`https://wa.me/91${gift.recipientPhone.replace(/\D/g,'').slice(-10)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: '#2d5016', textDecoration: 'none' }}
                                  >
                                    +91 {gift.recipientPhone}
                                  </a>
                                </div>
                              )}
                              {gift.giftMessage && (
                                <div style={{
                                  marginTop: 4,
                                  padding: '4px 6px',
                                  background: '#fffbf0',
                                  borderRadius: 3,
                                  fontStyle: 'italic',
                                  color: '#6b5535',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                }}>
                                  "{gift.giftMessage}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                {isOpen && (
                  <tr style={{ borderBottom: '1px solid #f5f5f5', background: '#fffaf0' }}>
                    <td></td>
                    <td colSpan={7} style={{ padding: '0.25rem 0.75rem 1rem' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Payment</p>
                      <p style={{ margin: '1px 0', fontSize: '0.82rem', color: '#333' }}>Razorpay order: <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{order.razorpay_order_id}</span></p>
                      {order.razorpay_payment_id && (
                        <p style={{ margin: '1px 0', fontSize: '0.82rem', color: '#333' }}>Payment ID: <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{order.razorpay_payment_id}</span></p>
                      )}
                      <p style={{ margin: '1px 0', fontSize: '0.82rem', color: '#333' }}>Amount: <strong>{fmt(order.amount)}</strong> {order.currency}</p>
                      <p style={{ margin: '1px 0', fontSize: '0.82rem', color: '#888' }}>Last updated: {fmtDate(order.updated_at)}</p>
                    </td>
                  </tr>
                )}
                </React.Fragment>
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
// Inventory rows are keyed by (product_id, pack_label). We render one row per
// pack so the admin can set stock independently for each.
const invKey = (it) => `${it.product_id}|${it.pack_label}`;

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
      data.forEach(it => { initial[invKey(it)] = String(it.stock); });
      setEdits(initial);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveStock(item) {
    const key = invKey(item);
    const stock = parseInt(edits[key], 10);
    if (isNaN(stock) || stock < 0) return;
    setSaving(key);
    const res = await fetch(API_BASE + '/api/admin/inventory', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        product_id: item.product_id,
        pack_label: item.pack_label,
        stock,
      }),
    });
    if (res.ok) {
      setSaved(key);
      await load();
      setTimeout(() => setSaved(null), 1500);
    } else {
      const err = await res.json().catch(() => ({}));
      alert('Update failed: ' + (err.error || res.status));
    }
    setSaving(null);
  }

  if (!items) return <p style={{ color: '#888' }}>Loading inventory…</p>;

  return (
    <div>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Update available stock for each product + pack size. Changes take effect immediately.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
              {['Product', 'Pack', 'Stock', 'Set Stock', ''].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', color: '#888', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const key = invKey(item);
              const edit = edits[key] ?? String(item.stock);
              const parsed = parseInt(edit, 10);
              const unchanged = !isNaN(parsed) && parsed === item.stock;
              return (
                <tr key={key} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#1a1a1a' }}>
                    {item.product_id}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.82rem' }}>
                    {item.pack_label}
                  </td>
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
                      value={edit}
                      onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ width: 80, padding: '0.35rem 0.5rem', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: '0.9rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {saved === key
                      ? <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.82rem' }}>✓ Saved</span>
                      : (
                        <button
                          disabled={saving === key || unchanged || isNaN(parsed)}
                          onClick={() => saveStock(item)}
                          style={{
                            padding: '0.35rem 0.85rem',
                            background: '#e8a020',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            cursor: saving === key ? 'not-allowed' : 'pointer',
                            opacity: (saving === key || unchanged || isNaN(parsed)) ? 0.5 : 1,
                          }}
                        >
                          {saving === key ? 'Saving…' : 'Update'}
                        </button>
                      )
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Season Pass Tab ──────────────────────────────────────────────────────────
// Admin can set total slots + claimed count for any season_year. Upserts.
function SeasonPassTab() {
  const currentYear = new Date().getFullYear();
  const [rows, setRows]     = useState(null);
  const [year, setYear]     = useState(currentYear);
  const [total, setTotal]   = useState('');
  const [claimed, setClaimed] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'saved' | 'error' | null
  const [errMsg, setErrMsg] = useState('');

  async function load() {
    const res = await fetch(API_BASE + '/api/admin/season-pass/slots', { headers: authHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    setRows(data);
    // Prefill form with the most-recent row so the admin can nudge it easily.
    if (data[0]) {
      setYear(data[0].season_year);
      setTotal(String(data[0].total));
      setClaimed(String(data[0].claimed));
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    const yearInt    = parseInt(year, 10);
    const totalInt   = parseInt(total, 10);
    const claimedInt = parseInt(claimed, 10);

    if (!Number.isInteger(yearInt) || yearInt < 2000 || yearInt > 2100) {
      setStatus('error'); setErrMsg('Year must be 2000-2100'); return;
    }
    if (!Number.isInteger(totalInt) || totalInt < 0) {
      setStatus('error'); setErrMsg('Total must be a non-negative whole number'); return;
    }
    if (!Number.isInteger(claimedInt) || claimedInt < 0) {
      setStatus('error'); setErrMsg('Claimed must be a non-negative whole number'); return;
    }
    if (claimedInt > totalInt) {
      setStatus('error'); setErrMsg('Claimed cannot exceed total'); return;
    }

    setSaving(true);
    setStatus(null);
    const res = await fetch(API_BASE + '/api/admin/season-pass/slots', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ season_year: yearInt, total: totalInt, claimed: claimedInt }),
    });
    setSaving(false);

    if (res.ok) {
      setStatus('saved');
      setTimeout(() => setStatus(null), 2000);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      setStatus('error');
      setErrMsg(err.error || 'Update failed');
    }
  }

  if (!rows) return <p style={{ color: '#888' }}>Loading season pass slots…</p>;

  const currentRow = rows.find((r) => r.season_year === parseInt(year, 10));
  const available = currentRow ? currentRow.total - currentRow.claimed : 0;
  const pct = currentRow && currentRow.total > 0
    ? Math.round((currentRow.claimed / currentRow.total) * 100)
    : 0;

  return (
    <div>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Set the total slots available and how many have been claimed for each season. The MaaS page
        reads these numbers live — changes reflect immediately for customers.
      </p>

      {/* Editor */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr) auto',
        gap: '0.85rem',
        alignItems: 'end',
        padding: '1.25rem',
        background: '#fff',
        border: '1px solid #f0e4cc',
        borderRadius: 10,
        marginBottom: '1rem',
      }}>
        <LabelInput label="Season Year" value={year} onChange={setYear} type="number" />
        <LabelInput label="Total Slots" value={total} onChange={setTotal} type="number" min="0" />
        <LabelInput label="Claimed" value={claimed} onChange={setClaimed} type="number" min="0" />
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#e8a020',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1,
            height: 38,
          }}
        >
          {saving ? 'Saving…' : (status === 'saved' ? '✓ Saved' : 'Update')}
        </button>
      </div>

      {status === 'error' && (
        <div style={{
          padding: '0.6rem 0.9rem',
          background: '#fce4ec',
          border: '1px solid #f4c2d2',
          color: '#b71c1c',
          borderRadius: 6,
          fontSize: '0.85rem',
          marginBottom: '1rem',
        }}>
          {errMsg}
        </div>
      )}

      {/* Current state preview — mirrors what the customer sees. */}
      {currentRow && (
        <div style={{
          padding: '1rem 1.25rem',
          background: '#fffbf0',
          border: '1px solid #f0d28c',
          borderRadius: 10,
          marginBottom: '1.5rem',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#b67014', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Preview · What customers see
          </p>
          <p style={{ margin: '0 0 10px', fontSize: '0.95rem', color: '#5B3A15' }}>
            ⚡ Only <strong>{currentRow.total} slots</strong> available this season.
            {' '}<strong>{currentRow.claimed} claimed</strong> · {available} left.
          </p>
          <div style={{ height: 6, background: '#f3e3b4', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#e8a020', transition: 'width 0.3s' }} />
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#8a7453' }}>
            {pct}% claimed · last updated {fmtDate(currentRow.updated_at)}
          </p>
        </div>
      )}

      {/* History table */}
      {rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                {['Year', 'Total', 'Claimed', 'Available', 'Last Updated'].map((h) => (
                  <th key={h} style={{ padding: '0.6rem 0.75rem', color: '#888', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.season_year} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{r.season_year}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{r.total}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{r.claimed}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: (r.total - r.claimed) === 0 ? '#d32f2f' : '#2e7d32' }}>
                    {r.total - r.claimed}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#999', fontSize: '0.82rem' }}>
                    {fmtDate(r.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LabelInput({ label, value, onChange, type = 'text', min }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </label>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '0.5rem 0.65rem', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: '0.92rem', height: 38, boxSizing: 'border-box' }}
      />
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
    { key: 'overview',    label: '📊 Overview' },
    { key: 'orders',      label: '📦 Orders' },
    { key: 'inventory',   label: '🥭 Inventory' },
    { key: 'seasonpass',  label: '⚡ Season Pass' },
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
          {tab === 'overview'   && <OverviewTab stats={stats} />}
          {tab === 'orders'     && <OrdersTab />}
          {tab === 'inventory'  && <InventoryTab />}
          {tab === 'seasonpass' && <SeasonPassTab />}
        </div>
      </div>
    </div>
  );
}
