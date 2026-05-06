import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import { API_BASE } from '../config.js';

const WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/Dg0H723BaYc4v0bkJELP9R';
const INSTAGRAM = 'https://instagram.com/aamrutham_';

export default function HelloPage() {
  usePageMeta({ title: 'Walk with us — Aamrutham', description: 'We grew up eating real mangoes. We want to share that love with you.' });

  const [name, setName]           = useState('');
  const [whatsapp, setWhatsapp]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

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
        body: JSON.stringify({ name: name.trim(), whatsapp, source: 'hello-page' }),
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
    <div style={s.root} className="hello-root">
      {submitted ? (
        <div style={s.center}>
          <p style={s.eyebrow}>Aamrutham</p>
          <h1 style={s.thankTitle}>Welcome to the family. 🥭</h1>
          <p style={s.thankSub}>
            You're now part of a small group of people who care about how their food is grown.
            We'll reach out personally — not with a newsletter, just a real conversation.
          </p>
          <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noreferrer" style={s.waBtn}>
            Join our WhatsApp Community
          </a>
          <p style={s.thankFooter}>
            Follow our journey on{' '}
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={s.instaLink}>@aamrutham_</a>
          </p>
        </div>
      ) : (
        <div style={s.center}>

          <p style={s.eyebrow}>Aamrutham</p>
          <h1 style={s.headline}>We grew up eating<br />real mangoes.</h1>

          <p style={s.sub}>
            Somewhere along the way, the mangoes changed. Carbide ripening, chemical sprays,
            varieties bred for shelf life — not taste. The mango we grew up eating slowly disappeared.
          </p>
          <p style={s.sub}>
            So we went looking. We found farmers in Bobbili who never stopped growing the old way —
            no chemicals, no shortcuts, tree-ripened and harvested by hand. We want to share that with everyone who loves mangoes the way we do.
          </p>

          <Link to="/team" style={s.storyLink}>Meet the people behind it →</Link>

          {/* Primary CTA */}
          <div style={s.divider} />
          <p style={s.joinLabel}>Join our community. Stay close to the farm.</p>
          <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noreferrer" style={s.waBtn}>
            Join our WhatsApp Community
          </a>
          <p style={s.instaRow}>
            Or follow us on{' '}
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={s.instaLink}>@aamrutham_</a>
          </p>

          {/* Secondary CTA */}
          <div style={s.divider} />
          <p style={s.orLabel}>Want us to reach out personally?</p>
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
              {loading ? 'Sending…' : 'Stay in touch'}
            </button>
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
    padding: '4rem 1.5rem',
  },
  center: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 560,
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
    color: '#1C1208', lineHeight: 1.2, marginBottom: '1.25rem',
  },
  sub: {
    fontSize: '0.95rem', color: '#5B3A15',
    lineHeight: 1.85, marginBottom: '1rem',
  },
  storyLink: {
    display: 'inline-block',
    fontSize: '0.85rem', fontWeight: 700,
    color: '#2D5016', textDecoration: 'none',
    borderBottom: '1.5px solid #2D5016',
    paddingBottom: '1px', marginBottom: '0.5rem',
  },
  divider: {
    width: 40, height: 2,
    background: 'rgba(197,138,62,0.3)',
    margin: '1.75rem auto',
    borderRadius: 2,
  },
  joinLabel: {
    fontSize: '0.82rem', color: '#5B3A15',
    fontWeight: 600, marginBottom: '1rem',
    letterSpacing: '0.01em',
  },
  waBtn: {
    display: 'block',
    background: '#25D366',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.9rem 1.5rem',
    borderRadius: 12,
    textDecoration: 'none',
    marginBottom: '0.75rem',
    transition: 'opacity 0.15s',
  },
  instaRow: {
    fontSize: '0.8rem', color: '#a07850', margin: 0,
  },
  instaLink: {
    color: '#C58A3E', fontWeight: 700, textDecoration: 'none',
  },
  orLabel: {
    fontSize: '0.78rem', color: '#a07850',
    marginBottom: '0.85rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' },
  input: {
    width: '100%', padding: '0.7rem 0.85rem',
    border: '1.5px solid #e3d5c0', borderRadius: 10,
    fontSize: '0.9rem', fontFamily: 'inherit', color: '#1C1208',
    background: '#fff', boxSizing: 'border-box', outline: 'none',
  },
  submit: {
    padding: '0.85rem', background: '#2D5016', color: '#fff',
    border: 'none', borderRadius: 12, fontSize: '1rem',
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  error: { color: '#b91c1c', fontSize: '0.82rem', margin: 0 },
  thankTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 400, fontStyle: 'italic',
    color: '#1C1208', marginBottom: '1rem',
  },
  thankSub: {
    fontSize: '0.95rem', color: '#5B3A15',
    lineHeight: 1.85, marginBottom: '1.5rem',
  },
  thankFooter: {
    fontSize: '0.8rem', color: '#a07850',
    marginTop: '1rem',
  },
};
