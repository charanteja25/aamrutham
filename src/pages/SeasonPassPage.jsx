import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PRICES = { 12: 2499, 24: 4499 };

const VARIETIES_ALL = [
  'Kothapalli Kobbari', 'Imam Pasand', 'Panduri Teepi Mamidi',
  'Mettavalasa Peechu', 'Bobbili Peechu', 'Banganapalli',
  'Suvarnarekha', 'Chinna Rasalu', 'Cheruku Rasalu', 'Panchadara Kalasa',
];

const TICKER_ITEMS = [
  'METTAVALASA PEECHU', '·', 'IMAM PASAND', '·', 'KOTHAPALLI KOBBARI', '·',
  'BOBBILI PEECHU', '·', 'SUVARNAREKHA', '·', 'CHINNA RASALU', '·',
  'BANGANAPALLI', '·', 'PANDURI TEEPI MAMIDI', '·',
];

const PREMIUM_VARIETIES = ['Kothapalli Kobbari', 'Imam Pasand', 'Panduri Teepi Mamidi', 'Mettavalasa Peechu', 'Bobbili Peechu'];
const EXOTIC_VARIETIES  = ['Banganapalli', 'Suvarnarekha', 'Chinna Rasalu', 'Pedda Rasalu', 'Cheruku Rasalu', 'Panchadara Kalasa'];

function PackToggle({ value, onChange }) {
  return (
    <div className="sp-pack-toggle">
      <button className={`sp-pack-btn ${value === 12 ? 'active' : ''}`} onClick={() => onChange(12)}>12 pcs</button>
      <button className={`sp-pack-btn ${value === 24 ? 'active' : ''}`} onClick={() => onChange(24)}>24 pcs</button>
    </div>
  );
}

function CustomSelector({ pack, selected, onToggle }) {
  const limit = pack === 12 ? 3 : 5;
  const remaining = limit - selected.length;
  const done = remaining === 0;

  return (
    <div className="sp-custom-selector">
      <div className="sp-custom-count">
        {done
          ? <strong style={{ color: 'var(--mango)' }}>✓ {selected.length} varieties selected</strong>
          : <>Select <strong>{remaining} more variet{remaining === 1 ? 'y' : 'ies'}</strong></>
        }
      </div>
      <div className="sp-custom-varieties">
        {VARIETIES_ALL.map((v) => {
          const isSel = selected.includes(v);
          const isDisabled = !isSel && selected.length >= limit;
          return (
            <div
              key={v}
              className={`sp-custom-var${isSel ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
              onClick={() => !isDisabled && onToggle(v)}
            >
              <div className="sp-custom-var-check">
                {isSel && <span style={{ fontSize: '0.5rem' }}>✓</span>}
              </div>
              <span className="sp-custom-var-name">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SeasonPassPage() {
  const { addToCart } = useCart();
  const [premiumPack, setPremiumPack] = useState(12);
  const [exoticPack, setExoticPack]   = useState(12);
  const [customPack, setCustomPack]   = useState(12);
  const [customSelected, setCustomSelected] = useState([]);

  useEffect(() => {
    setCustomSelected([]);
  }, [customPack]);

  const toggleCustomVariety = (v) => {
    setCustomSelected((prev) => {
      const limit = customPack === 12 ? 3 : 5;
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (prev.length >= limit) return prev;
      return [...prev, v];
    });
  };

  const handleAddPremium = () => {
    addToCart(
      { id: `season-premium-${premiumPack}`, name: 'Premium Pass' },
      `${premiumPack} pcs/drop × 4 drops`,
      PRICES[premiumPack],
      null, true
    );
  };

  const handleAddExotic = () => {
    addToCart(
      { id: `season-exotic-${exoticPack}`, name: 'Exotic Pass' },
      `${exoticPack} pcs/drop × 4 drops`,
      PRICES[exoticPack],
      null, true
    );
  };

  const handleAddCustom = () => {
    const limit = customPack === 12 ? 3 : 5;
    if (customSelected.length < limit) return;
    const packLabel = `${customPack} pcs · ${customSelected.join(', ')}`;
    addToCart(
      { id: `season-custom-${customPack}`, name: 'Customised Pass' },
      packLabel,
      PRICES[customPack],
      null, true
    );
  };

  const customLimit = customPack === 12 ? 3 : 5;
  const customReady = customSelected.length >= customLimit;

  return (
    <main className="sp-page">

      {/* Hero */}
      <div className="sp-hero">
        <div className="sp-hero-dots" />
        <div className="sp-hero-content">
          <Link to="/products" className="sp-back">← Back to Mangoes</Link>
          <span className="sp-eyebrow">⚡ MaaS · Summer 2026 · Limited Slots</span>
          <h1 className="sp-title">Mango as a<br /><em>Service</em></h1>
          <p className="sp-sub">Every week through the season, a fresh box of rare, tree-ripened heritage mangoes arrives at your door — handpicked from our farms in Bobbili. Four deliveries. Four weeks.</p>
        </div>
      </div>

      {/* Ticker */}
      <div className="sp-ticker">
        <div className="sp-ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="sp-packs-section">
        <div className="sp-packs-inner">
          <div className="sp-packs-head" data-aos="fade-up">
            <h2>Pick Your <em>Pass</em></h2>
            <p>One payment. Four drops. Free across Hyderabad.</p>
          </div>

          <div className="sp-scarcity" data-aos="fade-up">
            <span className="sp-scarcity-label">⚡ Only <strong>18 slots</strong> available this season. <strong>11 claimed.</strong></span>
            <div className="sp-scarcity-track"><div className="sp-scarcity-fill" /></div>
          </div>

          <div className="sp-cards" data-aos="fade-up" data-aos-delay="100">

            {/* Premium Pass */}
            <div className="sp-card">
              <div className="sp-card-badge" style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--mango)', border: '1px solid rgba(245,166,35,0.35)' }}>Premium</div>
              <div className="sp-card-name">Premium Pass</div>
              <div className="sp-pool-label">Any 3 varieties per drop, based on availability</div>
              <div className="sp-variety-chips">
                {PREMIUM_VARIETIES.map((v) => <span key={v} className="sp-variety-chip">{v}</span>)}
              </div>
              <PackToggle value={premiumPack} onChange={setPremiumPack} />
              <div className="sp-card-price">₹{PRICES[premiumPack].toLocaleString('en-IN')}</div>
              <div className="sp-card-per">one-time · 4 drops · free delivery</div>
              <ul className="sp-features">
                <li><span className="sp-check">✓</span> Rarest, most sought-after varieties</li>
                <li><span className="sp-check">✓</span> 3 varieties rotating across 4 drops</li>
                <li><span className="sp-check">✓</span> WhatsApp ping before each delivery</li>
                <li><span className="sp-check">✓</span> Free delivery across Hyderabad</li>
              </ul>
              <button className="btn-sp-add" onClick={handleAddPremium}>
                ⚡ Start Premium Pass — ₹{PRICES[premiumPack].toLocaleString('en-IN')}
              </button>
            </div>

            {/* Exotic Pass */}
            <div className="sp-card featured">
              <div className="sp-card-badge">Most Popular</div>
              <div className="sp-card-name">Exotic Pass</div>
              <div className="sp-pool-label">Any 3 varieties per drop, based on availability</div>
              <div className="sp-variety-chips">
                {EXOTIC_VARIETIES.map((v) => <span key={v} className="sp-variety-chip">{v}</span>)}
              </div>
              <PackToggle value={exoticPack} onChange={setExoticPack} />
              <div className="sp-card-price">₹{PRICES[exoticPack].toLocaleString('en-IN')}</div>
              <div className="sp-card-per">one-time · 4 drops · free delivery</div>
              <ul className="sp-features">
                <li><span className="sp-check">✓</span> Golden classics &amp; rare sweet varieties</li>
                <li><span className="sp-check">✓</span> 3 varieties rotating across 4 drops</li>
                <li><span className="sp-check">✓</span> WhatsApp ping before each delivery</li>
                <li><span className="sp-check">✓</span> Free delivery across Hyderabad</li>
              </ul>
              <button className="btn-sp-add" onClick={handleAddExotic}>
                ⚡ Start Exotic Pass — ₹{PRICES[exoticPack].toLocaleString('en-IN')}
              </button>
            </div>

            {/* Customised Pass */}
            <div className="sp-card">
              <div className="sp-card-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }}>Your Choice</div>
              <div className="sp-card-name">Customised Pass</div>
              <div className="sp-pool-label">You pick the varieties. We deliver them.</div>
              <div className="sp-pack-toggle">
                <button className={`sp-pack-btn ${customPack === 12 ? 'active' : ''}`} onClick={() => setCustomPack(12)}>12 pcs · Pick 3</button>
                <button className={`sp-pack-btn ${customPack === 24 ? 'active' : ''}`} onClick={() => setCustomPack(24)}>24 pcs · Pick 5</button>
              </div>
              <CustomSelector pack={customPack} selected={customSelected} onToggle={toggleCustomVariety} />
              <div className="sp-card-price">₹{PRICES[customPack].toLocaleString('en-IN')}</div>
              <div className="sp-card-per">one-time · 4 drops · free delivery</div>
              <button className="btn-sp-add" onClick={handleAddCustom} disabled={!customReady}>
                ⚡ {customReady ? `Start Customised Pass — ₹${PRICES[customPack].toLocaleString('en-IN')}` : `Select ${customLimit} varieties first`}
              </button>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}
