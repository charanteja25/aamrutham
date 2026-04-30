import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { products, buildWhatsAppUrl } from '../data/products';
import { isSeasonPassActive } from '../data/season';
import VarietyCarousel from '../components/VarietyCarousel';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

function packWeight(avgWeightGrams, label) {
  const qty = parseInt(label);
  if (!avgWeightGrams || !qty) return null;
  const [min, max] = avgWeightGrams;
  const minKg = (qty * min / 1000).toFixed(1);
  const maxKg = (qty * max / 1000).toFixed(1);
  return min === max ? `~${minKg} kgs` : `~${minKg}–${maxKg} kgs`;
}

function strikePrice(packPrices, selectedPack) {
  const sixPack = packPrices.find(p => p.label === '6 pcs');
  if (!sixPack) return selectedPack.price + 101;
  const sixOriginal = sixPack.price + 101;
  const qty = parseInt(selectedPack.label);
  return sixOriginal * (qty / 6);
}

function savePercent(packPrices, pack) {
  const sixPack = packPrices.find(p => p.label === '6 pcs');
  if (!sixPack || pack.label === '6 pcs') return null;
  const basePerUnit = sixPack.price / 6;
  const qty = parseInt(pack.label);
  const packPerUnit = pack.price / qty;
  const pct = Math.round((basePerUnit - packPerUnit) / basePerUnit * 100);
  return pct > 0 ? pct : null;
}

function VarietyTile({ product }) {
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();

  // Once inventory loads, if the default-selected pack has 0 stock, switch to
  // the first pack that's actually in stock so the UI doesn't misleadingly
  // show "Coming Soon" for an entire product that has other packs available.
  useEffect(() => {
    const current = getAvailable(product.id, selectedPack.label);
    if (current === null) return;      // inventory still loading
    if (current > 0) return;           // already on a good pack
    const firstAvail = product.packPrices.find(
      (p) => (getAvailable(product.id, p.label) ?? 0) > 0
    );
    if (firstAvail && firstAvail.label !== selectedPack.label) {
      setSelectedPack(firstAvail);
    }
  }, [getAvailable, product, selectedPack.label]);

  const available = getAvailable(product.id, selectedPack.label);
  const isSoldOut = available === 0;
  const isSignature = product.category === 'premium';
  return (
    <div className="variety-tile">
      <Link to={`/products/${product.id}`} className="variety-tile-img" data-product={product.id} style={{ background: product.gradient }}>
        <img
          src={`/assets/varieties/${product.id}.jpg`}
          alt={product.name}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <span className={`variety-tile-badge ${isSignature ? 'badge-signature' : 'badge-heritage'}`}>
          {isSignature ? 'Signature' : 'Exotic'}
        </span>
        {isSoldOut && <span className="variety-tile-soldout">Coming Soon</span>}
      </Link>
      <div className="variety-tile-body">
        <Link to={`/products/${product.id}`} className="variety-tile-name">{product.name}</Link>
        <div className="variety-tile-telugu">{product.telugu} · {product.meaning}</div>
        <div className="variety-tile-eat-tags">
          {product.badges?.find(b => b.startsWith('Brix')) && (
            <span className="variety-eat-tag variety-eat-tag--brix">
              🍬 {product.badges.find(b => b.startsWith('Brix'))}
            </span>
          )}
          {product.eatType?.map(tag => (
            <span key={tag} className={`variety-eat-tag variety-eat-tag--${tag.toLowerCase().replace(/[^a-z]/g, '-')}`}>{tag}</span>
          ))}
        </div>
        <p className="variety-tile-intro">{product.description}</p>
        <Link to={`/products/${product.id}`} className="variety-tile-more">View more for details →</Link>
      </div>
      <div className="variety-tile-footer">
        <div className="variety-tile-pack-row">
          {product.packPrices.map(p => {
            const packAvail = getAvailable(product.id, p.label);
            const packOut = packAvail === 0;
            return (
              <button
                key={p.label}
                className={`variety-tile-pack-btn${selectedPack.label === p.label ? ' active' : ''}${packOut ? ' out' : ''}${p.label === '12 pcs' ? ' most-bought' : ''}`}
                onClick={() => !packOut && setSelectedPack(p)}
                title={packOut ? 'Out of stock' : undefined}
              >
                {p.label === '12 pcs' && <span className="pack-most-bought-badge">Our Pick</span>}
                {p.label === '18 pcs' && <span className="pack-most-bought-badge pack-best-value-badge">Best Value</span>}
                {p.label}
                {packWeight(product.avgWeightGrams, p.label) && (
                  <span style={{ color: 'var(--mango-dark)', fontWeight: 700, fontSize: '0.78rem' }}>
                    {' '}({packWeight(product.avgWeightGrams, p.label)})
                  </span>
                )}
                {packOut && ' ✕'}
              </button>
            );
          })}
        </div>
        <div className="variety-tile-footer-row">
          <div>
            <span className="variety-tile-price">
              <span style={{ textDecoration: 'line-through', color: '#aaa', fontWeight: 400, fontSize: '0.95rem', marginRight: '0.3rem' }}>
                ₹{strikePrice(product.packPrices, selectedPack).toLocaleString('en-IN')}
              </span>
              ₹{selectedPack.price.toLocaleString('en-IN')}
              {savePercent(product.packPrices, selectedPack) > 0 && (
                <span className="tile-save-pct">Save {savePercent(product.packPrices, selectedPack)}%</span>
              )}
            </span>
            <Link to="/pricing" className="pricing-link">ℹ️ Why this price?</Link>
          </div>
          {isSoldOut ? (
            <span className="sold-out-chip">Coming Soon</span>
          ) : (
            <button
              className="variety-tile-cart-btn"
              onClick={() => addToCart(product, selectedPack.label, selectedPack.price, null, null, true)}
            >Add to cart</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SeasonPassTile() {
  return (
    <Link to="/maas" className="variety-tile season-pass-tile">
      <div className="season-pass-tile-glow" aria-hidden="true" />
      <div className="season-pass-tile-inner">
        <span className="season-pass-tile-eyebrow">⚡ Season Pass</span>
        <h3 className="season-pass-tile-title">Try them <em>all</em></h3>
        <p className="season-pass-tile-copy">
          Four weeks. One payment. Rare heritage varieties delivered fresh every week, curated by our team.
        </p>
        <span className="season-pass-tile-cta">Explore Season Pass →</span>
      </div>
    </Link>
  );
}

function CalcStrip() {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(2);
  const [perDay, setPerDay]  = useState(1);
  const [days,   setDays]    = useState(3);
  const total = useMemo(() => Math.ceil(people * perDay * days), [people, perDay, days]);

  return (
    <div className="calc-strip">
      <button className="calc-strip-toggle" onClick={() => setOpen(o => !o)}>
        <span>🥭 Not sure how many mangoes to order?</span>
        <span className="calc-strip-cta">{open ? 'Close ▲' : 'Use the calculator ▼'}</span>
      </button>
      {open && (
        <div className="calc-strip-body">
          <div className="calc-strip-sliders">
            {[
              { emoji: '👨‍👩‍👧‍👦', label: 'Mango lovers in your family', value: people, min: 1, max: 20, step: 1, unit: 'people', set: setPeople },
              { emoji: '🥭', label: 'Mangoes per person per day', value: perDay, min: 1, max: 8, step: 1, unit: '/day', set: setPerDay },
              { emoji: '📅', label: 'Days to last', value: days, min: 1, max: 7, step: 1, unit: 'days', set: setDays },
            ].map(s => (
              <div key={s.label} className="mcalc-slider-wrap">
                <div className="mcalc-slider-header">
                  <span className="mcalc-slider-emoji">{s.emoji}</span>
                  <span className="mcalc-slider-label" style={{ fontSize: '0.82rem' }}>{s.label}</span>
                  <span className="mcalc-slider-value" style={{ fontSize: '0.9rem', minWidth: 'unset' }}>{s.value} {s.unit}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  className="mcalc-slider" onChange={e => s.set(Number(e.target.value))} />
                <div className="mcalc-slider-ticks"><span>{s.min}</span><span>{s.max}</span></div>
              </div>
            ))}
          </div>
          <div className="calc-strip-result">
            <span className="calc-strip-result-num">{total}</span>
            <span className="calc-strip-result-label">mangoes — scroll down to find your pack</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const varieties = products.filter(p => p.category === 'premium' || p.category === 'more');

  return (
    <main>
      <div className="products-mini-hero">
        <p className="section-eyebrow gold">✦ Bobbili Farms · Hyderabad ✦</p>
        <h1>Our Mangoes, <em>Your Summer</em></h1>
        <p className="products-mini-sub">Naturally ripened · Pesticide-free · Bobbili farms</p>
      </div>

      <div className="products-strip">
        <span className="products-strip-title">Our Mangoes</span>
        <div className="products-strip-ticker">
          <div className="products-strip-ticker-inner">
            {[...varieties, ...varieties].map((p, i) => (
              <span key={i}>{p.name} <span className="products-strip-dot">·</span> </span>
            ))}
          </div>
        </div>
      </div>

      <VarietyCarousel />

      <section className="delivery-strip">
        <div>Hyderabad delivery</div>
        <div>Zero pesticides</div>
        <div>Summer 2026</div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div data-aos="fade-up">
            <span className="section-eyebrow">✦ Farm to Doorstep</span>
            <h2 className="section-title">Our <em>Varieties</em></h2>
            <p className="section-subtitle">Heritage varieties from our farm in Bobbili.</p>
          </div>

          <CalcStrip />

          <div className="variety-tiles-grid">
            {varieties.map(product => <VarietyTile key={product.id} product={product} />)}
            {isSeasonPassActive() && <SeasonPassTile />}
          </div>

          <div className="bulk-contextual-strip">
            <div className="bulk-contextual-left">
              <span className="bulk-contextual-title">Ordering for an office, event, or large family?</span>
              <span className="bulk-contextual-sub">Our standard packs go up to 18 — for anything more, let's plan it together.</span>
            </div>
            <Link to="/bulk-enquiry" className="bulk-contextual-cta">Send a Bulk Enquiry →</Link>
          </div>
        </div>
      </section>

      <section className="section feedback-section">
        <div className="container center narrow">
          <p className="section-eyebrow">✦ Help Us Grow</p>
          <h2 className="section-title">Share Your Feedback</h2>
          <p className="section-subtitle">
            Tried our mangoes or curious about a variety? Tell us what you think and help shape the next season.
          </p>
          <a
            className="btn btn-leaf"
            href={buildWhatsAppUrl('Hi! I tried your mangoes and wanted to share some feedback.')}
            target="_blank"
            rel="noreferrer"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
