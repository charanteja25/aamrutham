import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    bg: "linear-gradient(135deg, rgba(5,15,2,0.72), rgba(15,43,6,0.65)), url('/assets/Mangoasaservice.png') center/cover no-repeat",
    eyebrow: '✦ Summer 2026 · 4 Weeks',
    title: 'Mango as a Service',
    copy: 'Four weekly drops of rare, tree-ripened heritage mangoes delivered to your door — all season long. One payment, no fuss.',
    cta: 'See the Plans →',
    href: '/maas',
  },
  {
    bg: "linear-gradient(135deg, rgba(26,10,0,0.72), rgba(61,26,0,0.65)), url('/assets/Seasonpass.png') center/cover no-repeat",
    eyebrow: '✦ Gift Edition · Summer 2026',
    title: 'Aamrutham Signature Box',
    copy: 'Four of our most prized heritage varieties, curated into one gift-worthy box. The perfect introduction to Bobbili\'s finest.',
    cta: 'Explore the Box →',
    href: '/signature-box',
  },
];

export default function VarietyCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="carousel-section">
      <div className="carousel-wrap">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`carousel-slide${i === active ? ' active' : ''}`}
            style={{ background: slide.bg }}
          >
            <div className="carousel-slide-bg" />
            <div className="carousel-slide-content">
              <span className="carousel-eyebrow">{slide.eyebrow}</span>
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-copy">{slide.copy}</p>
              <Link to={slide.href} className="carousel-cta">{slide.cta}</Link>
            </div>
          </div>
        ))}

        <button className="carousel-arrow carousel-prev" onClick={() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous">‹</button>
        <button className="carousel-arrow carousel-next" onClick={() => setActive(a => (a + 1) % SLIDES.length)} aria-label="Next">›</button>

        <div className="carousel-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`carousel-dot${i === active ? ' active' : ''}`} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
