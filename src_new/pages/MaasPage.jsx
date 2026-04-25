import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../data/products';

const VARIETIES_ALL = [
  'Kothapalli Kobbari', 'Imam Pasand', 'Panduri Teepi Mamidi',
  'Bobbili Peechu', 'Banganapalli',
  'Suvarnarekha', 'Chinna Rasalu', 'Cheruku Rasalu', 'Panchadara Kalasa',
];

const PASS_PRICES = {
  premium: { 12: { price: 4000, strike: 4600 }, 24: { price: 7500, strike: 9200 } },
  exotic:  { 12: { price: 3000, strike: 3500 }, 24: { price: 5600, strike: 7000 } },
  custom:  { 12: { price: 3500, strike: 4000 }, 24: { price: 6500, strike: 8000 } },
};

const PASSES = [
  {
    id: 'premium',
    badge: 'Premium',
    badgeStyle: { background: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.35)' },
    name: 'Premium Pass',
    pool: '3 hand-picked varieties each week, rotated fresh from the farm',
    varieties: ['Kothapalli Kobbari', 'Imam Pasand', 'Panduri Teepi Mamidi', 'Mettavalasa Peechu', 'Bobbili Peechu'],
    features: [
      'Rarest, most sought-after varieties',
      '3 varieties rotating across 4 weeks',
      'WhatsApp ping before each delivery',
      'Free delivery across Hyderabad',
    ],
    featured: false,
  },
  {
    id: 'exotic',
    badge: 'Most Popular',
    badgeStyle: {},
    name: 'Exotic Pass',
    pool: '3 hand-picked varieties each week, rotated fresh from the farm',
    varieties: ['Banganapalli', 'Suvarnarekha', 'Chinna Rasalu', 'Cheruku Rasalu', 'Panchadara Kalasa'],
    features: [
      'Golden classics & rare sweet varieties',
      '3 varieties rotating across 4 weeks',
      'WhatsApp ping before each delivery',
      'Free delivery across Hyderabad',
    ],
    featured: true,
  },
];

const TICKER_ITEMS = [
  'METTAVALASA PEECHU', 'IMAM PASAND', 'KOTHAPALLI KOBBARI', 'BOBBILI PEECHU',
  'SUVARNAREKHA', 'CHINNA RASALU', 'BANGANAPALLI', 'PANDURI TEEPI MAMIDI',
];

function PremiumPopup({ pass, url, onClose }) {
  return (
    <div className="maas-popup-overlay" onClick={onClose}>
      <div className="maas-popup" onClick={e => e.stopPropagation()}>
        <div className="maas-popup-badge">✦ Exclusive</div>
        <h2 className="maas-popup-title">You're joining a small,<br /><em>exclusive circle.</em></h2>
        <p className="maas-popup-body">
          As a MaaS subscriber, we don't just deliver mangoes — we coordinate with you personally, from your first box to your last. Our team will reach out on WhatsApp to confirm your slot, plan your delivery schedule, and make sure every week is exactly right.
        </p>
        <div className="maas-popup-detail">
          <span>🥭 {pass.name}</span>
          <span>⚡ 4 weeks · Free delivery</span>
          <span>📦 Hyderabad</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="maas-popup-cta"
          onClick={onClose}
        >
          Continue to WhatsApp →
        </a>
        <button className="maas-popup-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}

export default function MaasPage() {
  const [premiumPack, setPremiumPack] = useState(12);
  const [exoticPack, setExoticPack] = useState(12);
  const [customPack, setCustomPack] = useState(12);
  const [customSelected, setCustomSelected] = useState([]);
  const [popup, setPopup] = useState(null); // { pass, url }

  const customLimit = customPack === 12 ? 4 : 6;

  function toggleCustomVariety(v) {
    setCustomSelected(prev => {
      if (prev.includes(v)) return prev.filter(x => x !== v);
      if (prev.length >= customLimit) return prev;
      return [...prev, v];
    });
  }

  function buildOrderUrl(passName, pack, varieties, price) {
    const msg = `Hi! I'd like to join the *${passName}* (${pack} pcs/week × 4 weeks) — ₹${price.toLocaleString('en-IN')}.\nVarieties: ${varieties.join(', ')}.\nLooking forward to the season!`;
    return buildWhatsAppUrl(msg);
  }

  function handlePassClick(e, pass, pack, varieties, price) {
    e.preventDefault();
    setPopup({ pass, url: buildOrderUrl(pass.name, pack, varieties, price) });
  }

  return (
    <main style={{ background: '#050f02', color: 'white', minHeight: '100vh' }}>
      {popup && <PremiumPopup pass={popup.pass} url={popup.url} onClose={() => setPopup(null)} />}
      {/* Hero */}
      <section className="maas-hero">
        <div className="maas-hero-dots" />
        <div className="maas-hero-content container">
          <Link to="/products" className="maas-back">← Back to Mangoes</Link>
          <span className="maas-eyebrow">⚡ MaaS · Summer 2026 · Limited Slots</span>
          <h1 className="maas-title">Mango as a<br /><em>Service</em></h1>
          <p className="maas-sub">
            A 4-week mango subscription where you get naturally grown, tree-ripened mangoes delivered fresh from our farm to your home every week.
          </p>
          <p className="maas-sub" style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.9em' }}>
            🚚 Currently available in Hyderabad only · Summer 2026
          </p>
          <a
            href="#passes"
            style={{ display: 'inline-block', marginTop: '1.75rem', background: 'var(--mango)', color: '#1a0a00', fontWeight: 700, fontSize: '0.95rem', padding: '0.75rem 2rem', borderRadius: '100px', textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            See the Passes ↓
          </a>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '0.4rem', fontWeight: 700 }}>
            How <em>MaaS</em> works
          </h2>
          <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
            One subscription. Multiple varieties. Fresh mangoes at your door every week.
          </p>
          <div className="maas-how-grid">
            {[
              { icon: '🥭', title: 'Pick your pack size', body: 'Choose 12 or 24 mangoes per week — right-sized for your family or just for yourself.' },
              { icon: '🌿', title: 'Choose your varieties', body: 'Pick the mango varieties you love from our curated list, or go with a hand-selected pass.' },
              { icon: '🔄', title: 'A fresh mix every week', body: 'Each delivery brings a different set of varieties — so you experience the full depth of mango season, not just one kind over and over.' },
              { icon: '🚚', title: '4 weeks, free delivery', body: 'One payment covers 4 consecutive weekly deliveries to your door, free across Hyderabad.' },
            ].map(({ icon, title, body }) => (
              <div className="maas-how-card" key={title}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{title}</div>
                <div style={{ opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="maas-ticker">
        <div className="maas-ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              <span className="maas-ticker-dot">·</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Packs */}
      <section id="passes" className="maas-packs-section container">
        <div className="maas-packs-head">
          <h2>Pick Your <em>Pass</em></h2>
          <p>One payment. Four weeks. Free across Hyderabad.</p>
        </div>

        <div className="maas-scarcity">
          <span>⚡ Only <strong>18 slots</strong> available this season. <strong>11 claimed.</strong></span>
          <div className="maas-scarcity-track">
            <div className="maas-scarcity-fill" style={{ width: '61%' }} />
          </div>
        </div>

        <div className="maas-cards">
          {PASSES.map(pass => {
            const pack = pass.id === 'premium' ? premiumPack : exoticPack;
            const setPack = pass.id === 'premium' ? setPremiumPack : setExoticPack;
            const { price, strike } = PASS_PRICES[pass.id][pack];
            return (
              <div className={`maas-card${pass.featured ? ' featured' : ''}`} key={pass.id}>
                <div className="maas-card-badge" style={pass.badgeStyle}>{pass.badge}</div>
                <div className="maas-card-name">{pass.name}</div>
                <div className="maas-pool-label">{pass.pool}</div>
                <div className="maas-variety-chips">
                  {pass.varieties.map(v => <span className="maas-variety-chip" key={v}>{v}</span>)}
                </div>
                <div className="maas-pack-toggle">
                  <button className={`maas-pack-btn${pack === 12 ? ' active' : ''}`} onClick={() => setPack(12)}>12 mangoes / week</button>
                  <button className={`maas-pack-btn${pack === 24 ? ' active' : ''}`} onClick={() => setPack(24)}>24 mangoes / week</button>
                </div>
                <div className="maas-card-price">
                  <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.85em', marginRight: 8 }}>₹{strike.toLocaleString('en-IN')}</span>
                  ₹{price.toLocaleString('en-IN')}
                </div>
                <div className="maas-card-per">one-time · 4 weeks · free delivery</div>
                <ul className="maas-features">
                  {pass.features.map(f => <li key={f}><span className="maas-check">✓</span> {f}</li>)}
                </ul>
                <a
                  href="#"
                  className="btn-maas"
                  onClick={e => handlePassClick(e, pass, pack, pass.varieties, price)}
                >
                  ⚡ Start {pass.name} — ₹{price.toLocaleString('en-IN')}
                </a>
              </div>
            );
          })}

          {/* Custom Pass */}
          <div className="maas-card">
            <div className="maas-card-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }}>Your Choice</div>
            <div className="maas-card-name">Customised Pass</div>
            <div className="maas-pool-label">You pick the varieties. We deliver them.</div>
            <div className="maas-pack-toggle">
              <button className={`maas-pack-btn${customPack === 12 ? ' active' : ''}`} onClick={() => { setCustomPack(12); setCustomSelected([]); }}>12 mangoes / week</button>
              <button className={`maas-pack-btn${customPack === 24 ? ' active' : ''}`} onClick={() => { setCustomPack(24); setCustomSelected([]); }}>24 mangoes / week</button>
            </div>
            <div className="maas-custom-count">
              {customSelected.length === 0
                ? <>Pick up to <strong>{customLimit} varieties</strong></>
                : <><strong>{customSelected.length} of {customLimit}</strong> varieties selected {customSelected.length === customLimit ? '✓' : ''}</>}
            </div>
            <div className="maas-custom-varieties">
              {VARIETIES_ALL.map(v => (
                <button
                  key={v}
                  className={`maas-custom-chip${customSelected.includes(v) ? ' selected' : ''}${!customSelected.includes(v) && customSelected.length >= customLimit ? ' disabled' : ''}`}
                  onClick={() => toggleCustomVariety(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="maas-card-price">
              <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.85em', marginRight: 8 }}>₹{PASS_PRICES.custom[customPack].strike.toLocaleString('en-IN')}</span>
              ₹{PASS_PRICES.custom[customPack].price.toLocaleString('en-IN')}
            </div>
            <div className="maas-card-per">one-time · 4 weeks · free delivery</div>
            {customSelected.length >= 1 ? (
              <a
                href="#"
                className="btn-maas"
                onClick={e => handlePassClick(e, { name: 'Customised Pass' }, customPack, customSelected, PASS_PRICES.custom[customPack].price)}
              >
                ⚡ Start Customised Pass — ₹{PASS_PRICES.custom[customPack].price.toLocaleString('en-IN')}
              </a>
            ) : (
              <button className="btn-maas disabled" disabled>
                Select at least 1 variety
              </button>
            )}
          </div>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem', marginTop: '1.75rem' }}>
          After ordering, our team will confirm your delivery schedule with you on WhatsApp — no app needed beyond that.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 700 }}>
            Common questions
          </h2>
          <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: 'When does my subscription start?',
                a: "After you place your order, our team will reach out on WhatsApp to agree on a start date and weekly delivery slot that works for you.",
              },
              {
                q: "What if a variety isn't available that week?",
                a: "We grow and source directly, so availability is reliable. In the rare case a variety isn't ready, our team will inform you in advance and suggest an equally good replacement.",
              },
              {
                q: 'Can I change my delivery day?',
                a: "Yes — just message us on WhatsApp. We coordinate directly with you throughout the season and are happy to adjust.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{q}</div>
                <div style={{ opacity: 0.55, fontSize: '0.85rem', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
