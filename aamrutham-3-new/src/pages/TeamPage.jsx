import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PILLARS = [
  {
    id: 'nature',
    numeral: 'I',
    label: 'Prathama · Prakṛti',
    english: ['The ', 'Givers of Life'],
    telugu: 'ప్రకృతి',
    tagline: 'Cows, bees, butterflies — the first farmers',
    blurb: 'Before any human hand touches the soil, the cow blesses it. Before any flower becomes fruit, a wing must carry pollen. These are not helpers on our farm — they are our farm.',
    theme: 'ochre',
    members: [
      { name: 'Desi Cows', telugu: 'దేశీ గోవులు', role: 'Keepers of the soil', tag: 'Panchagavyam', image: '/assets/team/desi-cows.jpg', bio: 'Our native breeds give the dung and urine that become Jeevamrutham and Panchagavyam — the living broths that feed every mango root. One cow, it is said, can nourish thirty acres.' },
      { name: 'Honey Bees', telugu: 'తేనెటీగలు', role: 'Pollinators', tag: 'Pollination', image: '/assets/team/honeybees.jpg', bio: 'They move between blossoms before sunrise, setting the fruit. Without them, no mango forms. We grow flowering hedges the year round so they never go hungry.' },
      { name: 'Butterflies', telugu: 'సీతాకోకచిలుకలు', role: 'Pollinators', tag: 'Biodiversity', image: '/assets/team/butterflies.jpg', bio: 'Common Mormons, Lime Swallowtails, Plain Tigers — they census the health of the grove. When they thrive, the orchard thrives.' },
      { name: 'Earthworms & Microbes', telugu: 'వానపాములు', role: 'Unseen labour', tag: 'Living Soil', image: '/assets/team/earthworms.jpg', bio: 'Millions of lives per handful of soil. They till without a plough, and they never ask for wages.' },
    ],
  },
  {
    id: 'architects',
    numeral: 'II',
    label: 'Dvitīya · Sthapati',
    english: ['The ', 'Architects'],
    telugu: 'రూపశిల్పులు',
    tagline: 'Those who dream the grove into being',
    blurb: 'Every tree has its place. Every swale, every windbreak, every shade corridor is drawn before it is dug. These two hold the long view.',
    theme: 'leaf',
    members: [
      { name: 'Sitaramaswamy Kankanalapalli', telugu: 'ప్రధాన రూపశిల్పి', role: 'Chief Architect', tag: 'SPNF', image: '/assets/team/sitaramaswamy.jpg', bio: "Shapes the land according to the principles of Subhash Palekar Natural Farming — contouring water, spacing canopies, planning companion species across the grove's 12-year arc." },
      { name: 'Sujatha Kankanalapalli', telugu: 'ప్రణాళికా నిర్వాహకులు', role: 'Planning Manager', tag: 'Operations', image: '/assets/team/sujatha.jpg', facePos: 'top', bio: 'Translates vision into a calendar: when to mulch, when to graft, when to welcome the monsoon. The farm\'s memory and its almanac.' },
    ],
  },
  {
    id: 'hands',
    numeral: 'III',
    label: 'Tṛtīya · Kṛṣaka',
    english: ['The ', 'Hands'],
    telugu: 'రైతులు',
    tagline: 'Those who walk the rows each morning',
    blurb: 'Four people who know every tree by its bark. They know which branch is heavy with Imam Pasand, which sapling was set down when. Nothing here is grown without their hands.',
    theme: 'terra',
    members: [
      { name: 'Lakshmi', telugu: 'లక్ష్మి', role: 'Farmer', tag: 'Since day one', image: '/assets/team/laxmi.jpg', bio: 'Tends the groves and prepares the desi-cow broths that feed every root on the farm.' },
      { name: 'Tavudu', telugu: 'తవుడు', role: 'Farmer', tag: 'Water & soil', image: '/assets/team/tavudu.jpg', facePos: 'top', bio: "Keeper of the irrigation channels — reads the land's thirst the way others read the sky." },
      { name: 'Mariamma', telugu: 'మరియమ్మ', role: 'Farmer', tag: 'Canopy care', image: '/assets/team/mariama.jpg', bio: 'Grafts, prunes, and the quiet hand behind every tree that fruits well in its first year.' },
      { name: 'Pyditalli', telugu: 'పైడితల్లి', role: 'Farmer', tag: 'Harvest', image: '/assets/team/pyditalli.jpg', bio: 'Harvests at first light, when the mangoes are coolest. Knows ripeness by weight alone.' },
    ],
  },
  {
    id: 'founders',
    numeral: 'IV',
    label: 'Caturtha · Sthāpaka',
    english: ['The ', 'Founders'],
    telugu: 'స్థాపకులు',
    tagline: 'The circle that carries it forward',
    blurb: 'A small team holding an old idea carefully: that a mango grown the way nature intended can still reach a city. Based between Bobbili and Hyderabad.',
    theme: 'mango',
    members: [
      { name: 'Akarsh', telugu: 'ఆకర్ష్', role: 'Founder', tag: 'Founder', image: '/assets/team/akarsh.jpg', bio: 'Third-generation on this land. Founded Aamrutham in 2026 to bring heritage, tree-ripened varieties out of the grove and onto the table.' },
      { name: 'Charan Teja', telugu: 'చరణ్ తేజ', role: 'Co-founder', tag: 'Operations', image: '/assets/team/charanteja.jpg', facePos: 'center 35%', bio: 'Keeps the operations honest — from cold chain to customer hand-off.' },
      { name: 'Srikanth', telugu: 'శ్రీకాంత్', role: 'Co-founder', tag: 'Growth', image: '/assets/team/srikanth.jpg', facePos: 'center 35%', bio: 'Builds the channels that take the orchard to the city, one pre-order at a time.' },
      { name: 'Ganesh', telugu: 'గణేష్', role: 'Co-founder', tag: 'Brand', image: null, fallback: '🎨', bio: 'The storyteller. Threads the farm\'s philosophy through every touchpoint.' },
      { name: 'R. S. Sai', telugu: 'ఆర్. ఎస్. సాయి', role: 'Co-founder', tag: 'Partnerships', image: '/assets/team/rs-sai.jpg', bio: 'Steward of the craft — relationships with farmers, buyers, and the long-view vision of Mangoes as a Service.' },
    ],
  },
];

const THEME_COLORS = {
  ochre: { main: '#C58A3E', tag: '#fdf2e0', tagText: '#5B3A15' },
  leaf:  { main: '#3F6B3A', tag: '#eaf3de', tagText: '#1F3A1D' },
  terra: { main: '#B5502E', tag: '#faeae3', tagText: '#5B2311' },
  mango: { main: '#E3A432', tag: '#fef7e0', tagText: '#6A430E' },
};

const PILLAR_BG = ['#F4EBD4', '#F7F0E6', '#F4EBD4', '#F7F0E6'];

function MemberPopup({ member, theme, onClose }) {
  const t = THEME_COLORS[theme];
  return (
    <div className="tm2-popup-overlay" onClick={onClose}>
      <div className="tm2-popup" onClick={e => e.stopPropagation()}>
        <button className="tm2-popup-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="tm2-popup-photo">
          {member.image
            ? <img src={member.image} alt={member.name} style={{ objectPosition: member.facePos || 'center 20%' }} />
            : <div className="tm2-card-placeholder">{member.fallback || '🌿'}</div>
          }
        </div>
        <div className="tm2-popup-body">
          <span className="tm2-card-tag" style={{ background: t.tag, color: t.tagText }}>{member.tag}</span>
          <span className="tm2-card-telugu" style={{ display: 'block', marginTop: '0.5rem' }}>{member.telugu}</span>
          <p className="tm2-popup-name">{member.name}</p>
          <p className="tm2-card-role" style={{ color: t.main }}>{member.role}</p>
          <p className="tm2-popup-bio">{member.bio}</p>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member, theme, onTap }) {
  const t = THEME_COLORS[theme];
  return (
    <div className="tm2-card" onClick={onTap}>
      <div className="tm2-card-photo">
        {member.image
          ? <img src={member.image} alt={member.name} style={{ objectPosition: member.facePos || 'center 20%' }} />
          : <div className="tm2-card-placeholder">{member.fallback || '🌿'}</div>
        }
      </div>
      <div className="tm2-card-body">
        <span className="tm2-card-tag" style={{ background: t.tag, color: t.tagText }}>{member.tag}</span>
        <span className="tm2-card-telugu">{member.telugu}</span>
        <p className="tm2-card-name">{member.name}</p>
        <p className="tm2-card-role" style={{ color: t.main }}>{member.role}</p>
        <p className="tm2-card-bio">{member.bio}</p>
        <span className="tm2-card-tap-hint">Their story inside →</span>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [active, setActive] = useState(3); // default: Founders
  const [popup, setPopup] = useState(null); // { member, theme }

  const pillar = PILLARS[active];
  const t = THEME_COLORS[pillar.theme];

  return (
    <main>
      {popup && <MemberPopup member={popup.member} theme={popup.theme} onClose={() => setPopup(null)} />}
      <section className="tm2-hero">
        <div className="tm2-hero-inner">
          <span className="tm2-eyebrow">The People Behind Every Mango</span>
          <h1 className="tm2-title">Our <em>Circle</em></h1>
          <span className="tm2-hero-telugu">మా బృందం</span>
          <p className="tm2-subtitle">A mango doesn't grow alone. Neither do we. Meet the humans, animals, and living systems that make Aamrutham possible.</p>
        </div>
      </section>

      {/* Pillar tabs */}
      <div className="tm2-tabs">
        {PILLARS.map((p, i) => {
          const tc = THEME_COLORS[p.theme];
          return (
            <button
              key={p.id}
              className={`tm2-tab${active === i ? ' active' : ''}`}
              style={active === i ? { borderColor: tc.main, color: tc.main } : {}}
              onClick={() => setActive(i)}
            >
              <span className="tm2-tab-numeral" style={active === i ? { color: tc.main } : {}}>{p.numeral}</span>
              <span className="tm2-tab-name">{p.english[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Active pillar panel */}
      <section
        key={pillar.id}
        className="tm2-panel"
        style={{ background: PILLAR_BG[active] }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: t.main }} />
        <div className="tm2-pillar-inner">
          <div className="tm2-pillar-head">
            <span className="tm2-pillar-numeral" style={{ color: t.main }}>{pillar.numeral}</span>
            <div className="tm2-pillar-meta">
              <span className="tm2-pillar-label" style={{ color: t.main }}>{pillar.label}</span>
              <h2 className="tm2-pillar-en">{pillar.english[0]}<em>{pillar.english[1]}</em></h2>
              <span className="tm2-pillar-telugu" style={{ color: t.main }}>{pillar.telugu}</span>
              <p className="tm2-pillar-tagline">{pillar.tagline}</p>
            </div>
          </div>
          <p className="tm2-pillar-blurb" style={{ borderColor: t.main }}>{pillar.blurb}</p>
          <div className="tm2-members-grid">
            {pillar.members.map(m => (
              <MemberCard
                key={m.name}
                member={m}
                theme={pillar.theme}
                onTap={() => setPopup({ member: m, theme: pillar.theme })}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="tm2-closing">
        <div className="tm2-closing-inner">
          <h2>Want to taste what <em>this circle grows?</em></h2>
          <p>Every box of Aamrutham mangoes carries the work of every person on this page — and every cow, bee, and earthworm too.</p>
          <Link to="/products" className="tm2-closing-btn">🌱 Shop Our Mangoes</Link>
        </div>
      </section>
    </main>
  );
}
