import React, { useEffect, useMemo, useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { HYD_PINCODES, getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import MangoesPerDayChart from '../components/MangoesPerDayChart';
import MangoCalculatorDrawer from '../components/MangoCalculatorDrawer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id) || products[0];
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [activeImg, setActiveImg] = useState(`/assets/varieties/${product.id}.jpg`);
  const [factsTab, setFactsTab] = useState('profile');
  const [calcOpen, setCalcOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product, selectedPack.label, selectedPack.price, null, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }
  usePageMeta({
    title: product.name + ' — Aamrutham',
    description: product.description,
  });
  const { getAvailable } = useInventory();

  // Auto-select the first in-stock pack once inventory loads.
  useEffect(() => {
    const current = getAvailable(product.id, selectedPack.label);
    if (current === null) return;
    if (current > 0) return;
    const firstAvail = product.packPrices.find(
      (p) => (getAvailable(product.id, p.label) ?? 0) > 0
    );
    if (firstAvail && firstAvail.label !== selectedPack.label) {
      setSelectedPack(firstAvail);
    }
  }, [getAvailable, product, selectedPack.label]);

  const isSoldOut = getAvailable(product.id, selectedPack.label) === 0;

  const allImages = [`/assets/varieties/${product.id}.jpg`, ...(product.extraImages || [])];

  const related = useMemo(() => products.filter((item) => item.category === 'premium' && item.id !== product.id).slice(0, 3), [product.id]);

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setMessage('Please enter a valid 6-digit pincode.');
      setIsValid(false);
      return;
    }
    if (HYD_PINCODES.includes(Number(pincode))) {
      setMessage('Delivery available to your area!');
      setIsValid(true);
    } else {
      setMessage('Sorry, we deliver within Hyderabad only.');
      setIsValid(false);
    }
  };

  return (
    <main>
      <MangoCalculatorDrawer
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        packPrices={product.packPrices}
        onSelectPack={(pack) => setSelectedPack(pack)}
      />
      <section className="section section-cream detail-top">
        <div className="container breadcrumb-row">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Our Mangoes</Link>
          <span>›</span>
          <strong>{product.name}</strong>
        </div>

        <div className="container detail-grid">
          <div className="detail-visual-col">
            <div className="detail-visual" style={{ background: product.gradient }}>
              <img
                src={activeImg}
                alt={product.name}
                className="detail-variety-photo"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <img src="/assets/Subject.png" alt="Aamrutham" className="detail-brand-art" style={{ display: 'none' }} />
              <div className="detail-fruit-mark">{product.name}</div>
            </div>
            {allImages.length > 1 && (
              <div className="detail-thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-thumb${activeImg === img ? ' active' : ''}`}
                    onClick={() => setActiveImg(img)}
                    style={{ background: product.gradient }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-copy">
            <p className="section-eyebrow">{product.heroTag}</p>
            <h1 className="section-title">{product.name}</h1>
            <p className="detail-telugu">{product.telugu} — {product.meaning}</p>

            <div className="detail-badges">
              {product.badges.map((badge) => <span key={badge}>{badge}</span>)}
            </div>

            <div className="detail-price-box">
              <div className="detail-pack-row">
                {product.packPrices.map((pack) => {
                  const sixPack = product.packPrices.find(p => p.label === '6 pcs');
                  const qty = parseInt(pack.label);
                  const sixQty = 6;
                  const savePct = sixPack && qty > sixQty
                    ? Math.round(((sixPack.price / sixQty) - (pack.price / qty)) / (sixPack.price / sixQty) * 100)
                    : null;
                  return (
                    <button
                      key={pack.label}
                      className={`pack-btn ${selectedPack.label === pack.label ? 'selected' : ''}`}
                      onClick={() => setSelectedPack(pack)}
                    >
                      {pack.label}
                      {savePct > 0 && (
                        <span className="pack-save-badge">Save {savePct}%</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button className="calc-nudge" onClick={() => setCalcOpen(true)}>
                🥭 Not sure how many? Use the calculator →
              </button>
              <div className="detail-price">₹{selectedPack.price.toLocaleString('en-IN')}</div>
              <div className="price-note">incl. free delivery</div>
              <p style={{ fontSize: '0.8rem', color: '#3a6b10', background: '#f2f9e8', border: '1px solid #c5e89a', borderRadius: '8px', padding: '0.5rem 0.75rem', marginTop: '0.6rem', lineHeight: 1.55, display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                🌳 <span><strong>Deliveries start May 10th</strong> — the moment our mangoes are ready. We give each fruit the time it needs to ripen fully on the tree, never harvesting early or using artificial ripening agents.</span>
              </p>

              <div className="pincode-row">
                <input
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter Hyderabad pincode"
                />
                <button className="btn btn-outline" onClick={checkPincode}>Check</button>
              </div>
              {message && <p className={`pincode-message ${isValid ? 'ok' : 'error'}`}>{message}</p>}

              <div className="detail-actions">
                {isSoldOut ? (
                  <span className="sold-out-chip sold-out-chip--large">Coming Soon</span>
                ) : (
                  <button
                    className={`btn btn-soft${added ? ' btn--added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={added}
                  >
                    {added ? '✓ Added' : 'Add to cart'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {product.story && (
        <section className="section section-white">
          <div className="container detail-story-grid">
            <div>
              <p className="section-eyebrow">The Story</p>
              <h2 className="section-title">{product.story.heading}</h2>
              <p>{product.story.p1}</p>
              <blockquote>{product.story.quote}</blockquote>
              <p>{product.story.p2}</p>
            </div>

            {/* Specimen card — pulls the most distinctive facts about THIS mango
                so the right column is specific to the variety, not a brand logo. */}
            <aside className="detail-specimen">
              <div className="detail-specimen-photo" style={{ background: product.gradient }}>
                <img
                  src={`/assets/varieties/${product.id}.jpg`}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="detail-specimen-body">
                <p className="detail-specimen-eyebrow">Variety Card</p>
                <h3 className="detail-specimen-name">{product.name}</h3>
                <p className="detail-specimen-telugu">{product.telugu} · <em>{product.meaning}</em></p>

                {product.badges?.length > 0 && (
                  <div className="detail-specimen-tags">
                    {product.badges.slice(0, 4).map((b) => (
                      <span key={b}>{b}</span>
                    ))}
                  </div>
                )}

                {product.profile?.length > 0 && (
                  <dl className="detail-specimen-facts">
                    {product.profile.slice(0, 4).map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </aside>
          </div>
        </section>
      )}

      {(product.profile || product.nutrition || product.storage) && (
        <section className="section section-cream-dark detail-facts-section">
          <div className="container">

            {/* ── Tabbed Profile / Nutrition / Storage ── */}
            <div className="detail-tabs">
              {product.profile  && <button className={`detail-tab-btn${factsTab === 'profile'   ? ' active' : ''}`} onClick={() => setFactsTab('profile')}>🥭 Fruit Profile</button>}
              {product.nutrition && <button className={`detail-tab-btn${factsTab === 'nutrition' ? ' active' : ''}`} onClick={() => setFactsTab('nutrition')}>🌿 Nutrition</button>}
              {product.storage  && <button className={`detail-tab-btn${factsTab === 'storage'   ? ' active' : ''}`} onClick={() => setFactsTab('storage')}>📦 Storage & Care</button>}
            </div>

            {factsTab === 'profile' && product.profile && (
              <div className="detail-tab-panel">
                <div className="profile-grid profile-grid--compact">
                  {product.profile.map(([label, value]) => (
                    <div className="profile-card profile-card--compact" key={label}>
                      <div className="profile-label">{label}</div>
                      <div className="profile-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {factsTab === 'nutrition' && product.nutrition && (
              <div className="detail-tab-panel">
                <div className="nutrition-grid nutrition-grid--compact">
                  {product.nutrition.map(([label, value]) => (
                    <div className="nutrition-item nutrition-item--compact" key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {factsTab === 'storage' && product.storage && (
              <div className="detail-tab-panel">
                <div className="storage-grid storage-grid--compact">
                  {product.storage.map(([title, text]) => (
                    <div className="storage-card storage-card--compact" key={title}>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-chart-wrap">
              <MangoesPerDayChart />
            </div>

          </div>
        </section>
      )}

      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">You Might Also Like</p>
            <h2 className="section-title">More from Aamrutham</h2>
          </div>
          <div className="products-grid related-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
