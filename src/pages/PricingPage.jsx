import React from 'react';
import { Link } from 'react-router-dom';

const COSTS = [
  {
    icon: '🥭',
    title: 'Low yield, high quality',
    desc: 'A naturally farmed heritage tree gives 60–80 mangoes a season — not 300. Fewer fruits, but every single one is exceptional in taste, texture, and nutrition. You\'re not getting quantity. You\'re getting the best of what the tree has.',
    featured: true,
  },
  { icon: '🌱', title: 'Farming cost', desc: 'Natural inputs like Jeevamrutham and Panchagavya take time and effort to prepare every season. There are no shortcuts — and that\'s exactly the point.' },
  { icon: '🌍', title: 'Soil investment', desc: 'Building soil fertility the organic way takes years and money. We don\'t extract from the land — we invest in it every season.' },
  { icon: '👐', title: 'Labour', desc: 'Natural farming is human-intensive. Picking, sorting, checking ripeness — all done by hand. No machines cutting corners.' },
  { icon: '📦', title: 'Eco-friendly packaging', desc: 'We use plastic-free packaging alternatives. Each mango is individually cushioned. Because what\'s inside is chemical-free — the outside should be too.' },
  { icon: '🚚', title: 'Delivery', desc: 'Farm-to-door from Bobbili to Hyderabad. No cold chain shortcuts. We want it reaching you the way we\'d want it ourselves.' },
];

const SUPERMARKET = [
  'Unknown chemical usage',
  'Carbide or forced ripening',
  'Cold-storage, weeks old',
  'No traceability, no farmer',
  'Common commercial varieties only',
  'Soil health ignored',
];

const AAMRUTHAM = [
  'Zero chemicals, SPNF natural farming',
  'Tree-ripened, no artificial agents',
  'Shipped within days of harvest',
  'Direct from our farms in Bobbili',
  'Rare GI-tagged heritage varieties',
  'Long-term soil investment, 100% solar',
];

export default function PricingPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="pricing-hero">
        <div className="pricing-hero-dots" aria-hidden="true" />
        <div className="container pricing-hero-inner">
          <span className="pricing-eyebrow">✦ Pricing Transparency</span>
          <h1 className="pricing-title">Why does Aamrutham<br /><em>cost what it costs?</em></h1>
          <p className="pricing-sub">
            We get this question. And honestly — you deserve a real answer, not marketing language. So here it is.
          </p>
        </div>
      </section>

      {/* ── What goes into every box ── */}
      <section className="section section-cream">
        <div className="container">
          <div className="pricing-section-head" data-aos="fade-up">
            <span className="section-eyebrow">✦ What goes into every box</span>
            <h2 className="section-title">The <em>Real</em> Cost Breakdown</h2>
            <p className="section-subtitle">Every rupee you pay goes somewhere. Here's exactly where.</p>
          </div>

          <div className="pricing-cost-grid" data-aos="fade-up">
            {COSTS.map(({ icon, title, desc, featured }) => (
              <div key={title} className={`pricing-cost-card${featured ? ' pricing-cost-card--featured' : ''}`}>
                <div className="pricing-cost-icon">{icon}</div>
                <h3 className="pricing-cost-title">{title}</h3>
                <p className="pricing-cost-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hardship nobody talks about ── */}
      <section className="section section-white">
        <div className="container narrow">
          <div className="pricing-block" data-aos="fade-up">
            <h2 className="pricing-block-title">The hardship nobody talks about</h2>
            <p className="pricing-block-body">
              Natural farming sounds beautiful on paper. In practice, it means you lose sleep when pests show up
              and you have no chemical to reach for. It means some seasons your yield drops by half. No insurance.
              No safety net. You just absorb it and hope the next season is better. The price you see is not us
              making a margin — it's us keeping this alive.
            </p>
          </div>

          <div className="pricing-block" data-aos="fade-up">
            <h2 className="pricing-block-title">Heritage varieties are rare by design</h2>
            <p className="pricing-block-body">
              Panduri Mamidi, Kothapalli Kobbari, Bobbili Peechu, Mettavalasa Peechu, Imam Pasand — these varieties
              bruise easily, ripen fast, and don't survive commercial supply chains. So no one farms them at scale.
              They survive only because small farmers like us grow them. When you buy a box, you're not just buying
              fruit. You're helping keep these varieties alive.
            </p>
          </div>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="section section-cream-dark">
        <div className="container">
          <div className="pricing-section-head" data-aos="fade-up">
            <span className="section-eyebrow">✦ Side by side</span>
            <h2 className="section-title">Aamrutham vs. <em>Supermarket Mango</em></h2>
          </div>

          <div className="pricing-compare-row" data-aos="fade-up">
            <div className="pricing-compare-card">
              <span className="pricing-compare-tag pricing-compare-tag--super">Supermarket mango</span>
              <p className="pricing-compare-price">~₹200 <span>/ kg</span></p>
              <ul className="pricing-compare-list">
                {SUPERMARKET.map(item => (
                  <li key={item}><span className="pricing-dot pricing-dot--no">✕</span>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pricing-compare-card pricing-compare-card--ours">
              <span className="pricing-compare-tag pricing-compare-tag--ours">Aamrutham</span>
              <p className="pricing-compare-price pricing-compare-price--ours">Premium <span>/ kg</span></p>
              <ul className="pricing-compare-list">
                {AAMRUTHAM.map(item => (
                  <li key={item}><span className="pricing-dot pricing-dot--yes">✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pricing-conviction" data-aos="fade-up">
            <span className="pricing-conviction-mark">"</span>
            <p>
              The ₹200 supermarket mango is not cheaper. The real costs — soil damage, chemical residue,
              your health — are just hidden. We'd rather be honest about ours upfront.
            </p>
          </div>
        </div>
      </section>

      {/* ── Conviction ── */}
      <section className="section section-white">
        <div className="container narrow">
          <div className="pricing-block" data-aos="fade-up">
            <h2 className="pricing-block-title">We are convicted to bring you good food</h2>
            <p className="pricing-block-body">
              Not food that looks good in a photo. Not food that travelled three weeks in a cold chain.
              Food that is actually good — free from adulteration, free from chemicals, farmed the way our
              grandfathers farmed before shortcuts became normal. That conviction comes with a cost.
              We won't apologise for it.
            </p>
          </div>

          <div className="pricing-close" data-aos="fade-up">
            <p>
              If you still feel it's too much — that's okay. We'd rather you understand exactly what goes into
              this box than buy it without knowing. And if you do order — thank you. You're keeping something real alive.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }} data-aos="fade-up">
            <Link to="/products" className="btn btn-leaf">Browse Our Mangoes →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
