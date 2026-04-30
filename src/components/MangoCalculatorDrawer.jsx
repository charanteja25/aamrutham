import React, { useState, useMemo, useEffect } from 'react';
import { products, buildWhatsAppUrl } from '../data/products';

const VARIETIES = products
  .filter(p => p.category === 'premium' || p.category === 'more')
  .map(p => ({ id: p.id, name: p.name, telugu: p.telugu }));

function Slider({ label, value, min, max, step = 1, unit, onChange, emoji }) {
  return (
    <div className="mcalc-slider-wrap">
      <div className="mcalc-slider-header">
        <span className="mcalc-slider-emoji">{emoji}</span>
        <span className="mcalc-slider-label" style={{ fontSize: '0.82rem' }}>{label}</span>
        <span className="mcalc-slider-value" style={{ fontSize: '0.9rem', minWidth: 'unset' }}>{value} {unit}</span>
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

function BulkForm({ total, onClose }) {
  const [name,     setName]     = useState('');
  const [selected, setSelected] = useState([]);
  const [errors,   setErrors]   = useState({});
  const [sent,     setSent]     = useState(false);

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function validate() {
    const e = {};
    if (!name.trim())     e.name    = 'Please enter your name.';
    if (!selected.length) e.variety = 'Select at least one variety.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSend() {
    if (!validate()) return;
    const varietyNames = selected.map(id => VARIETIES.find(v => v.id === id)?.name).join(', ');
    const msg = [
      `Hi Aamrutham! I need a bulk order of *${total} mangoes* 🥭`,
      ``,
      `*Name:* ${name.trim()}`,
      `*Variety / Varieties:* ${varietyNames}`,
      ``,
      `Please get in touch with me. Thank you!`,
    ].join('\n');
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mcalcd-bulk-sent">
        <div className="mcalcd-bulk-sent-icon">✅</div>
        <div className="mcalcd-bulk-sent-title">Enquiry sent!</div>
        <p className="mcalcd-bulk-sent-body">
          We've opened WhatsApp with your enquiry pre-filled. Our team will confirm details with you shortly.
        </p>
        <button className="mcalcd-rec-btn" onClick={onClose}>Done</button>
      </div>
    );
  }

  return (
    <div className="mcalcd-bulk-form">
      <div className="mcalcd-bulk-banner">
        <span className="mcalcd-bulk-banner-num">{total}</span>
        <div>
          <div className="mcalcd-bulk-banner-label">mangoes needed</div>
          <div className="mcalcd-bulk-banner-note">Our standard packs go up to 18 — let's plan this as a bulk order.</div>
        </div>
      </div>

      <div className="mcalcd-bulk-section">Which variety do you want?</div>
      {errors.variety && <p className="mcalcd-bulk-error">{errors.variety}</p>}
      <div className="mcalcd-bulk-chips">
        {VARIETIES.map(v => (
          <button
            key={v.id}
            type="button"
            className={`mcalcd-bulk-chip${selected.includes(v.id) ? ' selected' : ''}`}
            onClick={() => toggle(v.id)}
          >
            {selected.includes(v.id) && <span className="mcalcd-bulk-chip-check">✓ </span>}
            {v.name}
          </button>
        ))}
      </div>

      <div className="mcalcd-bulk-section" style={{ marginTop: '1rem' }}>Your details</div>
      <div className="mcalcd-bulk-fields">
        <div className="mcalcd-bulk-field">
          <label className="mcalcd-bulk-label">Name *</label>
          <input
            className={`mcalcd-bulk-input${errors.name ? ' mcalcd-bulk-input--err' : ''}`}
            type="text" placeholder="Your name"
            value={name} onChange={e => setName(e.target.value)}
          />
          {errors.name && <span className="mcalcd-bulk-error">{errors.name}</span>}
        </div>
      </div>

      <button className="mcalcd-bulk-wa-btn" onClick={handleSend}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.117 1.532 5.845L.054 23.486a.5.5 0 00.611.611l5.641-1.478A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-4.983-1.358l-.356-.213-3.688.966.983-3.595-.233-.37A9.795 9.795 0 012.182 12C2.182 6.569 6.569 2.182 12 2.182S21.818 6.569 21.818 12 17.431 21.818 12 21.818z"/>
        </svg>
        Send Bulk Enquiry on WhatsApp
      </button>
      <p className="mcalcd-footer-note">We'll confirm pricing and delivery on WhatsApp.</p>
    </div>
  );
}

export default function MangoCalculatorDrawer({ open, onClose, packPrices = [], onSelectPack }) {
  const [people, setPeople] = useState(2);
  const [perDay, setPerDay]  = useState(1);
  const [days,   setDays]    = useState(3);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const total = useMemo(() => Math.ceil(people * perDay * days), [people, perDay, days]);
  const isBulk = total > 18;

  const recommended = useMemo(() => {
    if (isBulk || !packPrices.length) return null;
    const packs = packPrices.map(p => ({ ...p, qty: parseInt(p.label) }));
    return packs.find(p => p.qty >= total) ?? packs[packs.length - 1];
  }, [total, isBulk, packPrices]);

  if (!open) return null;

  return (
    <>
      <div className="mcalcd-overlay" onClick={onClose} />
      <div className="mcalcd-drawer" role="dialog" aria-modal="true" aria-label="Mango Calculator">

        <div className="mcalcd-header">
          <div>
            <div className="mcalcd-eyebrow">🥭 Mango Calculator</div>
            <h2 className="mcalcd-title">How many do you need?</h2>
          </div>
          <button className="mcalcd-close" onClick={onClose} aria-label="Close calculator">✕</button>
        </div>

        <div className="mcalcd-body">
          <Slider emoji="👨‍👩‍👧‍👦" label="Mango lovers in your family" value={people} min={1} max={20} unit="people" onChange={setPeople} />
          <Slider emoji="🥭" label="Mangoes per person per day" value={perDay} min={1} max={8} step={1} unit="/day" onChange={setPerDay} />
          <Slider emoji="📅" label="How many days should they last?" value={days} min={1} max={7} unit="days" onChange={setDays} />

          {!isBulk && (
            <div className="mcalcd-total">
              <span className="mcalcd-total-label">You'll need approximately</span>
              <span className="mcalcd-total-num">{total}</span>
              <span className="mcalcd-total-unit">mangoes</span>
            </div>
          )}

          {!isBulk && recommended && (
            <div className="mcalcd-rec">
              <div className="mcalcd-rec-label">Best pack for you</div>
              <div className="mcalcd-rec-pack">{recommended.label}</div>
              <div className="mcalcd-rec-price">₹{recommended.price.toLocaleString('en-IN')} · incl. free delivery</div>
              <button
                className="mcalcd-rec-btn"
                onClick={() => { onSelectPack(recommended); onClose(); }}
              >
                Select {recommended.label} →
              </button>
            </div>
          )}

          {isBulk && <BulkForm total={total} onClose={onClose} />}

          {!isBulk && (
            <p className="mcalcd-footer-note">Numbers are approximate — adjust to your taste.</p>
          )}
        </div>
      </div>
    </>
  );
}
