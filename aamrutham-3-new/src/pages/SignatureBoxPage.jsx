import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PACKS = [
  { label: '12 pcs', price: 1999 },
  { label: '24 pcs', price: 3499 },
];

const VARIETIES = [
  { name: 'Kothapalli Kobbari', note: 'The Coconut Mango — fiberless, with a faint coconut undertone' },
  { name: 'Panduri Teepi Mamidi', note: 'The Village Heirloom — buttery, aromatic, nearly unknown outside Panduri' },
  { name: 'Bobbili Peechu', note: 'The Pride of Bobbili — fibrous, intensely sweet, best squeezed whole' },
  { name: 'Imam Pasand', note: 'The Royal Mango — saffron-hued, zero-fibre, creamy, Deccan royalty' },
];

const SIGBOX_PRODUCT = {
  id: 'signature-box',
  name: 'Aamrutham Signature Box',
};

export default function SignatureBoxPage() {
  const { addToCart, setIsOpen } = useCart();
  const [packIdx, setPackIdx] = useState(0);
  const [giftEnabled, setGiftEnabled] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const pack = PACKS[packIdx];

  function handleOrder() {
    const meta = giftEnabled && recipientName
      ? { gift: true, recipientName, recipientPhone, giftMessage }
      : undefined;
    addToCart(SIGBOX_PRODUCT, pack.label, pack.price, null, false, meta);
    setIsOpen(true);
  }

  return (
    <main style={{ background: '#0f0500', color: 'white', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="sigbox-hero">
        <div className="sigbox-hero-dots" />
        <div className="sigbox-hero-content container">
          <Link to="/products" className="sigbox-back">← Back to Mangoes</Link>
          <span className="sigbox-eyebrow">✦ Gift Edition · Summer 2026 · Limited Availability</span>
          <h1 className="sigbox-title">Aamrutham<br /><em>Signature Box</em></h1>
          <p className="sigbox-sub">
            Four of our most prized heritage varieties, curated into one gift-worthy box.
            Each mango tells a story centuries in the making. The perfect introduction to Bobbili's finest.
          </p>
        </div>
      </section>

      {/* What's Inside */}
      <section className="sigbox-contents container">
        <span className="sigbox-contents-label">✦ What's Inside the Box</span>
        <div className="sigbox-variety-grid">
          {VARIETIES.map(v => (
            <div className="sigbox-variety" key={v.name}>
              <span className="sigbox-variety-icon">🥭</span>
              <div className="sigbox-variety-name">{v.name}</div>
              <div className="sigbox-variety-note">{v.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Order */}
      <section className="sigbox-order container">
        <div className="sigbox-order-head">
          <h2>Order Your <em>Signature Box</em></h2>
          <p>Choose your pack size. Add a gift message. We'll take care of the rest.</p>
        </div>

        <span className="sigbox-pack-label">Choose Pack Size</span>
        <div className="sigbox-pack-pills">
          {PACKS.map((p, i) => (
            <button
              key={i}
              className={`sigbox-pack-pill${packIdx === i ? ' active' : ''}`}
              onClick={() => setPackIdx(i)}
            >
              {p.label} — ₹{p.price.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        {/* Gift Toggle */}
        <div className="sigbox-gift-row">
          <label className="sigbox-toggle-sw">
            <input type="checkbox" checked={giftEnabled} onChange={e => setGiftEnabled(e.target.checked)} />
            <span className="sigbox-toggle-track" />
          </label>
          <span className="sigbox-gift-label">🎁 Add a gift message & recipient details</span>
        </div>

        {giftEnabled && (
          <div className="sigbox-gift-panel">
            <div className="sigbox-gift-field">
              <span className="sigbox-gift-field-label">Recipient Name</span>
              <input
                className="sigbox-gift-input"
                type="text"
                placeholder="Who is this for?"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
            </div>
            <div className="sigbox-gift-field">
              <span className="sigbox-gift-field-label">Recipient WhatsApp</span>
              <div className="sigbox-phone-wrap">
                <span className="sigbox-prefix">🇮🇳 +91</span>
                <input
                  className="sigbox-gift-input"
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="sigbox-gift-field">
              <span className="sigbox-gift-field-label">Gift Message <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></span>
              <textarea
                className="sigbox-gift-textarea"
                maxLength={200}
                placeholder="Write a personal note to go with the mangoes…"
                value={giftMessage}
                onChange={e => setGiftMessage(e.target.value)}
              />
              <div className="sigbox-char-count">{giftMessage.length} / 200</div>
            </div>
          </div>
        )}

        <button className="btn-sigbox" onClick={handleOrder}>
          🛍 Order Signature Box — ₹{pack.price.toLocaleString('en-IN')}
        </button>
      </section>
    </main>
  );
}
