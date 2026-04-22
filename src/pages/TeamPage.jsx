import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PILLARS = [
  {
    id: 'nature',
    accent: 'ochre',
    numeral: 'I',
    label: 'Prathama · Prakṛti',
    english: 'The Givers of Life',
    telugu: 'ప్రకృతి',
    tagline: 'Cows, bees, butterflies — the first farmers',
    blurb: 'Before any human hand touches the soil, the cow blesses it. Before any flower becomes fruit, a wing must carry pollen. These are not helpers on our farm — they are our farm.',
    members: [
      { name: 'Desi Cows', telugu: 'దేశీ గోవులు', role: 'Keepers of the soil', tag: 'Panchagavyam', image: '/assets/team/desi-cows.jpg', bio: 'Our native breeds give the dung and urine that become Jeevamrutham and Panchagavyam — the living broths that feed every mango root. One cow, it is said, can nourish thirty acres.' },
      { name: 'Honey Bees', telugu: 'తేనెటీగలు', role: 'Pollinators', tag: 'Pollination', image: '/assets/team/honeybees.jpg', bio: 'They move between blossoms before sunrise, setting the fruit. Without them, no mango forms. We grow flowering hedges the year round so they never go hungry.' },
      { name: 'Butterflies', telugu: 'సీతాకోకచిలుకలు', role: 'Pollinators', tag: 'Biodiversity', image: '/assets/team/butterflies.jpg', bio: 'Common Mormons, Lime Swallowtails, Plain Tigers — they census the health of the grove. When they thrive, the orchard thrives.' },
      { name: 'Earthworms', telugu: 'వానపాములు', role: 'Unseen labour', tag: 'Living Soil', image: '/assets/team/earthworms.jpg', bio: 'Millions of lives per handful of soil. They till without a plough, and they never ask for wages.' },
    ],
  },
  {
    id: 'design',
    accent: 'leaf',
    numeral: 'II',
    label: 'Dvitīya · Sthapati',
    english: 'The Architects',
    telugu: 'రూపశిల్పులు',
    tagline: 'Those who dream the grove into being',
    blurb: 'Every tree has its place. Every swale, every windbreak, every shade corridor is drawn before it is dug. These two hold the long view.',
    members: [
      { name: 'Chief Architect', telugu: 'ప్రధాన రూపశిల్పి', role: 'Vision & farm design', tag: 'SPNF', image: '/assets/team/sitaramaswamy.jpg', bio: "Shapes the land according to the principles of Subhash Palekar Natural Farming — contouring water, spacing canopies, planning companion species across the grove's 12-year arc." },
      { name: 'Planning Manager', telugu: 'ప్రణాళికా నిర్వాహకులు', role: 'Seasons & stewardship', tag: 'Operations', image: '/assets/team/sujatha.jpg', bio: "Translates vision into a calendar: when to mulch, when to graft, when to welcome the monsoon. The farm's memory and its almanac." },
    ],
  },
  {
    id: 'farmers',
    accent: 'terra',
    numeral: 'III',
    label: 'Tṛtīya · Kṛṣaka',
    english: 'The Hands',
    telugu: 'రైతులు',
    tagline: 'Those who walk the rows each morning',
    blurb: 'Four people who know every tree by its bark. They know which branch is heavy with Imam Pasand, which sapling was set down when. Nothing here is grown without their hands.',
    members: [
      { name: 'Lakshmi', telugu: 'లక్ష్మి', role: 'Farmer', tag: 'Since day one', image: '/assets/team/laxmi.jpg', bio: 'Tends the groves and prepares the desi-cow broths that feed every root on the farm.' },
      { name: 'Tavudu', telugu: 'తవుడు', role: 'Farmer', tag: 'Water & soil', image: '/assets/team/tavudu.jpg', bio: "Keeper of the irrigation channels — reads the land's thirst the way others read the sky." },
      { name: 'Mariamma', telugu: 'మరియమ్మ', role: 'Farmer', tag: 'Canopy care', image: '/assets/team/mariama.jpg', bio: 'Grafts, prunes, and the quiet hand behind every tree that fruits well in its first year.' },
      { name: 'Ravanamma', telugu: 'రావణమ్మ', role: 'Farmer', tag: 'Harvest', image: '/assets/team/ravanamma.jpg', bio: 'Harvests at first light, when the mangoes are coolest. Knows ripeness by weight alone.' },
    ],
  },
  {
    id: 'founders',
    accent: 'mango',
    numeral: 'IV',
    label: 'Caturtha · Sthāpaka',
    english: 'The Founders',
    telugu: 'స్థాపకులు',
    tagline: 'The circle that carries it forward',
    blurb: 'A small team holding an old idea carefully: that a mango grown the way nature intended can still reach a city. Based between Bobbili and Hyderabad.',
    members: [
      { name: 'Akarsh', telugu: 'ఆకర్ష్', role: 'Founder', tag: 'Founder', image: '/assets/team/akarsh.jpg', bio: 'Third-generation on this land. Founded Aamrutham in 2026 to bring heritage, tree-ripened varieties out of the grove and onto the table.' },
      { name: 'Charan Teja', telugu: 'చరణ్ తేజ', role: 'Co-founder', tag: 'Tech & Design', image: '/assets/team/charanteja.jpg', bio: 'Builds the systems that connect the farm to the city — the website, the story, the experience of receiving an Aamrutham box.' },
      { name: 'Srikanth', telugu: 'శ్రీకాంత్', role: 'Co-founder', tag: 'Operations', image: '/assets/team/srikanth.jpg', bio: 'Manages the harvest logistics and cold chain — the quiet work that keeps mangoes perfect from grove to doorstep.' },
      { name: 'Ganesh', telugu: 'గణేష్', role: 'Co-founder', tag: 'Growth', image: '/assets/team/ganesh.jpg', bio: 'Drives customer relationships and grows the Aamrutham community — every repeat order starts with trust he built.' },
      { name: 'RS Sai', telugu: 'ఆర్ఎస్ సాయి', role: 'Co-founder', tag: 'Strategy', image: '/assets/team/rssai.jpg', bio: "Shapes the strategic direction of Aamrutham — connecting the farm's heritage story to the right audiences and partnerships." },
    ],
  },
];

const ACCENT_VARS = {
  ochre:  { fill: '#C58A3E', soft: '#E9C98B', ink: '#5B3A15', tagBg: '#fdf2e0', tagBorder: '#E9C98B' },
  leaf:   { fill: '#3F6B3A', soft: '#A9C49A', ink: '#1F3A1D', tagBg: '#eaf3de', tagBorder: '#A9C49A' },
  terra:  { fill: '#B5502E', soft: '#E2A98C', ink: '#5B2311', tagBg: '#faeae3', tagBorder: '#E2A98C' },
  mango:  { fill: '#E3A432', soft: '#F4D891', ink: '#6A430E', tagBg: '#fef7e0', tagBorder: '#F4D891' },
};

const PILLAR_BG = ['#FEF8F0', '#F7F0E6', '#FEF8F0', '#F7F0E6'];

function MemberCard({ member, accent }) {
  const a = ACCENT_VARS[accent];
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="tc-member-card">
      {member.image && !imgErr ? (
        <img src={member.image} alt={member.name} className="tc-member-photo" onError={() => setImgErr(true)} />
      ) : (
        <div className="tc-member-photo-placeholder">{member.name.charAt(0)}</div>
      )}
      <div className="tc-member-body">
        <span className="tc-member-tag" style={{ background: a.tagBg, color: a.ink, border: `1px solid ${a.tagBorder}` }}>{member.tag}</span>
        <span className="tc-member-te">{member.telugu}</span>
        <p className="tc-member-name">{member.name}</p>
        <p className="tc-member-role" style={{ color: a.fill }}>{member.role}</p>
        <p className="tc-member-bio">{member.bio}</p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [open, setOpen] = useState({ nature: true, design: true, farmers: true, founders: true });
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="tc-page">
      <section className="tc-hero">
        <div className="tc-hero-inner">
          <span className="tc-eyebrow">The People Behind Every Mango</span>
          <h1 className="tc-title">Our <em>Circle</em></h1>
          <span className="tc-title-te">మా బృందం</span>
          <p className="tc-subtitle">
            A mango doesn't grow alone. Neither do we. Meet the humans, animals, and living systems that make Aamrutham possible.
          </p>
        </div>
      </section>

      <div className="tc-accordion">
        {PILLARS.map((pillar, i) => {
          const a = ACCENT_VARS[pillar.accent];
          const isOpen = open[pillar.id];
          return (
            <div
              key={pillar.id}
              className={`tc-acc-item${isOpen ? ' open' : ''}`}
              style={{ background: PILLAR_BG[i] }}
            >
              <button
                className="tc-acc-header"
                onClick={() => toggle(pillar.id)}
                style={{ borderLeft: `4px solid ${a.fill}` }}
              >
                <span className="tc-pillar-numeral" style={{ color: a.fill }}>{pillar.numeral}</span>
                <div className="tc-pillar-meta">
                  <span className="tc-pillar-label" style={{ color: a.fill }}>{pillar.label}</span>
                  <h2 className="tc-pillar-en">
                    <em style={{ color: a.fill }}>{pillar.english}</em>
                  </h2>
                  <span className="tc-pillar-te" style={{ color: a.ink }}>{pillar.telugu}</span>
                  <p className="tc-pillar-tagline">{pillar.tagline}</p>
                </div>
                <div className="tc-acc-meta-right">
                  <span className="tc-acc-count" style={{ color: a.fill }}>{pillar.members.length} members</span>
                  <span className="tc-acc-chevron" style={{ color: a.fill }}>▼</span>
                </div>
              </button>

              <div className="tc-acc-body-wrap">
                <div className="tc-acc-body">
                  <p className="tc-pillar-blurb" style={{ borderColor: a.fill }}>{pillar.blurb}</p>
                  <div className="tc-members-grid" data-pillar={pillar.id}>
                    {pillar.members.map((m) => (
                      <MemberCard key={m.name} member={m} accent={pillar.accent} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="tc-closing">
        <div className="tc-closing-inner">
          <h2>Grown by <em>many hands,</em> reaching yours</h2>
          <p>Every mango that leaves our grove carries the work of this entire circle — seen and unseen, human and not.</p>
          <Link className="tc-closing-btn" to="/products">Shop Mangoes ✦</Link>
        </div>
      </section>
    </main>
  );
}
