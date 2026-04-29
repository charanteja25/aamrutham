import React, { useState } from 'react';

const VARIETIES = [
  { id: 'mettavalasa-peechu', name: 'Mettavalasa Peechu', telugu: 'మెట్టవలస పీచు' },
  { id: 'bobbili-peechu',     name: 'Bobbili Peechu',     telugu: 'బొబ్బిలి పీచు' },
  { id: 'panduri-mavidi',     name: 'Panduri Mavidi',     telugu: 'పాండురి మావిడి' },
  { id: 'kothapalli-kobbari', name: 'Kothapalli Kobbari', telugu: 'కొత్తపల్లి కొబ్బరి' },
  { id: 'imam-pasand',        name: 'Imam Pasand',        telugu: 'ఇమామ్ పసంద్' },
  { id: 'suvarnarekha',       name: 'Suvarnarekha',       telugu: 'సువర్ణరేఖ' },
  { id: 'banganapalli',       name: 'Banganapalli',       telugu: 'బంగినపల్లి' },
  { id: 'chinna-rasalu',      name: 'Chinna Rasalu',      telugu: 'చిన్న రసాలు' },
  { id: 'pedda-rasalu',       name: 'Pedda Rasalu',       telugu: 'పెద్ద రసాలు' },
];

const WA_NUMBER = '919177266273';

export default function BulkEnquiryPage() {
  const [name,    setName]    = useState('');
  const [mobile,  setMobile]  = useState('');
  const [email,   setEmail]   = useState('');
  const [selected, setSelected] = useState({});  // { varietyId: qty }
  const [errors,  setErrors]  = useState({});

  function toggleVariety(id) {
    setSelected(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = '';
      }
      return next;
    });
  }

  function setQty(id, val) {
    setSelected(prev => ({ ...prev, [id]: val.replace(/\D/g, '') }));
  }

  function validate() {
    const e = {};
    if (!name.trim())                          e.name   = 'Please enter your name.';
    if (!/^\d{10}$/.test(mobile))             e.mobile = 'Please enter a valid 10-digit mobile number.';
    if (email && !/\S+@\S+\.\S+/.test(email)) e.email  = 'Please enter a valid email address.';
    if (Object.keys(selected).length === 0)   e.variety = 'Please select at least one variety.';
    Object.entries(selected).forEach(([id, qty]) => {
      if (!qty || Number(qty) < 1) e[`qty_${id}`] = 'Enter quantity.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const varietyLines = Object.entries(selected)
      .map(([id, qty]) => {
        const v = VARIETIES.find(v => v.id === id);
        return `  • ${v.name}: ${qty} pcs`;
      })
      .join('\n');

    const msg = [
      `Hi Aamrutham! I'd like to place a *bulk enquiry* 🥭`,
      ``,
      `*Name:* ${name.trim()}`,
      `*Mobile:* +91 ${mobile}`,
      email ? `*Email:* ${email}` : null,
      ``,
      `*Varieties required:*`,
      varietyLines,
      ``,
      `Please get in touch with me. Thank you!`,
    ].filter(l => l !== null).join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const selectedCount = Object.keys(selected).length;

  return (
    <main>
      {/* Hero */}
      <section className="bulk-hero">
        <div className="bulk-hero-dots" aria-hidden="true" />
        <div className="container bulk-hero-inner">
          <span className="bulk-eyebrow">✦ For Offices · Events · Gifting · Resellers</span>
          <h1 className="bulk-title">Bulk <em>Mango Enquiry</em></h1>
          <p className="bulk-sub">
            Ordering for a large family, corporate gifting, or an event?
            Tell us what you need and we'll get back to you with pricing and availability.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section section-cream">
        <div className="container bulk-form-wrap">
          <form className="bulk-form" onSubmit={handleSubmit} noValidate>

            {/* Contact details */}
            <div className="bulk-section-label">Your Details</div>
            <div className="bulk-fields-row">
              <div className="bulk-field">
                <label className="bulk-label">Full Name *</label>
                <input
                  className={`bulk-input${errors.name ? ' bulk-input--error' : ''}`}
                  type="text" placeholder="e.g. Ravi Kumar"
                  value={name} onChange={e => setName(e.target.value)}
                />
                {errors.name && <span className="bulk-error">{errors.name}</span>}
              </div>
              <div className="bulk-field">
                <label className="bulk-label">Mobile Number *</label>
                <div className="bulk-phone-wrap">
                  <span className="bulk-prefix">🇮🇳 +91</span>
                  <input
                    className={`bulk-input bulk-input--phone${errors.mobile ? ' bulk-input--error' : ''}`}
                    type="tel" placeholder="9876543210" maxLength={10}
                    value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
                {errors.mobile && <span className="bulk-error">{errors.mobile}</span>}
              </div>
              <div className="bulk-field">
                <label className="bulk-label">Email <span className="bulk-optional">(optional)</span></label>
                <input
                  className={`bulk-input${errors.email ? ' bulk-input--error' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
                {errors.email && <span className="bulk-error">{errors.email}</span>}
              </div>
            </div>

            {/* Variety selection */}
            <div className="bulk-section-label" style={{ marginTop: '2rem' }}>
              Select Varieties *
              {selectedCount > 0 && <span className="bulk-selected-count">{selectedCount} selected</span>}
            </div>
            {errors.variety && <span className="bulk-error" style={{ marginBottom: '0.75rem', display: 'block' }}>{errors.variety}</span>}

            <div className="bulk-variety-grid">
              {VARIETIES.map(v => {
                const isSelected = selected[v.id] !== undefined;
                return (
                  <div key={v.id} className={`bulk-variety-card${isSelected ? ' bulk-variety-card--selected' : ''}`}>
                    <button
                      type="button"
                      className="bulk-variety-btn"
                      onClick={() => toggleVariety(v.id)}
                    >
                      <span className="bulk-variety-check">{isSelected ? '✓' : '+'}</span>
                      <span className="bulk-variety-name">{v.name}</span>
                      <span className="bulk-variety-telugu">{v.telugu}</span>
                    </button>
                    {isSelected && (
                      <div className="bulk-qty-row">
                        <label className="bulk-qty-label">Qty (pcs)</label>
                        <input
                          className={`bulk-qty-input${errors[`qty_${v.id}`] ? ' bulk-input--error' : ''}`}
                          type="number" min="1" placeholder="e.g. 50"
                          value={selected[v.id]}
                          onChange={e => setQty(v.id, e.target.value)}
                        />
                        {errors[`qty_${v.id}`] && <span className="bulk-error">{errors[`qty_${v.id}`]}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {selectedCount > 0 && (
              <div className="bulk-summary">
                <div className="bulk-summary-label">Order Summary</div>
                {Object.entries(selected).map(([id, qty]) => {
                  const v = VARIETIES.find(v => v.id === id);
                  return (
                    <div className="bulk-summary-row" key={id}>
                      <span>{v.name}</span>
                      <span>{qty ? `${qty} pcs` : '— enter qty'}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="bulk-submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.117 1.532 5.845L.054 23.486a.5.5 0 00.611.611l5.641-1.478A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-4.983-1.358l-.356-.213-3.688.966.983-3.595-.233-.37A9.795 9.795 0 012.182 12C2.182 6.569 6.569 2.182 12 2.182S21.818 6.569 21.818 12 17.431 21.818 12 21.818z"/>
              </svg>
              Send Enquiry on WhatsApp
            </button>
            <p className="bulk-wa-note">You'll be redirected to WhatsApp with your enquiry pre-filled.</p>

          </form>
        </div>
      </section>
    </main>
  );
}
