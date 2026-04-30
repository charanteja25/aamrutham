import React, { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';

const COSTS = [
  {
    icon: '🥭',
    title: 'Low yield, high quality',
    desc: 'A naturally farmed heritage tree gives 60–80 mangoes a season — not 300. Fewer fruits, but every single one is exceptional. You\'re not getting quantity. You\'re getting the best of what the tree has.',
    featured: true,
  },
  { icon: '🌱', title: 'Farming cost',         desc: 'Natural inputs like Jeevamrutham and Panchagavya take time and effort to prepare every season. There are no shortcuts — and that\'s exactly the point.' },
  { icon: '🌍', title: 'Soil investment',       desc: 'Building soil fertility the organic way takes years and money. We don\'t extract from the land — we invest in it every season.' },
  { icon: '👐', title: 'Labour',                desc: 'Natural farming is human-intensive. Picking, sorting, checking ripeness — all done by hand. No machines cutting corners.' },
  { icon: '📦', title: 'Eco-friendly packaging',desc: 'We use plastic-free packaging. Each mango is individually cushioned — because what\'s inside is chemical-free, the outside should be too.' },
  { icon: '🚚', title: 'Delivery',              desc: 'Farm-to-door from Bobbili to Hyderabad. No cold chain shortcuts. We want it reaching you the way we\'d want it ourselves.' },
];

const COMPARE = [
  { label: 'Chemicals',    bad: 'Unknown chemical usage',           good: 'Zero chemicals, SPNF natural farming' },
  { label: 'Ripening',     bad: 'Carbide or forced ripening',       good: 'Tree-ripened, no artificial agents' },
  { label: 'Freshness',    bad: 'Cold-storage, weeks old',          good: 'Shipped within days of harvest' },
  { label: 'Source',       bad: 'No traceability, no farmer',       good: 'Direct from our farms in Bobbili' },
  { label: 'Varieties',    bad: 'Common commercial only',           good: 'Rare GI-tagged heritage varieties' },
  { label: 'Soil',         bad: 'Soil health ignored',              good: 'Long-term investment, 100% solar' },
];

function AccordionCard({ icon, title, desc, featured, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className={`pricing-cost-card${featured ? ' pricing-cost-card--featured' : ''}`}>
      <button className="pricing-cost-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="pricing-cost-icon">{icon}</span>
        <span className="pricing-cost-title">{title}</span>
        <span className={`pricing-cost-chevron${open ? ' open' : ''}`}>›</span>
      </button>
      {open && <p className="pricing-cost-desc">{desc}</p>}
    </div>
  );
}

export default function PricingPage() {
  const [hardshipOpen, setHardshipOpen] = useState(false);
  const [heritageOpen, setHeritageOpen] = useState(false);
  const [convictionOpen, setConvictionOpen] = useState(false);
  usePageMeta({ title: 'Why This Price — Aamrutham', description: 'Understanding what goes into the cost of naturally farmed, tree-ripened mangoes from our heritage groves in Bobbili.' });


  return (
    <main>
      {/* ── Hero ── */}
      <section className="pricing-hero">
        <div className="pricing-hero-dots" aria-hidden="true" />
        <div className="container pricing-hero-inner">
          <span className="pricing-eyebrow">✦ Pricing Transparency</span>
          <h1 className="pricing-title">Why does Aamrutham<br /><em>cost what it costs?</em></h1>
          <p className="pricing-sub">
            You deserve a real answer — not marketing language. Here it is.
          </p>
        </div>
      </section>

      {/* ── Cost breakdown ── */}
      <section className="section section-cream">
        <div className="container">
          <div className="pricing-section-head" data-aos="fade-up">
            <span className="section-eyebrow">✦ What goes into every box</span>
            <h2 className="section-title">The <em>Real</em> Cost Breakdown</h2>
          </div>
          <div className="pricing-cost-grid" data-aos="fade-up">
            {COSTS.map(({ icon, title, desc, featured }, i) => (
              <AccordionCard key={title} icon={icon} title={title} desc={desc} featured={featured} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Story blocks ── */}
      <section className="section section-white">
        <div className="container narrow">

          <div className="pricing-accordion" data-aos="fade-up">
            <button className="pricing-accordion-header" onClick={() => setHardshipOpen(o => !o)}>
              <span>The hardship nobody talks about</span>
              <span className={`pricing-cost-chevron${hardshipOpen ? ' open' : ''}`}>›</span>
            </button>
            <div className={`pricing-accordion-body${hardshipOpen ? ' open' : ''}`}>
              <p>
                Natural farming sounds beautiful on paper. In practice, it means you lose sleep when pests show up
                and you have no chemical to reach for. Some seasons your yield drops by half. No insurance.
                No safety net. You just absorb it and hope the next season is better. The price you see is not us
                making a margin — it's us keeping this alive.
              </p>
            </div>
          </div>

          <div className="pricing-accordion" data-aos="fade-up">
            <button className="pricing-accordion-header" onClick={() => setHeritageOpen(o => !o)}>
              <span>Heritage varieties are rare by design</span>
              <span className={`pricing-cost-chevron${heritageOpen ? ' open' : ''}`}>›</span>
            </button>
            <div className={`pricing-accordion-body${heritageOpen ? ' open' : ''}`}>
              <p>
                Panduri Mamidi, Kothapalli Kobbari, Bobbili Peechu, Mettavalasa Peechu, Imam Pasand — these varieties
                bruise easily, ripen fast, and don't survive commercial supply chains. They survive only because
                small farmers like us grow them. When you buy a box, you're not just buying fruit.
                You're helping keep these varieties alive.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Compare ── */}
      <section className="section section-cream-dark">
        <div className="container">
          <div className="pricing-section-head" data-aos="fade-up">
            <span className="section-eyebrow">✦ Side by side</span>
            <h2 className="section-title">Aamrutham vs. <em>Supermarket</em></h2>
          </div>

          <div className="pricing-compare-table" data-aos="fade-up">
            <div className="pricing-compare-thead">
              <div className="pricing-compare-label" />
              <div className="pricing-compare-col pricing-compare-col--bad">
                <span className="pricing-compare-tag pricing-compare-tag--super">Supermarket</span>
                <span className="pricing-compare-colprice">~₹200 / kg</span>
              </div>
              <div className="pricing-compare-col pricing-compare-col--good">
                <span className="pricing-compare-tag pricing-compare-tag--ours">Aamrutham</span>
                <span className="pricing-compare-colprice pricing-compare-colprice--ours">Premium / kg</span>
              </div>
            </div>
            {COMPARE.map(({ label, bad, good }) => (
              <div className="pricing-compare-row-item" key={label}>
                <div className="pricing-compare-label">{label}</div>
                <div className="pricing-compare-col pricing-compare-col--bad">
                  <span className="pricing-dot pricing-dot--no">✕</span>{bad}
                </div>
                <div className="pricing-compare-col pricing-compare-col--good">
                  <span className="pricing-dot pricing-dot--yes">✓</span>{good}
                </div>
              </div>
            ))}
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

      {/* ── Conviction + CTA ── */}
      <section className="section section-white">
        <div className="container narrow">

          <div className="pricing-accordion" data-aos="fade-up">
            <button className="pricing-accordion-header" onClick={() => setConvictionOpen(o => !o)}>
              <span>We are convicted to bring you good food</span>
              <span className={`pricing-cost-chevron${convictionOpen ? ' open' : ''}`}>›</span>
            </button>
            <div className={`pricing-accordion-body${convictionOpen ? ' open' : ''}`}>
              <p>
                Not food that looks good in a photo. Not food that travelled three weeks in a cold chain.
                Food that is actually good — free from adulteration, free from chemicals, farmed the way our
                grandfathers farmed before shortcuts became normal. That conviction comes with a cost.
                We won't apologise for it.
              </p>
            </div>
          </div>

          <div className="pricing-close" data-aos="fade-up">
            <p>
              If you still feel it's too much — that's okay. We'd rather you understand exactly what goes into
              this box than buy it without knowing. And if you do order — thank you. You're keeping something real alive.
            </p>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }} data-aos="fade-up">
            <Link to="/products" className="btn btn-leaf">Browse Our Mangoes →</Link>
          </div>

        </div>
      </section>
    </main>
  );
}
