import React from 'react';
import { Link } from 'react-router-dom';
import { featuredVarieties, homeProcessSteps, homeQualityBadges } from '../data/products';
import ProcessShowcase from '../components/ProcessShowcase';
import LogoRevealSection from '../components/LogoRevealSection';

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">✦ Bobbili Farms · Hyderabad ✦</p>
            <h1>
              Taste the <span>ఆమృతం</span> of Mangoes
            </h1>
            <p className="hero-pronounce">ఆమృతం (aam·rutham) — Crafted by Nature, Reserved for You</p>
            <p className="hero-text">
              Aam + Amrutham. The finest mango varieties, handpicked fresh from our farm in Bobbili and brought to Hyderabad with care.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/products">Order Now →</Link>
              <a className="btn btn-outline" href="#story">Our Story</a>
            </div>
          </div>
          <div className="hero-artwork-wrap">
            <div className="hero-art-bg" />
            <img src="/assets/Subject.png" alt="Aamrutham artwork" className="hero-artwork" />
          </div>
        </div>
      </section>

      {/* <LogoRevealSection /> */}

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
            <img src="/assets/aam-final.png" alt="Aamrutham logo story" />
            <div className="story-badge">✦ Natural Farming · No Chemicals</div>
          </div>
        </div>
      </section>

      <section className="section section-leaf promise-section">
        <div className="container">
          <p className="quality-title">Our Promise</p>
          <div className="quality-grid">
            {homeQualityBadges.map((item) => (
              <div className="quality-card" key={item}>
                <div className="quality-icon">✦</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section section-cream">
  <div className="container">
    <div className="section-banner-lite">
      <h2>Farm to Your Doorstep</h2>
    </div>

    <div className="section-head center">
      <p className="section-eyebrow">Farm to Your Doorstep</p>
      <h2 className="section-title">How the mango reaches you</h2>
      <p className="section-subtitle">
        The journey stays rooted in patience, natural farming, and hand care.
      </p>
    </div>

    <ProcessShowcase steps={homeProcessSteps} />
  </div>
</section>

      <section id="varieties" className="section section-cream-dark">
        <div className="container">
          <div className="section-head center">
            <p className="section-eyebrow">Our Mango Varieties</p>
            <h2 className="section-title">Signature mangoes from Bobbili</h2>
            <p className="section-subtitle">Rare flavours, heirloom names, and fruit that feels deeply regional.</p>
          </div>
          <div className="featured-grid">
            {featuredVarieties.map((product) => (
              <div className="featured-card" key={product.id} style={{ background: product.gradient }}>
                <div className="featured-card-inner">
                  <div className="featured-tag">{product.shortTag}</div>
                  <h3>{product.name}</h3>
                  <p className="featured-telugu">{product.telugu}</p>
                  <p className="featured-meaning">— {product.meaning}</p>
                  <p className="featured-text">{product.description}</p>
                  <div className="featured-chips">
                    {product.badges.map((badge) => <span key={badge}>{badge}</span>)}
                  </div>
                  <Link className="btn btn-outline-dark" to={`/products/${product.id}`}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta-row">
            <Link className="btn btn-leaf" to="/products">Explore All Our Mangoes</Link>
          </div>
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
