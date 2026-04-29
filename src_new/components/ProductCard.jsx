import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

/** Returns { label, className } for the availability indicator */
function stockBadge(available) {
  if (available === null) return null;              // still loading
  if (available === 0)    return { label: 'Sold out',   cls: 'stock-badge--out'    };
  if (available <= 5)     return { label: `Only ${available} left`, cls: 'stock-badge--low' };
  return null;                                      // plenty — no badge needed
}

function packWeight(avgWeightGrams, label) {
  const qty = parseInt(label);
  if (!avgWeightGrams || !qty) return null;
  const [min, max] = avgWeightGrams;
  const minKg = (qty * min / 1000).toFixed(1);
  const maxKg = (qty * max / 1000).toFixed(1);
  return min === max ? `~${minKg} kg` : `~${minKg}–${maxKg} kg`;
}

export default function ProductCard({ product, showDetails = true }) {
  const [selectedPack, setSelectedPack] = useState(product.packPrices[0]);
  const { addToCart } = useCart();
  const { getAvailable } = useInventory();
  const addToCartBtnRef = React.useRef(null);
  const fruitRef = React.useRef(null);

  const available = getAvailable(product.id, selectedPack.label);
  const badge     = stockBadge(available);
  const isSoldOut = available === 0;

  return (
    <article className="product-card" data-accent={product.accent}>
      <div className="product-card-visual" style={{ background: product.gradient }}>
        <div className="product-card-badge">{product.category === 'premium' ? 'Signature' : 'Variety'}</div>

        {badge && (
          <div className={`stock-badge ${badge.cls}`}>{badge.label}</div>
        )}

        <div className="product-card-fruit" ref={fruitRef}>🥭</div>
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
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
                >
                  <span>{pack.label}{packOut ? ' ✕' : ''}</span>
                  {packWeight(product.avgWeightGrams, pack.label) && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 400, opacity: 0.65 }}>
                      {packWeight(product.avgWeightGrams, pack.label)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {product.avgWeightGrams && (
          <div style={{ fontSize: '0.78rem', opacity: 0.5, marginTop: '0.25rem' }}>
            {product.avgWeightGrams[0] === product.avgWeightGrams[1]
              ? `Each mango: ~${product.avgWeightGrams[0]}g`
              : `Each mango: ~${product.avgWeightGrams[0]}–${product.avgWeightGrams[1]}g`}
          </div>
        )}
      </div>

      <div className="product-card-footer">
        <div>
          <div className="price">₹{selectedPack.price.toLocaleString('en-IN')}</div>
          {packWeight(product.avgWeightGrams, selectedPack.label) && (
            <div style={{ fontSize: '0.78rem', opacity: 0.55, marginBottom: '0.15rem' }}>
              {packWeight(product.avgWeightGrams, selectedPack.label)} total weight
            </div>
          )}
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
          <button
            ref={addToCartBtnRef}
            className="btn btn-leaf"
            disabled={isSoldOut}
            style={isSoldOut ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            onClick={() =>
              !isSoldOut &&
              addToCart(product, selectedPack.label, selectedPack.price, fruitRef.current, addToCartBtnRef.current, true)
            }
          >
            {isSoldOut ? 'Sold Out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
