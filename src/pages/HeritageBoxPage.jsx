import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PACKS = [
  { label: '12 pcs — Signature Box', price: 1999 },
  { label: '24 pcs — Signature Box (Large)', price: 3499 },
];

const BOX_VARIETIES = [
  { name: 'Kothapalli Kobbari', note: 'The Coconut Mango — fiberless, with a faint coconut undertone' },
  { name: 'Panduri Teepi Mamidi', note: 'The Village Heirloom — buttery, aromatic, nearly unknown outside Panduri' },
  { name: 'Bobbili Peechu', note: 'The Pride of Bobbili — fibrous, intensely sweet, best squeezed whole' },
  { name: 'Imam Pasand', note: 'The Royal Mango — saffron-hued, zero-fibre, creamy, Deccan royalty' },
];

export default function HeritageBoxPage() {
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState(0);
  const [isGift, setIsGift] = useState(false);
  const [giftName, setGiftName]     = useState('');
  const [giftPhone, setGiftPhone]   = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const pack = PACKS[selectedPack];

  const handleAdd = () => {
    addToCart(
      { id: 'heritage-box', name: 'Aamrutham Signature Box' },
      pack.label,
      pack.price,
      null, true
    );
    if (isGift) {
      localStorage.setItem('aamrutham_gift', JSON.stringify({
        recipientName:  giftName.trim(),
        recipientPhone: giftPhone.trim(),
        message:        giftMessage.trim(),
      }));
    } else {
      localStorage.removeItem('aamrutham_gift');
    }
  };

  return (
    <main className="hb-page">

      {/* Hero */}
      <div className="hb-hero">
        <div className="hb-hero-dots" />
        <div className="hb-hero-content">
          <Link to="/products" className="hb-back">← Back to Mangoes</Link>
          <span className="hb-eyebrow">✦ Gift Edition · Summer 2026 · Limited Availability</span>
          <h1 className="hb-title">Aamrutham<br /><em>Signature Box</em></h1>
          <p className="hb-sub">Four of our most prized heritage varieties, curated into one gift-worthy box. Each mango tells a story centuries in the making. The perfect introduction to Bobbili's finest.</p>
        </div>
      </div>

      {/* What's Inside */}
      <div className="hb-contents">
        <div className="hb-contents-inner" data-aos="fade-up">
          <span className="hb-contents-label">✦ What's Inside the Box</span>
          <div className="hb-variety-grid">
            {BOX_VARIETIES.map((v) => (
              <div key={v.name} className="hb-variety">
                <span className="hb-variety-icon">🥭</span>
                <div className="hb-variety-name">{v.name}</div>
                <div className="hb-variety-note">{v.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order */}
      <div className="hb-order-section">
        <div className="hb-order-inner" data-aos="fade-up">
          <div className="hb-order-head">
            <h2>Order Your <em>Signature Box</em></h2>
            <p>Choose your pack size. Add a gift message. We'll take care of the rest.</p>
          </div>

          <span className="hb-pack-label">Choose Pack Size</span>
          <div className="hb-pack-pills">
            {PACKS.map((p, i) => (
              <button
                key={p.label}
                className={`hb-pack-pill ${selectedPack === i ? 'active' : ''}`}
                onClick={() => setSelectedPack(i)}
              >
                {i === 0 ? '12 pcs' : '24 pcs'} — ₹{p.price.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Gift Toggle */}
          <div className="gift-toggle-row">
            <label className="toggle-sw">
              <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <span className="gift-toggle-label">🎁 Add a gift message &amp; recipient details</span>
          </div>

          {/* Gift Form */}
          {isGift && (
            <div className="gift-form-panel open">
              <div className="gift-field">
                <span className="gift-field-label">Recipient Name</span>
                <input
                  className="gift-input"
                  type="text"
                  placeholder="Who is this for?"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                />
              </div>
              <div className="gift-field">
                <span className="gift-field-label">Recipient WhatsApp</span>
                <div className="gift-phone-wrap">
                  <span className="gift-prefix">🇮🇳 +91</span>
                  <input
                    className="gift-input"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={giftPhone}
                    onChange={(e) => setGiftPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>
              <div className="gift-field">
                <span className="gift-field-label">Gift Message <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
                <textarea
                  className="gift-textarea"
                  maxLength={200}
                  placeholder="Write a personal note to go with the mangoes…"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
                <div className="gift-char-count">{giftMessage.length} / 200</div>
              </div>
            </div>
          )}

          <button className="btn-hb-add" onClick={handleAdd}>
            🛍 Add to Cart — ₹{pack.price.toLocaleString('en-IN')}
          </button>
        </div>
      </div>

    </main>
  );
}
