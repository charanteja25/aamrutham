import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, showDetails = true }) {
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const { addToCart } = useCart();
  const addToCartBtnRef = React.useRef(null);
  const fruitRef = React.useRef(null);

  const whatsappUrl = useMemo(() => {
    return buildWhatsAppUrl(
      `Hi Aamrutham! I’d like to pre-order *${product.name}* (${selectedPack.label}) 🥭 Could you share availability and pricing?`
    );
  }, [product.name, selectedPack.label]);

  return (
    <article className="product-card" data-accent={product.accent}>
      <div className="product-card-visual" style={{ background: product.gradient }}>
        <div className="product-card-badge">{product.category === 'premium' ? 'Signature' : 'Variety'}</div>
        <div className="product-card-fruit" ref={fruitRef}>🥭</div>
      </div>

      <div className="product-card-body">
        <div className="product-card-tag">{product.shortTag}</div>
        <h3>{product.name}</h3>
        <p className="product-card-telugu">{product.telugu}</p>
        <p className="product-card-meaning">— {product.meaning}</p>
        <p className="product-card-text">{product.description}</p>

        <div className="product-attrs">
          {product.badges.slice(0, 3).map((badge) => (
            <span className="attr-chip" key={badge}>{badge}</span>
          ))}
        </div>

        {product.packPrices.length > 1 && (
          <div className="pack-selector">
            {product.packPrices.map((pack) => (
              <button
                key={pack.label}
                type="button"
                className={`pack-btn ${selectedPack.label === pack.label ? 'selected' : ''}`}
                onClick={() => setSelectedPack(pack)}
              >
                {pack.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-card-footer">
        <div>
          <div className="price">₹{selectedPack.price.toLocaleString('en-IN')}</div>
          <div className="price-note">incl. free delivery</div>
        </div>
        <div className="product-card-actions">
          {showDetails && product.category === 'premium' && (
            <Link className="btn btn-outline" to={`/products/${product.id}`}>Details</Link>
          )}
          <button 
            ref={addToCartBtnRef}
            className="btn btn-soft" 
            onClick={() => addToCart(product, selectedPack.label, selectedPack.price, fruitRef.current, addToCartBtnRef.current, true)}
          >
            Add to cart
          </button>
          <a className="btn btn-leaf" href={whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
