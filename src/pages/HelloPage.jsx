import React, { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { API_BASE } from '../config.js';

const MOODS = [
  { emoji: '😍', label: 'Loved them' },
  { emoji: '😊', label: 'Really good' },
  { emoji: '😐', label: 'They were okay' },
  { emoji: '😕', label: 'Disappointed' },
];

const VARIETIES = [
  'Mettavalasa Peechu', 'Bobbili Peechu', 'Kothapalli Kobbari',
  'Imam Pasand', 'Panduri Mavidi', 'Suvarnarekha',
  'Banganapalli', 'Chinna Rasalu', 'Pedda Rasalu',
  'Rajula Mamidi', 'Cheruku Rasalu',
];

const SOURCES = [
  { icon: '📦', label: 'Packaging' },
  { icon: '🏪', label: 'At a stall' },
  { icon: '👥', label: 'Friend' },
  { icon: '📱', label: 'Instagram' },
  { icon: '🌐', label: 'Online' },
];

export default function HelloPage() {
  usePageMeta({ title: 'Hello — Aamrutham', description: 'Our story. Walk with us.' });

  const [mood, setMood]           = useState(null);
  const [comment, setComment]     = useState('');
  const [picked, setPicked]       = useState([]);
  const [foundUs, setFoundUs]     = useState(null);
  const [name, setName]           = useState('');
  const [whatsapp, setWhatsapp]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  function toggleVariety(v) {
    setPicked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!/^[0-9]{10}$/.test(whatsapp.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp,
          source: [
            mood ? `${mood.emoji} ${mood.label}${comment.trim() ? ` — ${comment.trim()}` : ''}` : null,
            picked.length ? `Tried: ${picked.join(', ')}` : null,
            foundUs ? `Found via: ${foundUs.icon} ${foundUs.label}` : null,
          ].filter(Boolean).join(' | ') || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.root}>
      {/* Botanical corners */}
      <img src="/assets/botanical/mango-branch-bee.png"  alt="" aria-hidden style={s.botTL} />
      <img src="/assets/botanical/mango-tree-bees.png"   alt="" aria-hidden style={s.botTR} />
      <img src="/assets/botanical/mango-parrot-bee.png"  alt="" aria-hidden style={s.botBR} />

      {/* Logo watermark */}
      <img src="/assets/aam-final.png" alt="" aria-hidden style={s.watermark} />

      {submitted ? (
        <div style={s.center}>
          <div style={s.thankYou}>
            <p style={s.eyebrow}>Aamrutham · Year One</p>
            <h1 style={s.thankTitle}>Thank you.</h1>
            <p style={s.thankSub}>We'll reach out personally — not with a newsletter, just a conversation.</p>
            <p style={{ ...s.thankSub, opacity: 0.55, marginTop: '0.5rem' }}>Until then, enjoy the mangoes.</p>
          </div>
        </div>
      ) : (
        <div style={s.center}>
          {/* Story */}
          <p style={s.eyebrow}>Aamrutham · Year One</p>
          <h1 style={s.headline}>This started with a<br />love for mangoes.</h1>
          <p style={s.sub}>
            We grew up eating them. We couldn't find them anymore.<br />
            So we went back to the source — farmers in Bobbili who never stopped<br />
            growing the old way. No chemicals, no shortcuts, no carbide.
          </p>
          <p style={s.bold}>We're not building a brand. We're trying to bring something real back.</p>

          {/* Mood */}
          <div style={s.moodRow}>
            {MOODS.map(m => (
              <button key={m.emoji} onClick={() => setMood(mood?.emoji === m.emoji ? null : m)}
                style={{ ...s.moodBtn, ...(mood?.emoji === m.emoji ? s.moodActive : {}) }}>
                <span style={s.moodEmoji}>{m.emoji}</span>
                <span style={s.moodLabel}>{m.label}</span>
              </button>
            ))}
          </div>

          {mood && (
            <textarea style={s.textarea} placeholder="Tell us more… (optional)"
              value={comment} onChange={e => setComment(e.target.value)} maxLength={300} rows={2} />
          )}

          {/* What did you try */}
          <p style={s.chipLabel}>What did you try? <span style={s.optional}>(optional)</span></p>
          <div style={s.chipRow}>
            {VARIETIES.map(v => (
              <button key={v} type="button" onClick={() => toggleVariety(v)}
                style={{ ...s.chip, ...(picked.includes(v) ? s.chipActive : {}) }}>
                {v}
              </button>
            ))}
          </div>

          {/* How did you find us */}
          <p style={s.chipLabel}>How did you find us? <span style={s.optional}>(optional)</span></p>
          <div style={s.chipRow}>
            {SOURCES.map(src => (
              <button key={src.label} type="button"
                onClick={() => setFoundUs(foundUs?.label === src.label ? null : src)}
                style={{ ...s.chip, ...(foundUs?.label === src.label ? s.chipActive : {}) }}>
                {src.icon} {src.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.inputRow}>
              <input style={s.input} type="text" placeholder="Your name"
                value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
              <input style={s.input} type="tel" placeholder="WhatsApp number"
                value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/[^0-9+ ]/g, ''))}
                inputMode="tel" autoComplete="tel" />
            </div>
            {error && <p style={s.error}>{error}</p>}
            <button type="submit" disabled={loading} style={s.submit}>
              {loading ? 'Sending…' : 'Count me in'}
            </button>
            <p style={s.noSpam}>🤝 No spam. Ever. We'll only reach out when we have something worth sharing.</p>
          </form>
        </div>
      )}
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    background: '#FFF8EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 1rem',
  },
  watermark: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(300px, 50vw, 600px)',
    opacity: 0.07,
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 0,
  },
  botTL: {
    position: 'fixed', top: 0, left: 0,
    width: 'clamp(180px, 26vw, 380px)',
    opacity: 0.12, pointerEvents: 'none', userSelect: 'none',
    mixBlendMode: 'multiply', transform: 'translate(-8%, -5%)',
  },
  botTR: {
    position: 'fixed', top: 0, right: 0,
    width: 'clamp(180px, 26vw, 380px)',
    opacity: 0.10, pointerEvents: 'none', userSelect: 'none',
    mixBlendMode: 'multiply', transform: 'translate(6%, -6%) scaleX(-1)',
  },
  botBR: {
    position: 'fixed', bottom: 0, right: 0,
    width: 'clamp(160px, 22vw, 340px)',
    opacity: 0.10, pointerEvents: 'none', userSelect: 'none',
    mixBlendMode: 'multiply', transform: 'translate(8%, 5%)',
  },
  center: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 580,
    width: '100%',
    textAlign: 'center',
  },
  eyebrow: {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#C58A3E', marginBottom: '0.75rem',
  },
  headline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 400, fontStyle: 'italic',
    color: '#1C1208', lineHeight: 1.2, marginBottom: '1rem',
  },
  sub: {
    fontSize: '0.92rem', color: '#5B3A15',
    lineHeight: 1.8, marginBottom: '0.75rem',
  },
  bold: {
    fontSize: '0.95rem', color: '#1C1208',
    fontWeight: 700, lineHeight: 1.7, marginBottom: '1.5rem',
  },
  moodRow: {
    display: 'flex', gap: '0.5rem', justifyContent: 'center',
    flexWrap: 'wrap', marginBottom: '0.75rem',
  },
  moodBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
    padding: '0.55rem 0.75rem', borderRadius: 12,
    border: '1.5px solid #e3d5c0', background: '#fff',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
    minWidth: 72,
  },
  moodActive: {
    border: '1.5px solid #C58A3E', background: '#fdf5eb', transform: 'scale(1.06)',
  },
  moodEmoji: { fontSize: '1.75rem', lineHeight: 1 },
  moodLabel: { fontSize: '0.6rem', fontWeight: 600, color: '#5B3A15' },
  textarea: {
    width: '100%', padding: '0.65rem 0.85rem',
    border: '1.5px solid #e3d5c0', borderRadius: 10,
    fontSize: '0.88rem', fontFamily: 'inherit', color: '#1C1208',
    background: '#fff', resize: 'none', boxSizing: 'border-box',
    outline: 'none', marginBottom: '0.75rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' },
  input: {
    width: '100%', padding: '0.7rem 0.85rem',
    border: '1.5px solid #e3d5c0', borderRadius: 10,
    fontSize: '0.9rem', fontFamily: 'inherit', color: '#1C1208',
    background: '#fff', boxSizing: 'border-box', outline: 'none',
  },
  submit: {
    padding: '0.85rem', background: '#2D5016', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: '1rem',
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  noSpam: { fontSize: '0.72rem', color: '#a07850', lineHeight: 1.5, margin: 0 },
  chipLabel: { fontSize: '0.78rem', fontWeight: 600, color: '#5B3A15', margin: '0.75rem 0 0.35rem', textAlign: 'left' },
  optional: { fontWeight: 400, opacity: 0.55 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'flex-start', marginBottom: '0.25rem' },
  chip: {
    padding: '0.3rem 0.75rem', borderRadius: 50, border: '1.5px solid #e3d5c0',
    background: '#fff', fontSize: '0.75rem', fontWeight: 600, color: '#5B3A15',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  },
  chipActive: { border: '1.5px solid #C58A3E', background: '#fdf5eb', color: '#C58A3E' },
  error: { color: '#b91c1c', fontSize: '0.82rem', margin: 0 },
  thankYou: { padding: '2rem 0' },
  thankTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
    fontWeight: 400, fontStyle: 'italic',
    color: '#1C1208', marginBottom: '1rem',
  },
  thankSub: { fontSize: '1rem', color: '#5B3A15', lineHeight: 1.8 },
};
