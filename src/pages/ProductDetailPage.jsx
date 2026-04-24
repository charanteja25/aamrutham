import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { HYD_PINCODES, getProductById, products } from '../data/products';
import { isSeasonPassActive } from '../data/season';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import MangoesPerDayChart from '../components/MangoesPerDayChart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id) || products[0];
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [activeImg, setActiveImg] = useState(`/assets/varieties/${product.id}.jpg`);
  const { addToCart } = useCart();
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
                {product.packPrices.map((pack) => (
                  <button
                    key={pack.label}
                    className={`pack-btn ${selectedPack.label === pack.label ? 'selected' : ''}`}
                    onClick={() => setSelectedPack(pack)}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
              <div className="detail-price">₹{selectedPack.price.toLocaleString('en-IN')}</div>
              <div className="price-note">incl. free delivery</div>

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
                  <button className="btn btn-soft" onClick={() => addToCart(product, selectedPack.label, selectedPack.price, null, true)}>
                    Add to cart
                  </button>
                )}
              </div>

              {isSeasonPassActive() && (() => {
                // Season Pass prices: 12 pcs/wk → ₹2,499; 24 pcs/wk → ₹4,499.
                // Pick the closer tier based on the selected pack size.
                const packPcs = parseInt(selectedPack.label, 10) || 12;
                const passPrice = packPcs >= 18 ? 4499 : 2499;
                const passLabel = packPcs >= 18 ? '24 pcs/week' : '12 pcs/week';
                const fourWeekTotal = selectedPack.price * 4;
                const savings = fourWeekTotal - passPrice;
                if (savings > 200) {
                  return (
                    <Link to="/maas" className="detail-pass-nudge">
                      <span className="detail-pass-nudge-label">⚡ Going heavy on {product.name}?</span>
                      <span className="detail-pass-nudge-body">
                        4 weeks of {selectedPack.label} = ₹{fourWeekTotal.toLocaleString('en-IN')}.
                        {' '}Season Pass ({passLabel}) = ₹{passPrice.toLocaleString('en-IN')}.
                        {' '}<strong>You save ₹{savings.toLocaleString('en-IN')}.</strong>
                      </span>
                    </Link>
                  );
                }
                return (
                  <Link to="/maas" className="detail-pass-nudge">
                    <span className="detail-pass-nudge-label">⚡ Love {product.name}?</span>
                    <span className="detail-pass-nudge-body">
                      Our <strong>Season Pass</strong> sends you this and other rare varieties every week for 4 weeks. →
                    </span>
                  </Link>
                );
              })()}
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

      {(product.profile || product.nutrition) && (
        <section className="section section-cream-dark">
          <div className="container detail-facts-grid">
            {product.profile && (
              <div>
                <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Fruit Profile</p>
                <div className="profile-grid">
                  {product.profile.map(([label, value]) => (
                    <div className="profile-card" key={label}>
                      <div className="profile-label">{label}</div>
                      <div className="profile-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {product.nutrition && (
              <div>
                <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Nutrition · per 100g</p>
                <div className="nutrition-grid compact">
                  {product.nutrition.map(([label, value]) => (
                    <div className="nutrition-item" key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section section-white">
        <div className="container">
          <MangoesPerDayChart />
        </div>
      </section>

      {product.storage && (
        <section className="section section-white">
          <div className="container">
            <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Storage & Care</p>
            <div className="storage-grid">
              {product.storage.map(([title, text]) => (
                <div className="storage-card" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
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
