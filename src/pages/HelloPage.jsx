import React, { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { API_BASE } from '../config.js';

const MOODS = [
  { emoji: '😍', label: 'Loved them' },
  { emoji: '😊', label: 'Really good' },
  { emoji: '😐', label: 'They were okay' },
  { emoji: '😕', label: 'Disappointed' },
];

export default function HelloPage() {
  usePageMeta({ title: 'Hello — Aamrutham', description: 'Our story. Our values. Walk with us.' });

  const [mood, setMood]       = useState(null);
  const [comment, setComment] = useState('');
  const [name, setName]       = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

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
          source: mood ? `${mood.emoji} ${mood.label}${comment.trim() ? ` — ${comment.trim()}` : ''}` : null,
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

  if (submitted) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥭</div>
          <h1 style={styles.thankYouTitle}>Thank you.</h1>
          <p style={styles.thankYouText}>
            We'll reach out personally — not with a newsletter, just a conversation.
          </p>
          <p style={styles.thankYouSub}>
            Until then, enjoy the mangoes.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {/* Botanical illustrations — decorative corners */}
      <img src="/assets/botanical/mango-branch-bee.png" alt="" aria-hidden="true" style={styles.botanicalTL} />
      <img src="/assets/botanical/mango-parrot-bee.png" alt="" aria-hidden="true" style={styles.botanicalBR} />
      <img src="/assets/botanical/mango-tree-bees.png"  alt="" aria-hidden="true" style={styles.botanicalBL} />

      <div style={styles.card}>

        {/* Story */}
        <div style={styles.storySection}>
          <p style={styles.eyebrow}>Aamrutham · Year One</p>
          <h1 style={styles.headline}>
            This started with a love for mangoes.
          </h1>
          <p style={styles.body}>
            Real ones — the kind that don't travel well, don't last long, and taste like nothing you've had from a store.
          </p>
          <p style={styles.body}>
            We grew up eating them. We couldn't find them anymore. So we went back to the source.
          </p>
          <p style={styles.body}>
            We found farmers in Bobbili who never stopped growing the old way — no chemicals, no shortcuts, no carbide. Just trees, time, and the right hands.
          </p>
          <p style={styles.body}>
            Aamrutham is Year One of something we hope lasts a long time. Not just mangoes — but a way of growing, a way of eating, and a relationship with the land that most of us have forgotten.
          </p>
          <p style={styles.bodyBold}>
            We're not building a brand. We're trying to bring something real back.
          </p>
          <p style={styles.body}>
            If that means something to you — we'd love to have you with us.
          </p>
        </div>

        <div style={styles.divider} />

        {/* Mood picker */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>How were your mangoes?</p>
          <div style={styles.moodRow}>
            {MOODS.map(m => (
              <button
                key={m.emoji}
                onClick={() => setMood(mood?.emoji === m.emoji ? null : m)}
                style={{
                  ...styles.moodBtn,
                  ...(mood?.emoji === m.emoji ? styles.moodBtnActive : {}),
                }}
                title={m.label}
              >
                <span style={styles.moodEmoji}>{m.emoji}</span>
                <span style={styles.moodLabel}>{m.label}</span>
              </button>
            ))}
          </div>

          {mood && (
            <textarea
              style={styles.textarea}
              placeholder="Tell us more… (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={500}
              rows={3}
            />
          )}
        </div>

        <div style={styles.divider} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.section}>
          <p style={styles.sectionLabel}>Walk with us</p>

          <input
            style={styles.input}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="WhatsApp number"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value.replace(/[^0-9+ ]/g, ''))}
            inputMode="tel"
            autoComplete="tel"
          />

          <p style={styles.noSpam}>
            🤝 No spam. Ever. We'll only reach out when we have something worth sharing.
          </p>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Sending…' : 'Count me in'}
          </button>
        </form>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FFF8EC',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem 1rem 4rem',
  },
  card: {
    width: '100%',
    maxWidth: 560,
  },
  storySection: {
    padding: '2rem 0 1.5rem',
  },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#C58A3E',
    marginBottom: '1rem',
  },
  headline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#1C1208',
    lineHeight: 1.2,
    marginBottom: '1.25rem',
  },
  body: {
    fontSize: '1rem',
    color: '#5B3A15',
    lineHeight: 1.8,
    marginBottom: '0.85rem',
  },
  bodyBold: {
    fontSize: '1rem',
    color: '#1C1208',
    lineHeight: 1.8,
    fontWeight: 700,
    marginBottom: '0.85rem',
  },
  divider: {
    borderTop: '1px solid #e8d9c4',
    margin: '1.5rem 0',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sectionLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    color: '#1C1208',
    fontWeight: 400,
    marginBottom: '0.25rem',
  },
  moodRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  moodBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.65rem 0.85rem',
    borderRadius: 12,
    border: '1.5px solid #e3d5c0',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    flex: 1,
    minWidth: 80,
  },
  moodBtnActive: {
    border: '1.5px solid #C58A3E',
    background: '#fdf5eb',
    transform: 'scale(1.05)',
  },
  moodEmoji: {
    fontSize: '2rem',
    lineHeight: 1,
  },
  moodLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#5B3A15',
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 0.85rem',
    border: '1.5px solid #e3d5c0',
    borderRadius: 10,
    fontSize: '0.92rem',
    fontFamily: 'inherit',
    color: '#1C1208',
    background: '#fff',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.85rem',
    border: '1.5px solid #e3d5c0',
    borderRadius: 10,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    color: '#1C1208',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
  },
  noSpam: {
    fontSize: '0.75rem',
    color: '#a07850',
    lineHeight: 1.5,
    margin: '0.25rem 0',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '0.82rem',
    margin: 0,
  },
  submitBtn: {
    padding: '0.85rem',
    background: '#2D5016',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
    marginTop: '0.25rem',
  },
  thankYouTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.5rem',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#1C1208',
    marginBottom: '1rem',
  },
  thankYouText: {
    fontSize: '1.05rem',
    color: '#5B3A15',
    lineHeight: 1.8,
    marginBottom: '0.5rem',
  },
  thankYouSub: {
    fontSize: '0.9rem',
    color: '#a07850',
    lineHeight: 1.6,
  },
  botanicalTL: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 'clamp(200px, 28vw, 400px)',
    opacity: 0.09,
    pointerEvents: 'none',
    userSelect: 'none',
    mixBlendMode: 'multiply',
    transform: 'translate(-8%, -5%)',
  },
  botanicalBR: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: 'clamp(180px, 26vw, 380px)',
    opacity: 0.09,
    pointerEvents: 'none',
    userSelect: 'none',
    mixBlendMode: 'multiply',
    transform: 'translate(8%, 5%)',
  },
  botanicalBL: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 'clamp(180px, 26vw, 360px)',
    opacity: 0.08,
    pointerEvents: 'none',
    userSelect: 'none',
    mixBlendMode: 'multiply',
    transform: 'translate(6%, -6%) scaleX(-1)',
  },
};
