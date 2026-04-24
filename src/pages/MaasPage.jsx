import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../data/products';
import { API_BASE } from '../config.js';
import {
  isSeasonPassActive,
  SEASON_OVER_YEAR,
  SEASON_PASS_CUTOFF_LABEL,
  timeUntilCutoff,
} from '../data/season';

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

function DeadlineBanner() {
  // Refresh every minute so the live counter ticks down.
  const [left, setLeft] = useState(timeUntilCutoff());
  useEffect(() => {
    const id = setInterval(() => setLeft(timeUntilCutoff()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  if (!left) return null;
  return (
    <div className="maas-deadline">
      <span className="maas-deadline-dot" aria-hidden="true" />
      <span className="maas-deadline-label">Enrolment closes</span>
      <span className="maas-deadline-date">{SEASON_PASS_CUTOFF_LABEL}</span>
      <span className="maas-deadline-countdown">
        {left.days > 0 && <><strong>{left.days}</strong>d </>}
        <strong>{left.hours}</strong>h{' '}
        <strong>{left.minutes}</strong>m left
      </span>
    </div>
  );
}

function PremiumPopup({ pass, url, onClose }) {
  return (
    <div className="maas-popup-overlay" onClick={onClose}>
      <div className="maas-popup" onClick={e => e.stopPropagation()}>
        <div className="maas-popup-badge">✦ Exclusive</div>
        <h2 className="maas-popup-title">Your pass, <em>your way.</em></h2>
        <p className="maas-popup-body">
          Every MaaS subscription is built around <strong>you</strong>. On WhatsApp, our team will plan:
        </p>
        <ul className="maas-popup-list">
          <li><strong>How many</strong> mangoes a week — 6, 12, 24, or a number that fits your family</li>
          <li><strong>Which varieties</strong> and how much of each — more Imam Pasand, fewer Banganapalli, etc.</li>
          <li><strong>When</strong> each box arrives — the day and time-window that works for you</li>
        </ul>
        <p className="maas-popup-body" style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
          Message us now — a real person will connect with you in seconds.
        </p>
        <div className="maas-popup-detail">
          <span>🥭 {pass.name}</span>
          <span>⚡ Customisable</span>
          <span>📦 Hyderabad · Free delivery</span>
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
  const [slots, setSlots] = useState(null); // { total, claimed, available } | null

  // Fetch live slot counts so the scarcity bar reflects DB-backed numbers
  // set by the admin dashboard. Falls through silently if the API is down.
  useEffect(() => {
    fetch(API_BASE + '/api/season-pass/slots')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.total > 0) setSlots(data);
      })
      .catch(() => { /* leave slots null — scarcity section will hide */ });
  }, []);

  const customLimit = customPack === 12 ? 3 : 5;

  function toggleCustomVariety(v) {
    setCustomSelected(prev => {
      if (prev.includes(v)) return prev.filter(x => x !== v);
      if (prev.length >= customLimit) return prev;
      return [...prev, v];
    });
  }

  function buildOrderUrl(passName, pack, varieties) {
    const msg = `Hi! I'd like to join the *${passName}* (${pack} pcs/week × 4 weeks) — ₹${PRICES[pack].toLocaleString('en-IN')}.\nVarieties: ${varieties.join(', ')}.\nLooking forward to the season!`;
    return buildWhatsAppUrl(msg);
  }

  function handlePassClick(e, pass, pack, varieties) {
    e.preventDefault();
    setPopup({ pass, url: buildOrderUrl(pass.name, pack, varieties) });
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
            A fresh box of rare, tree-ripened heritage mangoes arrives at your door —
            handpicked from our farms in Bobbili. Pick a pass, and we'll shape the rest around you.
          </p>
          {isSeasonPassActive() && <DeadlineBanner />}
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

      {/* Season closed banner — replaces the packs section entirely when over. */}
      {!isSeasonPassActive() && (
        <section className="maas-closed container">
          <div className="maas-closed-card">
            <span className="maas-closed-eyebrow">⚡ Season {SEASON_OVER_YEAR} · Complete</span>
            <h2 className="maas-closed-title">The <em>Season Pass</em> is over for this year</h2>
            <p className="maas-closed-body">
              Enrolment closed on {SEASON_PASS_CUTOFF_LABEL}. Thank you to everyone who joined the
              {' '}{SEASON_OVER_YEAR} season — the orchard is resting, and we'll open the window again
              with next year's harvest.
            </p>
            <p className="maas-closed-body" style={{ marginTop: '0.5rem' }}>
              In the meantime, single varieties may still be available —
              {' '}<Link to="/products" style={{ color: '#F5A623', textDecoration: 'underline' }}>browse our mangoes →</Link>
            </p>
          </div>
        </section>
      )}

      {/* Packs */}
      {isSeasonPassActive() && (
      <section className="maas-packs-section container">
        <div className="maas-packs-head">
          <h2>Start with a <em>Pass</em></h2>
          <p>One payment. Free delivery across Hyderabad. Everything else — shaped around you.</p>
        </div>

        {slots && slots.total > 0 && (() => {
          const pct = Math.min(100, Math.round((slots.claimed / slots.total) * 100));
          const soldOut = slots.available === 0;
          return (
            <div className="maas-scarcity">
              <span>
                ⚡ {soldOut ? (
                  <><strong>All {slots.total} slots claimed</strong> for this season.</>
                ) : (
                  <>Only <strong>{slots.total} slots</strong> available this season.
                    {' '}<strong>{slots.claimed} claimed</strong> · {slots.available} left.</>
                )}
              </span>
              <div className="maas-scarcity-track">
                <div className="maas-scarcity-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })()}

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
                  href="#"
                  className="btn-maas"
                  onClick={e => handlePassClick(e, pass, pack, pass.varieties)}
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
                href="#"
                className="btn-maas"
                onClick={e => handlePassClick(e, { name: 'Customised Pass' }, customPack, customSelected)}
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
      )}
    </main>
  );
}
