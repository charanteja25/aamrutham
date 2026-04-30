import React, { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    num: '01',
    title: 'Truth over trends',
    tag: 'Our founding belief',
    body: 'We don\'t engineer our mangoes for appearance, size, or shelf life. They grow at their own pace — shaped by soil, season, and sunlight. What you receive is not a "product." It is food in its most honest form.',
    bullets: ['No artificial ripening', 'No chemical shortcuts', 'No visual manipulation', 'One harvest a year'],
    featured: true,
  },
  {
    num: '02',
    title: 'Transparency you can see',
    body: 'Trust is built when nothing is hidden. We openly share our process — from what goes into the soil, to when and why we harvest.',
    bullets: ['Jeevamrutham & Panchagavyam — our only inputs', 'Desi cow-based living soil care', 'No claims we cannot show you'],
  },
  {
    num: '03',
    title: 'Nature is our partner',
    body: 'Desi cows, healthy soil, biodiversity — not add-ons. The foundation of everything we grow. Subhash Palekar Natural Farming is not a certification we chase. It\'s how we\'ve worked since 2013.',
    bullets: ['Soil alive, not chemical-dependent', 'Trees nourished, not forced', 'Farms as ecosystems, not factories'],
  },
  {
    num: '04',
    title: 'Heritage over hype',
    body: 'We grow varieties the world has nearly forgotten — not because they\'re exotic, but because they\'re extraordinary. GI-tagged, flavour-first, irreplaceable.',
    bullets: ['Panduri Mamidi & Imam Pasand', 'Kothapalli Kobbari & Bobbili Peechu', 'Mettavalasa Peechu'],
  },
  {
    num: '05',
    title: 'Responsibility beyond the harvest',
    body: 'Every choice we make impacts more than today\'s yield. We farm with the future in mind — regenerating the earth, preserving wisdom, and contributing to a greener world.',
    bullets: ['🌱 Regenerating the earth through compost & mulch', '🌍 Zero chemicals, zero plastic, lower carbon footprint', '🤲 Preserving Bobbili\'s farming wisdom for future generations'],
    tag: 'Eco-conscious farming',
  },
];

function ValuesAccordion({ value, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  usePageMeta({ title: 'Our Values — Aamrutham', description: 'The principles that guide how we grow, harvest, and deliver mangoes. Truth, transparency, and deep respect for nature.' });

  return (
    <div className={`vals-accordion${value.featured ? ' vals-accordion--featured' : ''}`}>
      <button className="vals-accordion-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="vals-accordion-num">{value.num}</span>
        <span className="vals-accordion-title">{value.title}</span>
        {value.tag && <span className="vals-accordion-tag">{value.tag}</span>}
        <span className={`vals-accordion-chevron${open ? ' open' : ''}`}>›</span>
      </button>
      <div className={`vals-accordion-body${open ? ' open' : ''}`}>
        <p className="vals-accordion-desc">{value.body}</p>
        <ul className="vals-accordion-bullets">
          {value.bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function ValuesPage() {
  return (
    <main>
      <section className="vals-hero">
        <div className="vals-hero-inner container">
          <span className="vals-eyebrow">What We Stand For</span>
          <h1 className="vals-title">Our <em>Values</em></h1>
          <p className="vals-sub">The principles that guide every season at Aamrutham — from soil care to the mangoes that reach your table.</p>
        </div>
      </section>

      {/* Mobile: accordion list. Desktop: original rich layout */}
      <section className="vals-mobile-list container">
        {VALUES.map((v, i) => (
          <ValuesAccordion key={v.num} value={v} defaultOpen={i === 0} />
        ))}
      </section>

      <section className="vals-desktop-layout vals-wrap container">
        {/* Featured value */}
        <div className="vals-featured">
          <div className="vals-feat-left">
            <span className="vals-feat-num">01</span>
            <p className="vals-feat-title">Truth over trends</p>
            <span className="vals-feat-tag">Our founding belief</span>
          </div>
          <div className="vals-feat-right">
            <p className="vals-feat-body">We don't engineer our mangoes for appearance, size, or shelf life. They grow at their own pace — shaped by soil, season, and sunlight. What you receive is not a "product." It is food in its most honest form.</p>
            <div className="vals-pills">
              <span>No artificial ripening</span>
              <span>No chemical shortcuts</span>
              <span>No visual manipulation</span>
              <span>One harvest a year</span>
            </div>
          </div>
        </div>

        {/* Values grid */}
        <div className="vals-grid">
          {[
            { num: '02', title: 'Transparency you can see', body: 'Trust is built when nothing is hidden. We openly share our process — from what goes into the soil, to when and why we harvest.', bullets: ['Jeevamrutham & Panchagavyam — our only inputs', 'Desi cow-based living soil care', 'No claims we cannot show you'] },
            { num: '03', title: 'Nature is our partner', body: 'Desi cows, healthy soil, biodiversity — not add-ons. The foundation of everything we grow. Subhash Palekar Natural Farming is not a certification we chase. It\'s how we\'ve worked since 2013.', bullets: ['Soil alive, not chemical-dependent', 'Trees nourished, not forced', 'Farms as ecosystems, not factories'] },
            { num: '04', title: 'Heritage over hype', body: 'We grow varieties the world has nearly forgotten — not because they\'re exotic, but because they\'re extraordinary. GI-tagged, flavour-first, irreplaceable.', bullets: ['Panduri Mamidi & Imam Pasand', 'Kothapalli Kobbari & Bobbili Peechu', 'Mettavalasa Peechu'] },
          ].map(v => (
            <div className="vals-card" key={v.num}>
              <span className="vals-card-num">{v.num}</span>
              <p className="vals-card-title">{v.title}</p>
              <p className="vals-card-body">{v.body}</p>
              <ul className="vals-bullets">
                {v.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}

          {/* Responsibility — full width */}
          <div className="vals-card-wide">
            <div className="vals-wide-left">
              <span className="vals-card-num">05</span>
              <p className="vals-card-title">Responsibility beyond the harvest</p>
              <p className="vals-card-body">Every choice we make impacts more than today's yield. We farm with the future in mind — regenerating the earth, preserving wisdom, and contributing to a greener world.</p>
              <span className="vals-green-tag">Eco-conscious farming</span>
            </div>
            <div className="vals-wide-right">
              {[
                { icon: '🌱', title: 'Regenerating the earth', desc: 'We return organic matter back to the soil through compost, mulch, and natural inputs — building fertility season after season, not depleting it.' },
                { icon: '🌍', title: 'Greener practices', desc: 'Zero synthetic chemicals, zero plastic in our process, and a farming footprint that actively reduces carbon rather than adding to it.' },
                { icon: '🤲', title: 'Giving back to the community', desc: 'Rooted in Bobbili, Andhra Pradesh — we preserve local farming wisdom and support a system that future generations can rely on and be proud of.' },
              ].map(r => (
                <div className="vals-resp-pillar" key={r.title}>
                  <span className="vals-resp-icon">{r.icon}</span>
                  <p className="vals-resp-title">{r.title}</p>
                  <p className="vals-resp-desc">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing — shared */}
      <div className="vals-closing container">
        <p className="vals-closing-text">Aamrutham is not just about mangoes.<br />It's about bringing back <em>food you can trust.</em></p>
        <div className="vals-stamp">
          <span className="vals-stamp-year">2013</span>
          <span className="vals-stamp-label">Natural Farming</span>
        </div>
      </div>

      <section className="vals-cta">
        <div className="container center narrow">
          <h2>Taste what <em>our values grow</em></h2>
          <p>Every mango we send carries these principles in every bite.</p>
          <Link to="/products" className="btn btn-gold">Shop Our Mangoes →</Link>
        </div>
      </section>
    </main>
  );
}
