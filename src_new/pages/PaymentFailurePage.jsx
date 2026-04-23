import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function SadMangoIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="failure-illustration"
      aria-label="Sad mango in the rain"
    >
      {/* Dark cloud left */}
      <ellipse cx="60" cy="55" rx="38" ry="24" fill="#b0b8c5" />
      <ellipse cx="82" cy="48" rx="28" ry="20" fill="#c5cdd8" />
      <ellipse cx="44" cy="60" rx="22" ry="16" fill="#b0b8c5" />

      {/* Dark cloud right */}
      <ellipse cx="255" cy="50" rx="36" ry="22" fill="#b0b8c5" />
      <ellipse cx="270" cy="44" rx="26" ry="18" fill="#c5cdd8" />
      <ellipse cx="240" cy="55" rx="20" ry="14" fill="#b0b8c5" />

      {/* Rain lines */}
      {[30, 45, 58, 70, 82, 96, 240, 254, 266, 278, 290].map((x, i) => (
        <line
          key={i}
          x1={x} y1={76 + (i % 3) * 6}
          x2={x - 4} y2={106 + (i % 3) * 6}
          stroke="#7090b8" strokeWidth="1.5" strokeLinecap="round"
          opacity={0.55 + (i % 3) * 0.1}
        />
      ))}

      {/* Ground / puddle */}
      <ellipse cx="160" cy="220" rx="90" ry="10" fill="#c8d8e8" opacity="0.5" />

      {/* Sad tree - bare branches */}
      <rect x="148" y="140" width="10" height="60" rx="3" fill="#7a4f2e" />
      {/* Branches */}
      <line x1="148" y1="175" x2="120" y2="148" stroke="#7a4f2e" strokeWidth="5" strokeLinecap="round" />
      <line x1="120" y1="148" x2="108" y2="132" stroke="#7a4f2e" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="120" y1="148" x2="112" y2="152" stroke="#7a4f2e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="158" y1="168" x2="188" y2="144" stroke="#7a4f2e" strokeWidth="5" strokeLinecap="round" />
      <line x1="188" y1="144" x2="200" y2="128" stroke="#7a4f2e" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="188" y1="144" x2="196" y2="154" stroke="#7a4f2e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="153" y1="155" x2="153" y2="130" stroke="#7a4f2e" strokeWidth="4" strokeLinecap="round" />

      {/* Fallen mango on ground */}
      <ellipse cx="130" cy="210" rx="18" ry="14" fill="#e07b39" opacity="0.7" />
      <ellipse cx="130" cy="210" rx="18" ry="14" fill="#f5a623" opacity="0.6" />
      <line x1="130" y1="196" x2="134" y2="188" stroke="#4a7c2f" strokeWidth="2" strokeLinecap="round" />

      {/* Sad mango character (center) */}
      {/* Mango body */}
      <ellipse cx="160" cy="162" rx="34" ry="40" fill="#f5a623" />
      <ellipse cx="160" cy="162" rx="34" ry="40" fill="url(#mangoGrad)" />
      <defs>
        <radialGradient id="mangoGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffd070" />
          <stop offset="100%" stopColor="#e07b39" />
        </radialGradient>
      </defs>

      {/* Stem + leaf */}
      <line x1="162" y1="122" x2="166" y2="108" stroke="#4a7c2f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="172" cy="104" rx="10" ry="5" fill="#4a7c2f" transform="rotate(20 172 104)" />

      {/* Sad face */}
      {/* Eyes - droopy */}
      <ellipse cx="150" cy="155" rx="4" ry="5" fill="#2c1810" />
      <ellipse cx="170" cy="155" rx="4" ry="5" fill="#2c1810" />
      {/* Eyebrow droop */}
      <path d="M145 146 Q150 150 155 148" stroke="#2c1810" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M165 148 Q170 150 175 146" stroke="#2c1810" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tear drops */}
      <ellipse cx="148" cy="164" rx="2.5" ry="3.5" fill="#7090b8" opacity="0.8" />
      <ellipse cx="172" cy="163" rx="2.5" ry="3.5" fill="#7090b8" opacity="0.8" />
      {/* Sad mouth */}
      <path d="M150 174 Q160 168 170 174" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Umbrella (comforting element) */}
      <path d="M200 100 Q220 72 240 100" stroke="#e07b39" strokeWidth="3" fill="#f5a623" fillOpacity="0.85" />
      <line x1="220" y1="100" x2="220" y2="126" stroke="#e07b39" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M220 126 Q220 134 214 134" stroke="#e07b39" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Small flowers still alive (hope) */}
      <circle cx="280" cy="205" r="6" fill="#ffd070" />
      <circle cx="280" cy="205" r="3" fill="#e07b39" />
      <line x1="280" y1="211" x2="280" y2="222" stroke="#4a7c2f" strokeWidth="2" />
      <ellipse cx="275" cy="218" rx="5" ry="3" fill="#4a7c2f" transform="rotate(-20 275 218)" />
    </svg>
  );
}

export default function PaymentFailurePage() {
  const [params] = useSearchParams();
  const errorCode = params.get('error_code');
  const errorDesc = params.get('error_description') || params.get('error_reason');

  const errorMessages = {
    BAD_REQUEST_ERROR: 'The payment request was invalid. Please try again.',
    GATEWAY_ERROR: 'Payment gateway encountered an issue. Please try after some time.',
    SERVER_ERROR: 'Something went wrong on our end. Your money is safe — please try again.',
  };

  const displayError = errorCode
    ? errorMessages[errorCode] || errorDesc
    : 'The payment could not be completed. No amount has been deducted.';

  return (
    <div className="payment-page payment-failure-page">
      <div className="payment-page-inner">
        {/* Failure badge */}
        <div className="payment-badge payment-badge-failure">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#c0392b" />
            <line x1="18" y1="18" x2="38" y2="38" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <line x1="38" y1="18" x2="18" y2="38" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <p className="payment-eyebrow payment-eyebrow-failure">Payment Unsuccessful</p>
        <h1 className="payment-title">Oops! The Mangoes Are Still Waiting</h1>
        <p className="payment-subtitle">
          Don't worry — no amount has been deducted. Your cart is saved and the mangoes are
          still hanging from our trees, waiting for you.
        </p>

        {displayError && (
          <div className="payment-error-box">
            <span className="payment-error-icon">⚠</span>
            {displayError}
          </div>
        )}

        <SadMangoIllustration />

        <div className="failure-comfort">
          <p>
            The sun comes out after every rain — and your order can too.
            Try paying again, or place your order directly via WhatsApp.
          </p>
        </div>

        <div className="payment-actions">
          <Link to="/products" className="btn btn-gold">
            Try Again
          </Link>
          <a
            href="https://wa.me/919177266273?text=Hi%20Aamrutham!%20I%20tried%20to%20place%20an%20order%20but%20payment%20failed.%20Can%20you%20help%20me%20complete%20it%3F"
            className="btn btn-whatsapp-large"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Order via WhatsApp
          </a>
          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>

        <p className="payment-footnote">
          Need help? Call or WhatsApp us at <strong>+91 91772 66273</strong>
        </p>
      </div>
    </div>
  );
}
