import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { HYD_PINCODES, getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id) || products[0];
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(null);
  const { addToCart } = useCart();

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
          <div className="detail-visual" style={{ background: product.gradient }}>
            {product.image
              ? <img src={product.image} alt={product.name} className="detail-product-img" />
              : <div className="detail-fruit-mark">{product.name}</div>
            }
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
                <button className="btn btn-soft" onClick={() => addToCart(product, selectedPack.label, selectedPack.price, null, true)}>Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container detail-story-grid">
          <div>
            <p className="section-eyebrow">The Story</p>
            <h2 className="section-title">{product.story.heading}</h2>
            <p>{product.story.p1}</p>
            <blockquote>{product.story.quote}</blockquote>
            <p>{product.story.p2}</p>
          </div>
          <div className="detail-story-art">
            <img src="/assets/aam-final.png" alt="Aamrutham story art" />
          </div>
        </div>
      </section>

      <section className="section section-cream-dark">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">About This Mango</p>
            <h2 className="section-title">Fruit profile</h2>
          </div>
          <div className="profile-grid">
            {product.profile.map(([label, value]) => (
              <div className="profile-card" key={label}>
                <div className="profile-label">{label}</div>
                <div className="profile-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section nutrition-section">
        <div className="container nutrition-box">
          <div className="nutrition-head">
            <p className="section-eyebrow gold">Nutritional Value</p>
            <h2>{product.name}</h2>
            <p>Per 100g · Naturally grown</p>
          </div>
          <div className="nutrition-grid">
            {product.nutrition.map(([label, value]) => (
              <div className="nutrition-item" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">Storage & Care</p>
            <h2 className="section-title">Handle it the right way</h2>
          </div>
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
