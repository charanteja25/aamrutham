import React, { useState, useMemo } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';

const PACK_OPTIONS = [
  { label: '6 pcs',  min: 1,  max: 6,  price: 499,  badge: null,         color: '#f5c842', bg: '#fff9e0' },
  { label: '12 pcs', min: 7,  max: 12, price: 950,  badge: 'Our Pick',   color: '#2d5016', bg: '#eaf3de' },
  { label: '18 pcs', min: 13, max: 18, price: 1300, badge: 'Best Value', color: '#e07b39', bg: '#fff0e0' },
];

function Slider({ label, value, min, max, step = 1, unit, onChange, emoji }) {
  return (
    <div className="mcalc-slider-wrap">
      <div className="mcalc-slider-header">
        <span className="mcalc-slider-emoji">{emoji}</span>
        <span className="mcalc-slider-label">{label}</span>
        <span className="mcalc-slider-value">{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        className="mcalc-slider"
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="mcalc-slider-ticks">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function MangoCalculatorPage() {
  const [people, setPeople] = useState(4);
  const [perDay, setPerDay]  = useState(1);
  const [days,   setDays]    = useState(3);

  const total = useMemo(() => Math.ceil(people * perDay * days), [people, perDay, days]);

  const recommendation = useMemo(() => {
    if (total <= 6)  return { ...PACK_OPTIONS[0], qty: 1 };
    if (total <= 12) return { ...PACK_OPTIONS[1], qty: 1 };
    if (total <= 18) return { ...PACK_OPTIONS[2], qty: 1 };
    // For larger quantities, suggest multiple packs of 18 or bulk
    const packs18 = Math.ceil(total / 18);
    return { bulk: true, packs18, total };
  }, [total]);
  usePageMeta({ title: 'Mango Calculator — Aamrutham', description: 'Not sure how many mangoes to order? Use our calculator to find the right pack size for your family.' });


  return (
    <main>
      {/* Hero */}
      <section className="mcalc-hero">
        <div className="mcalc-hero-dots" aria-hidden="true" />
        <div className="container mcalc-hero-inner">
          <span className="mcalc-eyebrow">🥭 Smart Mango Planning</span>
          <h1 className="mcalc-title">Mango <em>Calculator</em></h1>
          <p className="mcalc-sub">
            Tell us about your family and we'll tell you exactly how many mangoes to order.
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container mcalc-layout">

          {/* ── Inputs ── */}
          <div className="mcalc-inputs-card">
            <div className="mcalc-inputs-label">Your Details</div>

            <Slider
              emoji="👨‍👩‍👧‍👦" label="Mango lovers in your family"
              value={people} min={1} max={20} unit="people"
              onChange={setPeople}
            />
            <Slider
              emoji="🥭" label="Mangoes per person per day"
              value={perDay} min={1} max={8} step={1} unit="mangoes/day"
              onChange={setPerDay}
            />
            <Slider
              emoji="📅" label="How many days do you want your mangoes to last?"
              value={days} min={1} max={7} unit="days"
              onChange={setDays}
            />

            {/* Calculation breakdown */}
            <div className="mcalc-formula">
              <div className="mcalc-formula-row">
                <span>{people} people</span>
                <span className="mcalc-formula-op">×</span>
                <span>{perDay} /day</span>
                <span className="mcalc-formula-op">×</span>
                <span>{days} days</span>
                <span className="mcalc-formula-op">=</span>
                <span className="mcalc-formula-result">{total} mangoes</span>
              </div>
            </div>
          </div>

          {/* ── Result ── */}
          <div className="mcalc-result-col">
            <div className="mcalc-total-card">
              <div className="mcalc-total-label">You need approximately</div>
              <div className="mcalc-total-num">{total}</div>
              <div className="mcalc-total-unit">mangoes</div>
            </div>

            {!recommendation.bulk ? (
              <div className="mcalc-pack-card" style={{ background: recommendation.bg, borderColor: recommendation.color }}>
                {recommendation.badge && (
                  <span className="mcalc-pack-badge" style={{ background: recommendation.color }}>
                    {recommendation.badge}
                  </span>
                )}
                <div className="mcalc-pack-icon">📦</div>
                <div className="mcalc-pack-title" style={{ color: recommendation.color }}>
                  We recommend
                </div>
                <div className="mcalc-pack-label">{recommendation.label}</div>
                <div className="mcalc-pack-covers">
                  Covers {recommendation.max >= total ? `your exact need of ${total}` : `up to ${recommendation.max}`} mangoes
                </div>
                <div className="mcalc-pack-price">
                  Starting from <strong>₹{recommendation.price.toLocaleString('en-IN')}</strong>
                </div>
                <Link to="/products" className="mcalc-cta-btn mcalc-cta-btn--primary">
                  Shop {recommendation.label} Packs →
                </Link>
                <div className="mcalc-or">or</div>
                <Link to="/products" className="mcalc-cta-btn mcalc-cta-btn--outline">
                  Browse All Varieties
                </Link>
              </div>
            ) : (
              <div className="mcalc-pack-card mcalc-pack-card--bulk">
                <div className="mcalc-pack-icon">🚚</div>
                <div className="mcalc-pack-title">You need a bulk order</div>
                <div className="mcalc-pack-label">{total} mangoes</div>
                <div className="mcalc-pack-covers">
                  That's about {recommendation.packs18} × Pack of 18 — perfect for a bulk enquiry
                </div>
                <Link to="/bulk-enquiry" className="mcalc-cta-btn mcalc-cta-btn--primary mcalc-cta-btn--wa">
                  Send Bulk Enquiry →
                </Link>
                <div className="mcalc-or">or</div>
                <Link to="/products" className="mcalc-cta-btn mcalc-cta-btn--outline">
                  Browse Varieties First
                </Link>
              </div>
            )}

            {/* All pack options */}
            <div className="mcalc-all-packs">
              <div className="mcalc-all-packs-label">All pack sizes</div>
              <div className="mcalc-pack-row">
                {PACK_OPTIONS.map(p => (
                  <div
                    key={p.label}
                    className={`mcalc-mini-pack${total >= p.min && total <= p.max ? ' mcalc-mini-pack--active' : ''}`}
                    style={ total >= p.min && total <= p.max ? { borderColor: p.color, background: p.bg } : {} }
                  >
                    <span className="mcalc-mini-label">{p.label}</span>
                    {p.badge && <span className="mcalc-mini-badge" style={{ color: p.color }}>{p.badge}</span>}
                    <span className="mcalc-mini-price">₹{p.price.toLocaleString('en-IN')}+</span>
                  </div>
                ))}
                <div
                  className={`mcalc-mini-pack${total > 18 ? ' mcalc-mini-pack--active mcalc-mini-pack--bulk' : ''}`}
                >
                  <span className="mcalc-mini-label">19+ pcs</span>
                  <span className="mcalc-mini-badge" style={{ color: '#1a5c35' }}>Bulk</span>
                  <span className="mcalc-mini-price">Custom</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
