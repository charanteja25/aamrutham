import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products, seasonPassProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

const HERITAGE_BOX = {
  id: 'heritage-box',
  name: 'Aamrutham Heritage Box',
};

const HERITAGE_PACKS = [
  { size: 12, label: 'Pack of 12', price: 1999 },
  { size: 24, label: 'Pack of 24', price: 3699 },
];

export default function ProductsPage() {
  const [selectedHeritage, setSelectedHeritage] = useState(HERITAGE_PACKS[0]);
  const [slideIndex, setSlideIndex] = useState(0);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();

  const premium = useMemo(() => products.filter((p) => p.category === 'premium'), []);
  const more = useMemo(() => products.filter((p) => p.category === 'more'), []);

  const heritageAvailable = getAvailable(HERITAGE_BOX.id, selectedHeritage.label);
  const heritageSoldOut = heritageAvailable === 0;

  const teaserSlides = [
    {
      key: 'pass',
      eyebrow: 'Summer 2026 · 4 Weeks',
      title: 'Mango Season Pass',
      copy: 'Four weekly drops of rare, tree-ripened varieties delivered across Hyderabad.',
      cta: 'See the Pass →',
      href: '#season-pass-section',
      bg: 'linear-gradient(135deg, #050f02, #0f2b06, #1a3a0a)',
    },
    {
      key: 'box',
      eyebrow: 'Gift Edition · Summer 2026',
      title: 'Aamrutham Signature Box',
      copy: 'A curated box of our most prized heritage mangoes — perfect for gifting and tasting.',
      cta: 'Explore the Box →',
      href: '#heritage-section',
      bg: 'linear-gradient(135deg, #1a0a00, #3d1a00, #6b3500)',
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % teaserSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [teaserSlides.length]);

  function handleAddHeritage() {
    if (heritageSoldOut) return;
    addToCart(HERITAGE_BOX, selectedHeritage.label, selectedHeritage.price, null, true);
  }

  function getSeasonPassFeatures(pass, index) {
    const lowerName = `${pass.name || ''} ${pass.shortTag || ''} ${pass.description || ''}`.toLowerCase();

    const is24Pack =
      lowerName.includes('24') ||
      lowerName.includes('family') ||
      (pass.packPrices || []).some((p) => (p.label || '').toLowerCase().includes('24'));

    if (is24Pack || index === 1) {
      return [
        '24 hand-picked mangoes per week',
        'Curated mix — 3–4 varieties each week',
        'Priority allocation of rarest varieties',
        'WhatsApp alert before each delivery',
        'Free delivery across Hyderabad',
      ];
    }

    return [
      '12 hand-picked mangoes per week',
      'Curated mix — 2–3 varieties each week',
      'Varieties rotate at seasonal peak',
      'WhatsApp alert before each delivery',
      'Free delivery across Hyderabad',
    ];
  }

  return (
    <main>
      <section className="page-hero products-page-hero">
        <div className="container center narrow">
          <p className="section-eyebrow gold">✦ Bobbili Farms · Hyderabad ✦</p>
          <h1>Our Mangoes, Your Summer</h1>
          <p className="page-hero-text">
            Naturally ripened · Pesticide-free · Curated from the finest farms
          </p>
        </div>
      </section>

      <section className="delivery-strip">
        <div>Hyderabad delivery</div>
        <div>Zero pesticides</div>
        <div>Summer 2026</div>
        <div>Secure Razorpay Checkout</div>
      </section>

      <section className="products-top-carousel">
        <div className="container">
          <div className="products-carousel-shell" style={{ background: teaserSlides[slideIndex].bg }}>
            <div className="products-carousel-content">
              <p className="products-carousel-eyebrow">✦ {teaserSlides[slideIndex].eyebrow}</p>
              <h2>{teaserSlides[slideIndex].title}</h2>
              <p>{teaserSlides[slideIndex].copy}</p>
              <a className="btn btn-gold" href={teaserSlides[slideIndex].href}>
                {teaserSlides[slideIndex].cta}
              </a>
            </div>

            <button
              className="products-carousel-arrow left"
              onClick={() => setSlideIndex((slideIndex - 1 + teaserSlides.length) % teaserSlides.length)}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              className="products-carousel-arrow right"
              onClick={() => setSlideIndex((slideIndex + 1) % teaserSlides.length)}
              aria-label="Next slide"
            >
              ›
            </button>

            <div className="products-carousel-dots">
              {teaserSlides.map((slide, idx) => (
                <button
                  key={slide.key}
                  className={idx === slideIndex ? 'active' : ''}
                  onClick={() => setSlideIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section heritage-section" id="heritage-section">
        <div className="container heritage-grid">
          <div className="heritage-visual">
            <img src="/assets/Subject.png" alt="Aamrutham artwork" />
          </div>
          <div className="heritage-copy">
            <p className="section-eyebrow gold">✦ Introducing · Summer 2026</p>
            <h2 className="section-title light">Aamrutham Heritage Box</h2>
            <p>
              Four of our most prized varieties in one gift-worthy box: Kothapalli Kobbari,
              Panduri Mavidi, Bobbili Peechu, and Imam Pasand.
            </p>
            <div className="heritage-list">
              <span>Kothapalli Kobbari</span>
              <span>Panduri Mavidi</span>
              <span>Bobbili Peechu</span>
              <span>Imam Pasand</span>
            </div>

            <div className="heritage-packs">
              {HERITAGE_PACKS.map((pack) => {
                const packAvail = getAvailable(HERITAGE_BOX.id, pack.label);
                const packOut = packAvail === 0;

                return (
                  <button
                    key={pack.label}
                    className={`pack-pill ${selectedHeritage.label === pack.label ? 'active' : ''} ${packOut ? 'pack-pill--out' : ''}`}
                    onClick={() => !packOut && setSelectedHeritage(pack)}
                    title={packOut ? 'Sold out' : undefined}
                  >
                    {pack.label}
                    {packOut ? ' ✕' : ''}
                  </button>
                );
              })}
            </div>

            <div className="heritage-price-row">
              <div>
                <span className="heritage-price">
                  ₹{selectedHeritage.price.toLocaleString('en-IN')}
                </span>
                <span className="heritage-price-note"> · incl. free delivery</span>
              </div>
              {heritageAvailable !== null && heritageAvailable <= 5 && heritageAvailable > 0 && (
                <span className="stock-badge stock-badge--low" style={{ position: 'static' }}>
                  Only {heritageAvailable} left
                </span>
              )}
            </div>

            <div className="heritage-actions">
              <button
                className="btn btn-gold"
                onClick={handleAddHeritage}
                disabled={heritageSoldOut}
                style={heritageSoldOut ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                {heritageSoldOut ? 'Sold Out' : 'Add to Cart →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'linear-gradient(180deg, #031b0b 0%, #041f0d 45%, #05240f 100%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            className="section-head"
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            <p
              className="section-eyebrow"
              style={{
                color: '#d7a62a',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              ✦ Never Miss a Season
            </p>

            <h2
              className="section-title"
              style={{
                color: '#f8f3e8',
                marginBottom: '0.75rem',
              }}
            >
              Choose Your Pass
            </h2>

            <p
              className="section-subtitle"
              style={{
                color: 'rgba(248,243,232,0.72)',
                maxWidth: '720px',
                margin: '0 auto',
              }}
            >
              One-time payment. Four weekly deliveries. Premium mangoes, naturally ripened
              and delivered across Hyderabad.
            </p>
          </div>

          <div
            className="products-grid"
            id="season-pass-section"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            {seasonPassProducts.map((pass, index) => {
              const primaryPack = pass.packPrices[0];
              const isFeatured = index === 1;
              const featureLines = getSeasonPassFeatures(pass, index);

              return (
                <div
                  key={pass.id}
                  className="product-card"
                  style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.03)',
                    border: isFeatured
                      ? '1.5px solid #d7a62a'
                      : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    boxShadow: isFeatured
                      ? '0 16px 40px rgba(0,0,0,0.28)'
                      : '0 10px 28px rgba(0,0,0,0.18)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100%',
                  }}
                >
                  {isFeatured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.1rem',
                        left: '1.1rem',
                        background: '#d7a62a',
                        color: '#111111',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '0.45rem 0.8rem',
                        borderRadius: '999px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      BEST VALUE
                    </div>
                  )}

                  <div style={{ marginTop: isFeatured ? '2.25rem' : 0 }}>
                    <p
                      style={{
                        color: '#f8f3e8',
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginBottom: '0.45rem',
                        opacity: 0.95,
                      }}
                    >
                      {primaryPack?.label}
                    </p>

                    <p
                      style={{
                        color: 'rgba(248,243,232,0.72)',
                        fontSize: '0.98rem',
                        lineHeight: 1.6,
                        marginBottom: '1.35rem',
                      }}
                    >
                      {pass.shortTag || 'Premium + Heritage mix · 4 deliveries'}
                    </p>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          color: '#f4b331',
                          fontSize: '2.35rem',
                          fontWeight: 800,
                          lineHeight: 1,
                          marginBottom: '0.35rem',
                        }}
                      >
                        ₹{primaryPack.price.toLocaleString('en-IN')}
                      </div>
                      <div
                        style={{
                          color: 'rgba(248,243,232,0.6)',
                          fontSize: '0.95rem',
                        }}
                      >
                        one-time · full season · free delivery
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        padding: '1rem 0',
                        marginBottom: '1.5rem',
                        display: 'grid',
                        gap: '0.8rem',
                      }}
                    >
                      {featureLines.map((item) => (
                        <div
                          key={item}
                          style={{
                            color: '#f8f3e8',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.6rem',
                          }}
                        >
                          <span style={{ color: '#d7a62a', fontWeight: 700 }}>✓</span>
                          <span style={{ opacity: 0.92 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <button
                      className="btn"
                      onClick={() =>
                        addToCart(pass, primaryPack.label, primaryPack.price, null, true)
                      }
                      style={{
                        width: '100%',
                        background: '#f4b331',
                        color: '#111111',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.95rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 10px 24px rgba(244,179,49,0.18)',
                      }}
                    >
                      Add to Cart — ₹{primaryPack.price.toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">✦ Our Finest</p>
            <h2 className="section-title">Signature Premium Varieties</h2>
            <p className="section-subtitle">
              Hand-picked from the estates of Bobbili — rare varieties you will not find in a
              supermarket.
            </p>
          </div>
          <div className="products-grid">
            {premium.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">✦ Also Available</p>
            <h2 className="section-title">Explore More Varieties</h2>
            <p className="section-subtitle">
              Beloved names from across Andhra Pradesh beyond the signature collection.
            </p>
          </div>
          <div className="products-grid products-grid-more">
            {more.map((product) => (
              <ProductCard key={product.id} product={product} showDetails={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section feedback-section">
        <div className="container center narrow">
          <p className="section-eyebrow">✦ Help Us Grow</p>
          <h2 className="section-title">Share Your Feedback</h2>
          <p className="section-subtitle">
            Tried our mangoes or curious about a variety? Tell us what you think and help shape
            the next season.
          </p>
          <a
            className="btn btn-leaf"
            href="https://docs.google.com/forms/d/1JN79K4KjMpUlpm77R3ZZD_WmVkyR8UTjWIwvxZSj2lw/viewform"
            target="_blank"
            rel="noreferrer"
          >
            Open feedback form
          </a>
        </div>
      </section>
    </main>
  );
}
