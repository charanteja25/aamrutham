import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

/** Returns { label, className } for the availability indicator */
function stockBadge(available) {
  if (available === null) return null;              // still loading
  if (available === 0)    return { label: 'Coming Soon', cls: 'stock-badge--out' };
  if (available <= 5)     return { label: `Only ${available} left`, cls: 'stock-badge--low' };
  return null;                                      // plenty — no badge needed
}

export default function ProductCard({ product, showDetails = true }) {
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const [imgFailed, setImgFailed] = useState(false);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();
  const addToCartBtnRef = React.useRef(null);
  const fruitRef = React.useRef(null);

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

  const available = getAvailable(product.id, selectedPack.label);
  const badge     = stockBadge(available);
  const isSoldOut = available === 0;

  return (
    <article className="product-card" data-accent={product.accent}>
      <div className="product-card-visual" style={{ background: product.gradient }}>
        {!imgFailed && (
          <img
            className="product-card-photo"
            src={`/assets/varieties/${product.id}.jpg`}
            alt={product.name}
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="product-card-badge">{product.category === 'premium' ? 'Signature' : 'Variety'}</div>

        {badge && (
          <div className={`stock-badge ${badge.cls}`}>{badge.label}</div>
        )}

        {imgFailed && (
          <div className="product-card-fruit" ref={fruitRef}>🥭</div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-tag">{product.shortTag}</div>
        <h3>{product.name}</h3>
        <p className="product-card-telugu">{product.telugu}</p>
        <p className="product-card-meaning">— {product.meaning}</p>
        <p className="product-card-text">{product.description}</p>

        <div className="product-attrs">
          {product.badges.slice(0, 3).map((b) => (
            <span className="attr-chip" key={b}>{b}</span>
          ))}
        </div>

        {product.packPrices.length > 1 && (
          <div className="pack-selector">
            {product.packPrices.map((pack) => {
              const packAvail = getAvailable(product.id, pack.label);
              const packOut   = packAvail === 0;
              return (
                <button
                  key={pack.label}
                  type="button"
                  className={`pack-btn ${selectedPack.label === pack.label ? 'selected' : ''} ${packOut ? 'pack-btn--out' : ''}`}
                  onClick={() => !packOut && setSelectedPack(pack)}
                  title={packOut ? 'Out of stock' : undefined}
                >
                  {pack.label}
                  {packOut && ' ✕'}
                </button>
              );
            })}
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
          {isSoldOut ? (
            <span className="sold-out-chip" aria-live="polite">Coming Soon</span>
          ) : (
            <button
              ref={addToCartBtnRef}
              className="btn btn-leaf"
              onClick={() =>
                addToCart(product, selectedPack.label, selectedPack.price, fruitRef.current, addToCartBtnRef.current, true)
              }
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
