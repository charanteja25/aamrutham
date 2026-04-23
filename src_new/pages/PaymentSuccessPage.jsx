import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function FarmToDoorJourney() {
  const steps = [
    {
      id: 1,
      label: 'Handpicked',
      sublabel: 'From our orchard',
      icon: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tree trunk */}
          <rect x="36" y="52" width="8" height="18" rx="2" fill="#7a4f2e" />
          {/* Ground */}
          <ellipse cx="40" cy="70" rx="14" ry="4" fill="#4a7c2f" opacity="0.4" />
          {/* Tree canopy layers */}
          <ellipse cx="40" cy="42" rx="22" ry="18" fill="#4a7c2f" />
          <ellipse cx="40" cy="34" rx="16" ry="14" fill="#2d5016" />
          <ellipse cx="40" cy="26" rx="11" ry="10" fill="#4a7c2f" />
          {/* Mangoes on tree */}
          <ellipse cx="28" cy="40" rx="5" ry="6" fill="#f5a623" />
          <ellipse cx="52" cy="38" rx="5" ry="6" fill="#e07b39" />
          <ellipse cx="40" cy="44" rx="4" ry="5" fill="#f5a623" />
          {/* Farmer figure */}
          <circle cx="16" cy="38" r="5" fill="#d4956a" />
          <rect x="12" y="43" width="8" height="12" rx="3" fill="#2d5016" />
          <line x1="20" y1="45" x2="27" y2="40" stroke="#d4956a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="45" x2="10" y2="52" stroke="#d4956a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="55" x2="13" y2="64" stroke="#2d5016" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="55" x2="20" y2="64" stroke="#2d5016" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hat */}
          <ellipse cx="16" cy="34" rx="7" ry="2.5" fill="#f5a623" />
          <rect x="14" y="30" width="4" height="4" rx="1" fill="#e07b39" />
        </svg>
      ),
    },
    {
      id: 2,
      label: 'Sorted & Graded',
      sublabel: 'Only the best',
      icon: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Table */}
          <rect x="10" y="48" width="60" height="6" rx="2" fill="#c4986a" />
          <rect x="16" y="54" width="6" height="14" rx="2" fill="#a07850" />
          <rect x="58" y="54" width="6" height="14" rx="2" fill="#a07850" />
          {/* Mangoes being sorted - row */}
          <ellipse cx="26" cy="44" rx="7" ry="8" fill="#f5a623" />
          <ellipse cx="40" cy="42" rx="8" ry="9" fill="#e07b39" />
          <ellipse cx="55" cy="44" rx="7" ry="8" fill="#f5a623" />
          {/* Mango stems */}
          <line x1="26" y1="36" x2="28" y2="30" stroke="#4a7c2f" strokeWidth="2" />
          <line x1="40" y1="33" x2="42" y2="27" stroke="#4a7c2f" strokeWidth="2" />
          <line x1="55" y1="36" x2="57" y2="30" stroke="#4a7c2f" strokeWidth="2" />
          {/* Checkmark on middle mango */}
          <circle cx="40" cy="42" r="5" fill="white" opacity="0.85" />
          <polyline points="37,42 39.5,45 44,38" stroke="#2d5016" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Star/sparkle on left */}
          <text x="30" y="24" fontSize="10" fill="#f5a623">✦</text>
        </svg>
      ),
    },
    {
      id: 3,
      label: 'Packed with Care',
      sublabel: 'Ripened naturally',
      icon: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Box body */}
          <rect x="14" y="36" width="52" height="34" rx="4" fill="#e8c99a" />
          {/* Box top flaps */}
          <path d="M14 36 L14 24 L38 30 L38 36 Z" fill="#d4a870" />
          <path d="M66 36 L66 24 L42 30 L42 36 Z" fill="#c49050" />
          {/* Box stripe */}
          <rect x="14" y="50" width="52" height="4" fill="#c49050" />
          {/* Ribbon */}
          <rect x="37" y="36" width="6" height="34" fill="#e07b39" opacity="0.6" />
          {/* Mangoes visible inside (peeking over top) */}
          <ellipse cx="30" cy="36" rx="8" ry="6" fill="#f5a623" />
          <ellipse cx="50" cy="36" rx="8" ry="6" fill="#e07b39" />
          {/* Leaf sprigs */}
          <ellipse cx="28" cy="28" rx="5" ry="3" fill="#4a7c2f" transform="rotate(-20 28 28)" />
          <ellipse cx="48" cy="28" rx="5" ry="3" fill="#2d5016" transform="rotate(20 48 28)" />
          {/* Hearts */}
          <text x="10" y="22" fontSize="12">💚</text>
          <text x="56" y="20" fontSize="10">🌿</text>
        </svg>
      ),
    },
    {
      id: 4,
      label: 'Out for Delivery',
      sublabel: 'Coming your way',
      icon: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Road */}
          <rect x="0" y="58" width="80" height="8" rx="0" fill="#d0c4b0" />
          <rect x="0" y="58" width="80" height="2" fill="#c0b4a0" />
          {/* Road dashes */}
          <rect x="10" y="61" width="12" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="34" y="61" width="12" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="58" y="61" width="12" height="2" rx="1" fill="white" opacity="0.6" />
          {/* Van body */}
          <rect x="8" y="36" width="50" height="22" rx="4" fill="#2d5016" />
          {/* Van cab */}
          <path d="M58 42 L58 58 L68 58 L68 46 Q68 40 62 40 Z" fill="#4a7c2f" />
          {/* Windows */}
          <rect x="14" y="40" width="18" height="12" rx="3" fill="#a8d8ea" opacity="0.9" />
          <rect x="36" y="40" width="14" height="12" rx="3" fill="#a8d8ea" opacity="0.9" />
          <rect x="60" y="42" width="6" height="8" rx="2" fill="#a8d8ea" opacity="0.9" />
          {/* Wheels */}
          <circle cx="22" cy="60" r="7" fill="#2c1810" />
          <circle cx="22" cy="60" r="4" fill="#888" />
          <circle cx="56" cy="60" r="7" fill="#2c1810" />
          <circle cx="56" cy="60" r="4" fill="#888" />
          {/* Aamrutham text on van */}
          <rect x="10" y="50" width="44" height="6" rx="1" fill="#f5a623" opacity="0.9" />
          <text x="32" y="55.5" fontSize="5.5" fill="#2c1810" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AAMRUTHAM</text>
          {/* Motion lines */}
          <line x1="0" y1="44" x2="6" y2="44" stroke="#f5a623" strokeWidth="2" strokeDasharray="2,2" opacity="0.7" />
          <line x1="0" y1="48" x2="4" y2="48" stroke="#f5a623" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: 5,
      label: 'At Your Doorstep',
      sublabel: 'Enjoy the harvest!',
      icon: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* House */}
          <polygon points="40,8 72,32 8,32" fill="#e07b39" />
          <rect x="14" y="32" width="52" height="36" rx="2" fill="#fef8f0" />
          {/* Door */}
          <rect x="31" y="46" width="18" height="22" rx="3" fill="#c49050" />
          <circle cx="46" cy="57" r="2" fill="#e07b39" />
          {/* Windows */}
          <rect x="16" y="38" width="14" height="12" rx="2" fill="#a8d8ea" opacity="0.9" />
          <rect x="50" y="38" width="14" height="12" rx="2" fill="#a8d8ea" opacity="0.9" />
          {/* Mango box at door */}
          <rect x="26" y="62" width="18" height="14" rx="2" fill="#e8c99a" />
          <rect x="26" y="68" width="18" height="3" fill="#c49050" />
          {/* Small mango peeking out */}
          <ellipse cx="35" cy="62" rx="6" ry="5" fill="#f5a623" />
          {/* Tree beside house */}
          <rect x="66" y="54" width="5" height="14" rx="1" fill="#7a4f2e" />
          <ellipse cx="68" cy="46" rx="9" ry="11" fill="#4a7c2f" />
          <ellipse cx="66" cy="42" rx="6" ry="7" fill="#2d5016" />
          {/* Sparkles */}
          <text x="4" y="24" fontSize="10">✨</text>
          <text x="62" y="16" fontSize="8">🌞</text>
        </svg>
      ),
    },
  ];

  return (
    <div className="journey-wrap">
      <div className="journey-steps">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="journey-step">
              <div className="journey-icon">{step.icon}</div>
              <div className="journey-step-label">{step.label}</div>
              <div className="journey-step-sub">{step.sublabel}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="journey-connector" aria-hidden="true">
                <svg width="32" height="16" viewBox="0 0 32 16">
                  <path d="M2 8 Q16 2 30 8" stroke="#f5a623" strokeWidth="2" fill="none" strokeDasharray="4,3" />
                  <polygon points="27,5 31,8 27,11" fill="#f5a623" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const { clearCart } = useCart();

  const paymentId = params.get('payment_id') || params.get('razorpay_payment_id');
  const orderId = params.get('order_id') || params.get('razorpay_order_id');

  useEffect(() => {
    // Clear cart on successful payment
    clearCart?.();
  }, []);

  return (
    <div className="payment-page payment-success-page">
      {/* Confetti dots */}
      <div className="confetti-bg" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <span key={i} className={`confetti-dot confetti-dot-${(i % 4) + 1}`} style={{ '--i': i }} />
        ))}
      </div>

      <div className="payment-page-inner">
        {/* Success badge */}
        <div className="payment-badge payment-badge-success">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#2d5016" />
            <polyline points="16,28 24,36 40,20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <p className="payment-eyebrow">Order Confirmed</p>
        <h1 className="payment-title">Your Mangoes Are on Their Way!</h1>
        <p className="payment-subtitle">
          Thank you for choosing Aamrutham. Pure, sun-ripened goodness from our farm
          is making its journey straight to your doorstep.
        </p>

        {(paymentId || orderId) && (
          <div className="payment-ref-box">
            {paymentId && <span>Payment ID: <strong>{paymentId}</strong></span>}
            {orderId && <span>Order ID: <strong>{orderId}</strong></span>}
          </div>
        )}

        {/* Farm to door journey */}
        <div className="journey-section">
          <h2 className="journey-title">From Our Farm to Your Table</h2>
          <p className="journey-desc">Every mango you ordered has traveled this path — grown with love, picked by hand, packed with care.</p>
          <FarmToDoorJourney />
        </div>

        <div className="payment-actions">
          <Link to="/products" className="btn btn-leaf">
            Continue Shopping
          </Link>
          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>

        <p className="payment-footnote">
          Questions? WhatsApp us at <strong>+91 91772 66273</strong> with your order details.
        </p>
      </div>
    </div>
  );
}
