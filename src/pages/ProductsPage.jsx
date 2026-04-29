import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products, buildWhatsAppUrl } from '../data/products';
import { isSeasonPassActive } from '../data/season';
import VarietyCarousel from '../components/VarietyCarousel';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

function packWeight(avgWeightGrams, label) {
  const qty = parseInt(label);
  if (!avgWeightGrams || !qty) return null;
  const [min, max] = avgWeightGrams;
  const minKg = (qty * min / 1000).toFixed(1);
  const maxKg = (qty * max / 1000).toFixed(1);
  return min === max ? `${minKg} kgs` : `${minKg}–${maxKg} kgs`;
}

function VarietyTile({ product }) {
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();

  // Once inventory loads, if the default-selected pack has 0 stock, switch to
  // the first pack that's actually in stock so the UI doesn't misleadingly
  // show "Coming Soon" for an entire product that has other packs available.
  useEffect(() => {
    const current = getAvailable(product.id, selectedPack.label);
    if (current === null) return;      // inventory still loading
    if (current > 0) return;           // already on a good pack
    const firstAvail = product.packPrices.find(
      (p) => (getAvailable(product.id, p.label) ?? 0) > 0
    );
    if (firstAvail && firstAvail.label !== selectedPack.label) {
      setSelectedPack(firstAvail);
    }
  }, [getAvailable, product, selectedPack.label]);

  const available = getAvailable(product.id, selectedPack.label);
  const isSoldOut = available === 0;
  const isSignature = product.category === 'premium';
  return (
    <div className="variety-tile">
      <Link to={`/products/${product.id}`} className="variety-tile-img" data-product={product.id} style={{ background: product.gradient }}>
        <img
          src={`/assets/varieties/${product.id}.jpg`}
          alt={product.name}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <span className={`variety-tile-badge ${isSignature ? 'badge-signature' : 'badge-heritage'}`}>
          {isSignature ? 'Signature' : 'Heritage'}
        </span>
        {isSoldOut && <span className="variety-tile-soldout">Coming Soon</span>}
      </Link>
      <div className="variety-tile-body">
        <Link to={`/products/${product.id}`} className="variety-tile-name">{product.name}</Link>
        <div className="variety-tile-telugu">{product.telugu} · {product.meaning}</div>
        {product.eatType && (
          <div className="variety-tile-eat-tags">
            {product.eatType.map(tag => (
              <span key={tag} className={`variety-eat-tag variety-eat-tag--${tag.toLowerCase().replace(/[^a-z]/g, '-')}`}>{tag}</span>
            ))}
          </div>
        )}
        <p className="variety-tile-intro">{product.description}</p>
        <Link to={`/products/${product.id}`} className="variety-tile-more">View more for details →</Link>
      </div>
      <div className="variety-tile-footer">
        <div className="variety-tile-pack-row">
          {product.packPrices.map(p => {
            const packAvail = getAvailable(product.id, p.label);
            const packOut = packAvail === 0;
            return (
              <button
                key={p.label}
                className={`variety-tile-pack-btn${selectedPack.label === p.label ? ' active' : ''}${packOut ? ' out' : ''}`}
                onClick={() => !packOut && setSelectedPack(p)}
                title={packOut ? 'Out of stock' : undefined}
              >
                {p.label}
                {packWeight(product.avgWeightGrams, p.label) && (
                  <span style={{ color: 'var(--mango-dark)', fontWeight: 700, fontSize: '0.78rem' }}>
                    {' '}({packWeight(product.avgWeightGrams, p.label)})
                  </span>
                )}
                {packOut && ' ✕'}
              </button>
            );
          })}
        </div>
        <div className="variety-tile-footer-row">
          <div>
            <span className="variety-tile-price">
              <span style={{ textDecoration: 'line-through', color: '#aaa', fontWeight: 400, fontSize: '0.95rem', marginRight: '0.3rem' }}>
                ₹{(selectedPack.price + 101).toLocaleString('en-IN')}
              </span>
              ₹{selectedPack.price.toLocaleString('en-IN')}
            </span>
            <Link to="/pricing" className="pricing-link">ℹ️ Why this price?</Link>
          </div>
          {isSoldOut ? (
            <span className="sold-out-chip">Coming Soon</span>
          ) : (
            <button
              className="variety-tile-cart-btn"
              onClick={() => addToCart(product, selectedPack.label, selectedPack.price, null, null, true)}
            >Add to cart</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SeasonPassTile() {
  return (
    <Link to="/maas" className="variety-tile season-pass-tile">
      <div className="season-pass-tile-glow" aria-hidden="true" />
      <div className="season-pass-tile-inner">
        <span className="season-pass-tile-eyebrow">⚡ Season Pass</span>
        <h3 className="season-pass-tile-title">Try them <em>all</em></h3>
        <p className="season-pass-tile-copy">
          Four weeks. One payment. Rare heritage varieties delivered fresh every week, curated by our team.
        </p>
        <span className="season-pass-tile-cta">Explore Season Pass →</span>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const varieties = products.filter(p => p.category === 'premium' || p.category === 'more');

  return (
    <main>
      <div className="products-mini-hero">
        <p className="section-eyebrow gold">✦ Bobbili Farms · Hyderabad ✦</p>
        <h1>Our Mangoes, <em>Your Summer</em></h1>
        <p className="products-mini-sub">Naturally ripened · Pesticide-free · Bobbili farms</p>
      </div>

      <div className="products-strip">
        <span className="products-strip-title">Our Mangoes</span>
        <div className="products-strip-ticker">
          <div className="products-strip-ticker-inner">
            {[...varieties, ...varieties].map((p, i) => (
              <span key={i}>{p.name} <span className="products-strip-dot">·</span> </span>
            ))}
          </div>
        </div>
      </div>

      <VarietyCarousel />

      <section className="delivery-strip">
        <div>Hyderabad delivery</div>
        <div>Zero pesticides</div>
        <div>Summer 2026</div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div data-aos="fade-up">
            <span className="section-eyebrow">✦ Farm to Doorstep</span>
            <h2 className="section-title">Our <em>Varieties</em></h2>
            <p className="section-subtitle">Heritage varieties from our farm in Bobbili.</p>
          </div>

          <div className="variety-tiles-grid">
            {varieties.map(product => <VarietyTile key={product.id} product={product} />)}
            {isSeasonPassActive() && <SeasonPassTile />}
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
            href={buildWhatsAppUrl('Hi! I tried your mangoes and wanted to share some feedback.')}
            target="_blank"
            rel="noreferrer"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
