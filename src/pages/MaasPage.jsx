import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../data/products';

const VARIETIES_ALL = [
  'Kothapalli Kobbari', 'Imam Pasand', 'Panduri Teepi Mamidi',
  'Mettavalasa Peechu', 'Bobbili Peechu', 'Banganapalli',
  'Suvarnarekha', 'Chinna Rasalu', 'Cheruku Rasalu', 'Panchadara Kalasa',
];

const PRICES = { 12: 2499, 24: 4499 };

const PASSES = [
  {
    id: 'premium',
    badge: 'Premium',
    badgeStyle: { background: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.35)' },
    name: 'Premium Pass',
    pool: 'Any 3 varieties per week, based on availability',
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
    pool: 'Any 3 varieties per week, based on availability',
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

export default function MaasPage() {
  const [premiumPack, setPremiumPack] = useState(12);
  const [exoticPack, setExoticPack] = useState(12);
  const [customPack, setCustomPack] = useState(12);
  const [customSelected, setCustomSelected] = useState([]);

  const customLimit = customPack === 12 ? 3 : 5;

  function toggleCustomVariety(v) {
    setCustomSelected(prev => {
      if (prev.includes(v)) return prev.filter(x => x !== v);
      if (prev.length >= customLimit) return prev;
      return [...prev, v];
    });
  }

  function buildOrderUrl(passName, pack, varieties) {
    const msg = `Hi! I'd like to order the *${passName}* (${pack} pcs/week × 4 weeks) — ₹${PRICES[pack].toLocaleString('en-IN')}.\nVarieties: ${varieties.join(', ')}.\nPlease confirm my slot.`;
    return buildWhatsAppUrl(msg);
  }

  return (
    <main style={{ background: '#050f02', color: 'white', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="maas-hero">
        <div className="maas-hero-dots" />
        <div className="maas-hero-content container">
          <Link to="/products" className="maas-back">← Back to Mangoes</Link>
          <span className="maas-eyebrow">⚡ MaaS · Summer 2026 · Limited Slots</span>
          <h1 className="maas-title">Mango as a<br /><em>Service</em></h1>
          <p className="maas-sub">
            Every week through the season, a fresh box of rare, tree-ripened heritage mangoes arrives at your door —
            handpicked from our farms in Bobbili. Four deliveries. Four weeks.
          </p>
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
      <section className="maas-packs-section container">
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
            return (
              <div className={`maas-card${pass.featured ? ' featured' : ''}`} key={pass.id}>
                <div className="maas-card-badge" style={pass.badgeStyle}>{pass.badge}</div>
                <div className="maas-card-name">{pass.name}</div>
                <div className="maas-pool-label">{pass.pool}</div>
                <div className="maas-variety-chips">
                  {pass.varieties.map(v => <span className="maas-variety-chip" key={v}>{v}</span>)}
                </div>
                <div className="maas-pack-toggle">
                  <button className={`maas-pack-btn${pack === 12 ? ' active' : ''}`} onClick={() => setPack(12)}>12 pcs</button>
                  <button className={`maas-pack-btn${pack === 24 ? ' active' : ''}`} onClick={() => setPack(24)}>24 pcs</button>
                </div>
                <div className="maas-card-price">₹{PRICES[pack].toLocaleString('en-IN')}</div>
                <div className="maas-card-per">one-time · 4 weeks · free delivery</div>
                <ul className="maas-features">
                  {pass.features.map(f => <li key={f}><span className="maas-check">✓</span> {f}</li>)}
                </ul>
                <a
                  href={buildOrderUrl(pass.name, pack, pass.varieties)}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-maas"
                >
                  ⚡ Start {pass.name} — ₹{PRICES[pack].toLocaleString('en-IN')}
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
              <button className={`maas-pack-btn${customPack === 12 ? ' active' : ''}`} onClick={() => { setCustomPack(12); setCustomSelected([]); }}>12 pcs · Pick 3</button>
              <button className={`maas-pack-btn${customPack === 24 ? ' active' : ''}`} onClick={() => { setCustomPack(24); setCustomSelected([]); }}>24 pcs · Pick 5</button>
            </div>
            <div className="maas-custom-count">
              {customSelected.length < customLimit
                ? <>Select <strong>{customLimit - customSelected.length} more</strong> to continue</>
                : <><strong>{customLimit} varieties selected</strong> ✓</>}
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
            <div className="maas-card-price">₹{PRICES[customPack].toLocaleString('en-IN')}</div>
            <div className="maas-card-per">one-time · 4 weeks · free delivery</div>
            {customSelected.length === customLimit ? (
              <a
                href={buildOrderUrl('Customised Pass', customPack, customSelected)}
                target="_blank" rel="noopener noreferrer"
                className="btn-maas"
              >
                ⚡ Start Customised Pass — ₹{PRICES[customPack].toLocaleString('en-IN')}
              </a>
            ) : (
              <button className="btn-maas disabled" disabled>
                Select {customLimit} varieties first
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
