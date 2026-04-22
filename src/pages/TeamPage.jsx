import React, { useState } from 'react';

const PILLARS = [
  {
    id: 'nature',
    title: 'Nature Partners',
    subtitle: 'The first farmers of our orchard',
    members: [
      {
        name: 'Desi Cows',
        role: 'Soil Keepers',
        bio: 'Their dung and urine become Jeevamrutham and Panchagavyam, feeding every root naturally.',
        image: '/assets/team/desi-cows.jpg',
      },
      {
        name: 'Honey Bees',
        role: 'Pollinators',
        bio: 'They move across blossoms at dawn and set the fruit that becomes each season\'s harvest.',
        image: '/assets/team/honeybees.jpg',
      },
      {
        name: 'Butterflies',
        role: 'Biodiversity Signals',
        bio: 'When butterflies thrive, our ecosystem is healthy. They are the grove\'s living health report.',
        image: '/assets/team/butterflies.jpg',
      },
      {
        name: 'Earthworms',
        role: 'Soil Builders',
        bio: 'They aerate and enrich soil constantly, turning organic matter into life for mango trees.',
        image: '/assets/team/earthworms.jpg',
      },
    ],
  },
  {
    id: 'architects',
    title: 'Farm Architects',
    subtitle: 'Design and season planning',
    members: [
      {
        name: 'Sitaramaswamy',
        role: 'Chief Architect',
        bio: 'Designs orchard structure and long-term farm systems rooted in natural farming principles.',
        image: '/assets/team/sitaramaswamy.jpg',
      },
      {
        name: 'Sujatha',
        role: 'Planning Manager',
        bio: 'Leads seasonal planning for mulching, irrigation cycles, pruning, and harvest timing.',
        image: '/assets/team/sujatha.jpg',
      },
    ],
  },
  {
    id: 'farmers',
    title: 'Farm Hands',
    subtitle: 'The team that walks the rows daily',
    members: [
      {
        name: 'Laxmi',
        role: 'Farmer',
        bio: 'Prepares natural inputs and tends trees through each growth stage.',
        image: '/assets/team/laxmi.jpg',
      },
      {
        name: 'Tavudu',
        role: 'Farmer',
        bio: 'Maintains water channels and orchard hydration rhythm across plots.',
        image: '/assets/team/tavudu.jpg',
      },
      {
        name: 'Mariama',
        role: 'Farmer',
        bio: 'Supports grafting, canopy care, and fruit quality checks.',
        image: '/assets/team/mariama.jpg',
      },
      {
        name: 'Ravanamma',
        role: 'Farmer',
        bio: 'Leads careful harvest handling and maturity checks at peak season.',
        image: '/assets/team/ravanamma.jpg',
      },
    ],
  },
  {
    id: 'founders',
    title: 'Founding Team',
    subtitle: 'Carrying Bobbili mangoes to Hyderabad',
    members: [
      {
        name: 'Akarsh',
        role: 'Founder',
        bio: 'Leads Aamrutham\'s farm-first vision and heritage variety revival.',
        image: '/assets/team/akarsh.jpg',
      },
      {
        name: 'Charan Teja',
        role: 'Co-founder',
        bio: 'Runs operations from harvest readiness to doorstep delivery.',
        image: '/assets/team/charanteja.jpg',
      },
      {
        name: 'Srikanth',
        role: 'Co-founder',
        bio: 'Handles growth channels and customer experience across the season.',
        image: '/assets/team/srikanth.jpg',
      },
    ],
  },
];

function MemberCard({ member }) {
  const [error, setError] = useState(false);

  return (
    <article className="team-member-card">
      <div className="team-member-media">
        {!error && member.image ? (
          <img src={member.image} alt={member.name} onError={() => setError(true)} />
        ) : (
          <div className="team-member-placeholder">{member.name.charAt(0)}</div>
        )}
      </div>
      <div className="team-member-body">
        <h3>{member.name}</h3>
        <p className="team-member-role">{member.role}</p>
        <p>{member.bio}</p>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const [openId, setOpenId] = useState(PILLARS[0].id);

  return (
    <main>
      <section className="page-hero products-page-hero">
        <div className="container center narrow">
          <p className="section-eyebrow gold">The People Behind Every Mango</p>
          <h1>Our Team</h1>
          <p className="page-hero-text">
            From living soil partners to founders, this is the full circle behind each box we deliver.
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container team-accordion-wrap">
          {PILLARS.map((pillar) => {
            const isOpen = openId === pillar.id;

            return (
              <section key={pillar.id} className={`team-accordion-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="team-accordion-trigger"
                  onClick={() => setOpenId(isOpen ? '' : pillar.id)}
                  aria-expanded={isOpen}
                >
                  <div>
                    <p className="section-eyebrow" style={{ marginBottom: 4 }}>Our Circle</p>
                    <h2>{pillar.title}</h2>
                    <p>{pillar.subtitle}</p>
                  </div>
                  <span className="team-accordion-icon">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="team-accordion-content">
                    <div className="team-member-grid">
                      {pillar.members.map((member) => (
                        <MemberCard key={member.name} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
