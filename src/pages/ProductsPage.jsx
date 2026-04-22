import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const CAROUSEL_SLIDES = [
  {
    bg: "linear-gradient(135deg, rgba(5,15,2,0.72), rgba(15,43,6,0.65)), url('/assets/Mangoasaservice.png') center/cover no-repeat",
    eyebrow: '✦ Summer 2026 · 4 Weeks',
    title: 'Mango as a Service',
    copy: 'Four weekly drops of rare, tree-ripened heritage mangoes delivered to your door — all season long. One payment, no fuss.',
    cta: 'See the Plans →',
    href: '/season-pass',
  },
  {
    bg: "linear-gradient(135deg, rgba(26,10,0,0.72), rgba(61,26,0,0.65)), url('/assets/Seasonpass.png') center/cover no-repeat",
    eyebrow: '✦ Gift Edition · Summer 2026',
    title: 'Aamrutham Signature Box',
    copy: 'Four of our most prized heritage varieties, curated into one gift-worthy box. The perfect introduction to Bobbili\'s finest.',
    cta: 'Explore the Box →',
    href: '/heritage-box',
  },
];

function Carousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const go = (i) => {
    setActive((i + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(active + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  return (
    <section className="pp-carousel">
      <div className="pp-carousel-wrap">
        {CAROUSEL_SLIDES.map((s, i) => (
          <div key={i} className={`pp-carousel-slide${active === i ? ' active' : ''}`}
            style={{ background: s.bg }}>
            <div className="pp-carousel-bg" />
            <div className="pp-carousel-content">
              <span className="pp-carousel-eyebrow">{s.eyebrow}</span>
              <h2 className="pp-carousel-title">{s.title}</h2>
              <p className="pp-carousel-copy">{s.copy}</p>
              <Link to={s.href} className="pp-carousel-cta">{s.cta}</Link>
            </div>
          </div>
        ))}
        <button className="pp-carousel-arrow pp-carousel-prev" onClick={() => go(active - 1)}>&#8249;</button>
        <button className="pp-carousel-arrow pp-carousel-next" onClick={() => go(active + 1)}>&#8250;</button>
        <div className="pp-carousel-dots">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button key={i} className={`pp-carousel-dot${active === i ? ' active' : ''}`} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTile({ product }) {
  const isPremium = product.category === 'premium';
  return (
    <Link to={`/products/${product.id}`} className="pp-tile">
      <div className="pp-tile-img-wrap">
        {product.image
          ? <img src={product.image} alt={product.name} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          : null
        }
        <div className="pp-tile-img-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
          <span className="pp-tile-emoji">🥭</span>
          <span className="pp-tile-coming">Photo Coming Soon</span>
        </div>
        <span className={`pp-tile-badge ${isPremium ? 'pp-badge-signature' : 'pp-badge-explore'}`}>
          {isPremium ? 'Signature' : 'Heritage'}
        </span>
      </div>
      <div className="pp-tile-body">
        <div className="pp-tile-name">{product.name}</div>
        <div className="pp-tile-telugu">{product.telugu}</div>
        <div className="pp-tile-price">
          {product.packPrices?.[0] ? `From ₹${product.packPrices[0].price}` : 'Coming Soon'}
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const premium = products.filter((p) => p.category === 'premium');
  const more = products.filter((p) => p.category === 'more');

  return (
    <main className="pp-page">

      {/* Hero */}
      <div className="pp-hero">
        <div className="pp-hero-bg" />
        <p className="pp-hero-eyebrow">✦ Bobbili Farms · Hyderabad ✦</p>
        <h1 className="pp-hero-title">Our Mangoes,<br /><em>Your Summer</em></h1>
        <p className="pp-hero-sub">Naturally ripened · Pesticide-free · Curated from the finest farms</p>
      </div>

      {/* Delivery bar */}
      <div className="pp-delivery-bar">
        <div className="pp-delivery-item">🚚 Hyderabad delivery</div>
        <div className="pp-delivery-item">🚫 Zero pesticides</div>
        <div className="pp-delivery-item">📅 Summer 2026</div>
        <div className="pp-delivery-item">💬 Pre-order via WhatsApp</div>
      </div>

      {/* Carousel */}
      <Carousel />

      {/* Varieties grid */}
      <section className="pp-section">
        <div className="pp-section-head">
          <span className="pp-eyebrow">✦ Farm to Doorstep</span>
          <h2 className="pp-section-title">Our <em>Varieties</em></h2>
          <p className="pp-section-sub">Ten heritage varieties from Bobbili's finest estates. Tap any variety to explore and order.</p>
          <hr className="pp-divider" />
        </div>

        <h3 className="pp-group-label">Signature Varieties</h3>
        <div className="pp-grid">
          {premium.map((p) => <ProductTile key={p.id} product={p} />)}
        </div>

        <h3 className="pp-group-label" style={{ marginTop: '3rem' }}>Heritage Collection</h3>
        <div className="pp-grid">
          {more.map((p) => <ProductTile key={p.id} product={p} />)}
        </div>
      </section>

      {/* Feedback */}
      <section className="pp-feedback">
        <div className="pp-feedback-inner">
          <h2 className="pp-section-title">Loved your mangoes?</h2>
          <p className="pp-section-sub">Tell us about your experience — it helps us grow better.</p>
          <a href="https://wa.me/917670826759" className="pp-btn-feedback" target="_blank" rel="noreferrer">
            💬 Send Feedback on WhatsApp
          </a>
        </div>
      </section>

    </main>
  );
}
