import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

function packWeight(avgWeightGrams, label) {
  const qty = parseInt(label);
  if (!avgWeightGrams || !qty) return null;
  const [min, max] = avgWeightGrams;
  const minKg = (qty * min / 1000).toFixed(1);
  const maxKg = (qty * max / 1000).toFixed(1);
  return min === max ? `~${minKg} kgs` : `~${minKg}–${maxKg} kgs`;
}

function strikePrice(packPrices, selectedPack) {
  const sixPack = packPrices.find(p => p.label === '6 pcs');
  if (!sixPack) return selectedPack.price + 101;
  const sixOriginal = sixPack.price + 101;
  const qty = parseInt(selectedPack.label);
  return sixOriginal * (qty / 6);
}

function savePercent(packPrices, pack) {
  const sixPack = packPrices.find(p => p.label === '6 pcs');
  if (!sixPack || pack.label === '6 pcs') return null;
  const basePerUnit = sixPack.price / 6;
  const qty = parseInt(pack.label);
  const packPerUnit = pack.price / qty;
  const pct = Math.round((basePerUnit - packPerUnit) / basePerUnit * 100);
  return pct > 0 ? pct : null;
}

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
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();
  const addToCartBtnRef = React.useRef(null);
  const fruitRef = React.useRef(null);

  function handleAddToCart() {
    addToCart(product, selectedPack.label, selectedPack.price, addToCartBtnRef.current, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

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
    <article className="product-card" data-accent={product.accent} data-product={product.id}>
      <div className="product-card-visual" style={{ background: product.gradient }}>
        {!imgFailed && (
          <img
            className="product-card-photo"
            src={`/assets/varieties/${product.id}.jpg`}
            alt={product.name}
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="product-card-badge">{product.category === 'premium' ? 'Signature' : 'Exotic'}</div>

        {badge && (
          <div className={`stock-badge ${badge.cls}`}>{badge.label}</div>
        )}

        {isSoldOut && (
          <div className="product-card-soldout-overlay">Sold Out</div>
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
                  className={`pack-btn ${selectedPack.label === pack.label ? 'selected' : ''} ${packOut ? 'pack-btn--out' : ''}${pack.label === '12 pcs' ? ' most-bought' : ''}`}
                  onClick={() => !packOut && setSelectedPack(pack)}
                  title={packOut ? 'Out of stock' : undefined}
                >
                  {pack.label === '12 pcs' && <span className="pack-most-bought-badge">Our Pick</span>}
                  {pack.label === '18 pcs' && <span className="pack-most-bought-badge pack-best-value-badge">Best Value</span>}
                  {pack.label}
                  {packWeight(product.avgWeightGrams, pack.label) && (
                    <span style={{ color: 'var(--mango-dark)', fontWeight: 700, fontSize: '0.78rem' }}>
                      {' '}({packWeight(product.avgWeightGrams, pack.label)})
                    </span>
                  )}
                  {packOut && ' ✕'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="product-card-footer">
        <div>
          <div className="price" style={isSoldOut ? { opacity: 0.4, textDecoration: 'line-through' } : {}}>
            <span style={{ textDecoration: 'line-through', color: '#aaa', fontWeight: 400, fontSize: '0.9rem', marginRight: '0.3rem' }}>
              ₹{strikePrice(product.packPrices, selectedPack).toLocaleString('en-IN')}
            </span>
            ₹{selectedPack.price.toLocaleString('en-IN')}
          </div>
          <Link to="/pricing" className="pricing-link">ℹ️ Why this price?</Link>
          <div className="price-note">
            {selectedPack.price < 500
              ? 'Delivery fee applicable for orders below ₹500'
              : 'incl. free delivery'}
          </div>
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
              className={`btn btn-leaf${added ? ' btn--added' : ''}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? '✓ Added' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
