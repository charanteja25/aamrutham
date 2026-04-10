import React, { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { buildWhatsAppUrl, products } from '../data/products';

export default function ProductsPage() {
  const [heritagePack, setHeritagePack] = useState(12);
  const premium = useMemo(() => products.filter((product) => product.category === 'premium'), []);
  const more = useMemo(() => products.filter((product) => product.category === 'more'), []);

  return (
    <main>
      <section className="page-hero products-page-hero">
        <div className="container center narrow">
          <p className="section-eyebrow gold">✦ Bobbili Farms · Hyderabad ✦</p>
          <h1>Our Mangoes, Your Summer</h1>
          <p className="page-hero-text">Naturally ripened · Pesticide-free · Curated from the finest farms</p>
        </div>
      </section>

      <section className="delivery-strip">
        <div>Hyderabad delivery</div>
        <div>Zero pesticides</div>
        <div>Summer 2026</div>
        <div>Pre-order via WhatsApp</div>
      </section>

      <section className="section heritage-section">
        <div className="container heritage-grid">
          <div className="heritage-visual">
            <img src="/assets/Subject.png" alt="Aamrutham artwork" />
          </div>
          <div className="heritage-copy">
            <p className="section-eyebrow gold">✦ Introducing · Summer 2026</p>
            <h2 className="section-title light">Aamrutham Heritage Box</h2>
            <p>
              Four of our most prized varieties in one gift-worthy box: Kothapalli Kobbari, Panduri Mavidi, Bobbili Peechu, and Imam Pasand.
            </p>
            <div className="heritage-list">
              <span>Kothapalli Kobbari</span>
              <span>Panduri Mavidi</span>
              <span>Bobbili Peechu</span>
              <span>Imam Pasand</span>
            </div>
            <div className="heritage-packs">
              {[12, 24].map((pack) => (
                <button
                  key={pack}
                  className={`pack-pill ${heritagePack === pack ? 'active' : ''}`}
                  onClick={() => setHeritagePack(pack)}
                >
                  Pack of {pack}
                </button>
              ))}
            </div>
            <a
              className="btn btn-whatsapp-large"
              href={buildWhatsAppUrl(`Hi Aamrutham! I’d like to pre-order the *Aamrutham Heritage Box* (Pack of ${heritagePack}) 🥭 Could you share availability and pricing?`)}
              target="_blank"
              rel="noreferrer"
            >
              Pre-order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">✦ Our Finest</p>
            <h2 className="section-title">Signature Premium Varieties</h2>
            <p className="section-subtitle">Hand-picked from the estates of Bobbili — rare varieties you will not find in a supermarket.</p>
          </div>
          <div className="products-grid">
            {premium.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">✦ Also Available</p>
            <h2 className="section-title">Explore More Varieties</h2>
            <p className="section-subtitle">Beloved names from across Andhra Pradesh beyond the signature collection.</p>
          </div>
          <div className="products-grid products-grid-more">
            {more.map((product) => <ProductCard key={product.id} product={product} showDetails={false} />)}
          </div>
        </div>
      </section>

      <section className="section feedback-section">
        <div className="container center narrow">
          <p className="section-eyebrow">✦ Help Us Grow</p>
          <h2 className="section-title">Share Your Feedback</h2>
          <p className="section-subtitle">
            Tried our mangoes or curious about a variety? Tell us what you think and help shape the next season.
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
