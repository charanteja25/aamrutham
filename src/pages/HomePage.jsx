import React from 'react';
import { Link } from 'react-router-dom';
import { homeProcessSteps } from '../data/products';
import { isSeasonPassActive, SEASON_OVER_YEAR } from '../data/season';
import ProcessShowcase from '../components/ProcessShowcase';

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">✦ Natural Farming · గో ఆధారిత వ్యవసాయం · Bobbili Since 2013 ✦</p>
            <h1>
              Taste the <span>ఆమృతం</span> of Mangoes
            </h1>
            <p className="hero-pronounce">ఆమృతం (aam·rutham) — Crafted by Nature, Reserved for You</p>
            <p className="hero-text">
              <em>Aam</em> means mango. <em>Amrutham</em> means nectar. We believe that eating the right mango — naturally farmed, tree-ripened, picked at its peak — should feel exactly like that. The finest heritage varieties, handpicked fresh from our farm in Bobbili and brought to Hyderabad with care.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/products">Order Now →</Link>
              <a className="btn btn-outline" href="#story">Our Story</a>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.82rem', opacity: 0.65, display: 'flex', alignItems: 'flex-start', gap: '0.4rem', lineHeight: 1.55 }}>
              🌳 <span><strong>Deliveries start May 10th</strong> — the moment our mangoes are ready. We give each fruit the time it needs to ripen fully on the tree, never harvesting early or using artificial ripening agents.</span>
            </p>
          </div>
          <div className="hero-artwork-wrap">
            <div className="hero-art-bg" />
            <img src="/assets/Subject.png" alt="Aamrutham artwork" className="hero-artwork" />
          </div>
        </div>
      </section>

      <section id="story" className="section section-cream-dark">
        <div className="container story-grid">
          <div className="story-copy">
            <p className="section-eyebrow">The Beginning</p>
            <h2 className="section-title">Born from a boy’s love for mangoes</h2>
            <p>
              Ever since childhood, mangoes were never just a fruit for us — they were a feeling we grew up with and a love that stayed with us.
            </p>
            <blockquote>
              “Aam + Amrutham. We believe the perfect mango tastes like pure అమృతం.”
            </blockquote>
            <p>
              For over 12 years, our family has cultivated mangoes through natural farming without chemical fertilizers or pesticides. We harvest only at full maturity and never use artificial ripening agents.
            </p>
            <p>
              Our logo tells the whole story: the boy joyfully plucking a mango, the girl smiling beside the tree, and the memory of childhood preserved as the heart of the brand.
            </p>
          </div>
          <div className="story-art">
            <img src="/assets/process/examining-ripe-mangoes.png" alt="Handpicking ripe mangoes at Bobbili farm" className="story-farm-photo" />
            <div className="story-badge">✦ Natural Farming · No Chemicals</div>
          </div>
        </div>
      </section>

      <section className="section section-cream-dark home-products-teaser">
        <div className="container">
          <div className="section-head center">
            <p className="section-eyebrow">What We Offer</p>
            <h2 className="section-title">Three ways to get your mangoes</h2>
          </div>
          <div className="home-offer-grid">
            <Link to="/products" className="home-offer-card">
              <span className="home-offer-icon">🥭</span>
              <h3>Single Varieties</h3>
              <p>Pick a specific variety by the box. Banganapalli, Imam Pasand, Kothapalli Kobbari and more.</p>
              <span className="home-offer-from">From ₹349</span>
              <span className="home-offer-cta">Browse Mangoes →</span>
            </Link>
            <Link to="/signature-box" className="home-offer-card featured">
              <span className="home-offer-icon">✦</span>
              <h3>Signature Box</h3>
              <p>Four prized heritage varieties in one curated gift-worthy box. Perfect as a gift or an introduction.</p>
              <span className="home-offer-from" style={{ color: 'rgba(255,255,255,0.75)' }}>From ₹1,999</span>
              <span className="home-offer-cta">View Signature Box →</span>
            </Link>
            {isSeasonPassActive() ? (
              <Link to="/maas" className="home-offer-card seasonpass seasonpass--best-value">
                <span className="home-offer-best-value-tag">⚡ Best Value</span>
                <span className="home-offer-icon">⚡</span>
                <h3>Mango as a Service</h3>
                <p>A fresh drop of rare varieties delivered every week for four weeks. One payment. Four drops.</p>
                <span className="home-offer-from" style={{ color: 'rgba(245,210,150,0.8)' }}>From ₹3,000</span>
                <span className="home-offer-cta">Get Season Pass →</span>
              </Link>
            ) : (
              <div className="home-offer-card seasonpass seasonpass--closed" aria-disabled="true">
                <span className="home-offer-icon" style={{ opacity: 0.6 }}>⚡</span>
                <h3>Mango as a Service</h3>
                <p>
                  Season {SEASON_OVER_YEAR} is complete — thank you for a sweet run.
                  We'll be back with next year's harvest.
                </p>
                <span className="home-offer-cta" style={{ opacity: 0.65 }}>Season closed</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-cream mcalc-home-section">
        <div className="container mcalc-home-card">
          <div className="mcalc-home-left">
            <span className="mcalc-home-eyebrow">🥭 Smart Mango Planning</span>
            <h2 className="mcalc-home-title">Not sure how much to order?</h2>
            <p className="mcalc-home-body">
              Tell us about your family — how many mango lovers, how many per day, how many days — and we'll tell you exactly which pack to get.
            </p>
            <Link className="btn btn-leaf" to="/mango-calculator">Use the Mango Calculator →</Link>
            <p className="mcalc-home-share">
              Buying for someone else? <Link to="/mango-calculator" className="mcalc-home-share-link">Share this link</Link> and let them plan their own order.
            </p>
          </div>
          <div className="mcalc-home-right" aria-hidden="true">
            <div className="mcalc-home-preview">
              <div className="mcalc-home-preview-row">
                <span>👨‍👩‍👧‍👦 Mango lovers</span><strong>4</strong>
              </div>
              <div className="mcalc-home-preview-row">
                <span>🥭 Per day</span><strong>2</strong>
              </div>
              <div className="mcalc-home-preview-row">
                <span>📅 Days</span><strong>3</strong>
              </div>
              <div className="mcalc-home-preview-result">
                <span>You need</span>
                <strong>24 mangoes</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="promise-bar">
        <span className="promise-bar-label">Our Promise</span>
        <span className="promise-bar-divider">·</span>
        {[
          { label: 'Pesticide Free', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
          { label: 'Hand Graded', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg> },
          { label: 'Peak Season Harvest', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> },
          { label: 'Naturally Ripened', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> },
          { label: 'Own Farm · Bobbili', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { label: 'No Chemical Fertilizers', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
        ].map(b => (
          <span className="promise-bar-item" key={b.label}>
            <span className="promise-bar-icon">{b.svg}</span>
            <span className="promise-bar-text">{b.label}</span>
          </span>
        ))}
      </div>

      <section id="process" className="section section-cream">
        <div className="container">
          <div className="section-head center">
            <p className="section-eyebrow">Farm to Your Doorstep</p>
            <h2 className="section-title">How the mango reaches you</h2>
            <p className="section-subtitle">The journey stays rooted in patience, natural farming, and hand care.</p>
          </div>
          <ProcessShowcase steps={homeProcessSteps} />
        </div>
      </section>

      <section id="cta" className="section cta-section">
        <div className="container cta-box">
          <p className="section-eyebrow gold">✦ Summer 2026 · Hyderabad ✦</p>
          <h2>Be the first to taste pure ఆమృతం</h2>
          <p>
            Our mangoes are live and ready to order. Pick your variety, choose a pack, and pay securely — straight from Bobbili to your doorstep.
          </p>
          <Link className="btn btn-gold" to="/products">Shop Mangoes →</Link>
        </div>
      </section>
    </main>
  );
}
