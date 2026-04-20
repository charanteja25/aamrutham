import React, { useState, useEffect, useRef, useMemo } from 'react';

const ACCENTS = {
  ochre: { fill: '#C58A3E', soft: '#E9C98B', ink: '#5B3A15' },
  leaf: { fill: '#3F6B3A', soft: '#A9C49A', ink: '#1F3A1D' },
  terracotta: { fill: '#B5502E', soft: '#E2A98C', ink: '#5B2311' },
  mango: { fill: '#E3A432', soft: '#F4D891', ink: '#6A430E' },
};

const CENTER_LOGO = '/assets/Subject.png';

const PILLARS = [
  {
    id: 'nature',
    numeral: 'I',
    telugu: 'ప్రకృతి',
    english: 'The Givers of Life',
    sanskrit: 'Prakṛti',
    tagline: 'Cows, bees, butterflies — the first farmers',
    ring: 0,
    accent: 'ochre',
    blurb:
      'Before any human hand touches the soil, the cow blesses it. Before any flower becomes fruit, a wing must carry pollen. These are not helpers on our farm — they are our farm.',
    members: [
      {
        name: 'Desi Cows',
        telugu: 'దేశీ గోవులు',
        role: 'Keepers of the soil',
        bio: 'Our native breeds give the dung and urine that become Jeevamrutham and Panchagavyam — the living broths that feed every mango root. One cow, it is said, can nourish thirty acres.',
        tag: 'Panchagavyam',
      },
      {
        name: 'Honey Bees',
        telugu: 'తేనెటీగలు',
        role: 'Pollinators',
        bio: 'They move between blossoms before sunrise, setting the fruit. Without them, no mango forms. We grow flowering hedges the year round so they never go hungry.',
        tag: 'Pollination',
      },
      {
        name: 'Butterflies',
        telugu: 'సీతాకోకచిలుకలు',
        role: 'Pollinators',
        bio: 'Common Mormons, Lime Swallowtails, Plain Tigers — they census the health of the grove. When they thrive, the orchard thrives.',
        tag: 'Biodiversity',
      },
      {
        name: 'Earthworms',
        telugu: 'వానపాములు',
        role: 'Unseen labour',
        bio: 'Millions of lives per handful of soil. They till without a plough, and they never ask for wages.',
        tag: 'Living Soil',
      },
    ],
  },
  {
    id: 'design',
    numeral: 'II',
    telugu: 'రూపశిల్పులు',
    english: 'The Architects',
    sanskrit: 'Sthapati',
    tagline: 'Those who dream the grove into being',
    ring: 1,
    accent: 'leaf',
    blurb:
      'Every tree has its place. Every swale, every windbreak, every shade corridor is drawn before it is dug. These two hold the long view.',
    members: [
      {
        name: 'Chief Architect',
        telugu: 'ప్రధాన రూపశిల్పి',
        role: 'Vision & farm design',
        bio: "Shapes the land according to the principles of Subhash Palekar Natural Farming — contouring water, spacing canopies, planning companion species across the grove's 12-year arc.",
        tag: 'SPNF',
      },
      {
        name: 'Planning Manager',
        telugu: 'ప్రణాళికా నిర్వాహకులు',
        role: 'Seasons & stewardship',
        bio: "Translates vision into a calendar: when to mulch, when to graft, when to welcome the monsoon. The farm's memory and its almanac.",
        tag: 'Operations',
      },
    ],
  },
  {
    id: 'farmers',
    numeral: 'III',
    telugu: 'రైతులు',
    english: 'The Hands',
    sanskrit: 'Kṛṣaka',
    tagline: 'Those who walk the rows each morning',
    ring: 2,
    accent: 'terracotta',
    blurb:
      'Four people who know every tree by its bark. They know which branch is heavy with Imam Pasand, which sapling was set down when. Nothing here is grown without their hands.',
    members: [
      {
        name: 'Lakshmi',
        telugu: 'లక్ష్మి',
        role: 'Farmer',
        bio: 'Tends the groves and prepares the desi-cow broths that feed every root on the farm.',
        tag: 'Since day one',
        image: '/assets/team/lakshmi.jpg',
      },
      {
        name: 'Tavudu',
        telugu: 'తవుడు',
        role: 'Farmer',
        bio: "Keeper of the irrigation channels — reads the land's thirst the way others read the sky.",
        tag: 'Water & soil',
        image: '/assets/team/tavudu.jpg',
      },
      {
        name: 'Mariamma',
        telugu: 'మరియమ్మ',
        role: 'Farmer',
        bio: 'Grafts, prunes, and the quiet hand behind every tree that fruits well in its first year.',
        tag: 'Canopy care',
        image: '/assets/team/mariamma.jpg',
      },
      {
        name: 'Ravanamma',
        telugu: 'రావణమ్మ',
        role: 'Farmer',
        bio: 'Harvests at first light, when the mangoes are coolest. Knows ripeness by weight alone.',
        tag: 'Harvest',
        image: '/assets/team/ravanamma.jpg',
      },
    ],
  },
  {
    id: 'founders',
    numeral: 'IV',
    telugu: 'స్థాపకులు',
    english: 'The Founders',
    sanskrit: 'Sthāpaka',
    tagline: 'The circle that carries it forward',
    ring: 3,
    accent: 'mango',
    blurb:
      'A small team holding an old idea carefully: that a mango grown the way nature intended can still reach a city. Based between Bobbili and Hyderabad.',
    members: [
      {
        name: 'Akarsh',
        telugu: 'ఆకర్ష్',
        role: 'Founder',
        bio: 'Third-generation on this land. Founded Aamrutham in 2026 to bring heritage, tree-ripened varieties out of the grove and onto the table.',
        tag: 'Founder',
      },
      {
        name: 'Charan Teja',
        telugu: 'చరణ్ తేజ',
        role: 'Co-founder',
        bio: 'Keeps the operations honest — from cold chain to customer hand-off.',
        tag: 'Operations',
      },
      {
        name: 'Srikanth',
        telugu: 'శ్రీకాంత్',
        role: 'Co-founder',
        bio: 'Builds the channels that take the orchard to the city, one pre-order at a time.',
        tag: 'Growth',
      },
      {
        name: 'Ganesh',
        telugu: 'గణేష్',
        role: 'Co-founder',
        bio: "The storyteller. Threads the farm's philosophy through every touchpoint.",
        tag: 'Brand',
      },
      {
        name: 'R. S. Sai',
        telugu: 'ఆర్. ఎస్. సాయి',
        role: 'Co-founder',
        bio: 'Steward of the craft — relationships with farmers, buyers, and the long-view vision of Mangoes as a Service.',
        tag: 'Partnerships',
      },
    ],
  },
];

const RING_SPEEDS = [0.28, -0.22, 0.16, -0.12];
const RING_RADII = [108, 200, 292, 378];
const CX = 540;
const CY = 500;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => t * t * (3 - 2 * t);

function MemberPortrait({ member, accent, height = 280 }) {
  const [imgError, setImgError] = useState(false);
  const a = ACCENTS[accent];
  const hasImage = member.image && !imgError;

  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: 22,
        overflow: 'hidden',
        border: `1.5px solid ${a.soft}`,
        background: `linear-gradient(180deg, ${a.soft} 0%, #fff8ec 100%)`,
        boxShadow: '0 14px 36px rgba(59,37,7,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hasImage ? (
        <img
          src={member.image}
          alt={member.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: a.ink,
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: a.fill,
              color: '#fffdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fraunces', serif",
              fontSize: '2.2rem',
              fontWeight: 500,
              boxShadow: '0 10px 24px rgba(59,37,7,0.12)',
            }}
          >
            {member.name.charAt(0)}
          </div>

          <div>
            <p
              style={{
                margin: '0 0 4px',
                fontFamily: "'Fraunces', serif",
                fontSize: '1.05rem',
                color: '#3B2507',
              }}
            >
              {member.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: a.ink,
                opacity: 0.75,
              }}
            >
              Portrait coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const getFocusRadius = (ringIndex) => {
  const focused = [170, 210, 250, 290];
  return focused[ringIndex];
};

// function Avatar({ member, accent, size = 100 }) {
//   const [imgError, setImgError] = useState(false);
//   const a = ACCENTS[accent];
//   const hasImage = member.image && !imgError;

//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: '50%',
//         background: `linear-gradient(135deg, ${a.soft}, #fff7e8)`,
//         border: `3px solid ${a.fill}`,
//         overflow: 'hidden',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         boxShadow: '0 10px 26px rgba(59,37,7,0.12)',
//         flexShrink: 0,
//       }}
//     >
//       {hasImage ? (
//         <img
//           src={member.image}
//           alt={member.name}
//           onError={() => setImgError(true)}
//           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//         />
//       ) : (
//         <span
//           style={{
//             fontFamily: "'Fraunces', serif",
//             fontSize: `${size * 0.42}px`,
//             color: a.ink,
//             fontWeight: 400,
//             lineHeight: 1,
//           }}
//         >
//           {member.name.charAt(0)}
//         </span>
//       )}
//     </div>
//   );
// }

function BioModal({ member, pillar, onClose }) {
  const a = ACCENTS[pillar.accent];

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(44,28,8,0.52)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #fffdf8 0%, #faf3e6 100%)',
          borderRadius: 24,
          padding: '2rem',
          maxWidth: 620,
          width: '100%',
          boxShadow: '0 30px 80px rgba(59,37,7,0.30)',
          border: `1px solid ${a.soft}`,
          borderTop: `5px solid ${a.fill}`,
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            boxShadow: '0 6px 16px rgba(59,37,7,0.10)',
            fontSize: 20,
            cursor: 'pointer',
            color: '#8d7753',
          }}
        >
          ×
        </button>

        {/* <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              background: a.soft,
              color: a.ink,
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: 999,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {pillar.numeral} · {pillar.english}
          </span>
        </div>

        <div
          style={{
            padding: '1rem',
            background: 'rgba(255,255,255,0.72)',
            border: `1px solid ${a.soft}`,
            borderRadius: 16,
            marginBottom: '1.25rem',
          }}
        >
          <p
            style={{
              margin: '0 0 4px',
              color: a.ink,
              fontFamily: "'Caveat', cursive",
              fontSize: '1.02rem',
              fontWeight: 700,
            }}
          >
            {pillar.telugu} · {pillar.sanskrit}
          </p>
          <p
            style={{
              margin: '0 0 6px',
              color: '#3B2507',
              fontFamily: "'Fraunces', serif",
              fontSize: '1rem',
            }}
          >
            {pillar.tagline}
          </p>
          <p
            style={{
              margin: 0,
              color: '#5B3A15',
              fontSize: '0.92rem',
              lineHeight: 1.65,
            }}
          >
            {pillar.blurb}
          </p>
        </div> */}

        <div style={{ marginBottom: '1.1rem' }}>
          <MemberPortrait member={member} accent={pillar.accent} height={300} />
        </div>

        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1rem',
            color: a.ink,
            margin: '0 0 2px',
            opacity: 0.8,
            textAlign: 'center',
          }}
        >
          {member.telugu}
        </p>

        <h3
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: '1.65rem',
            color: '#3B2507',
            margin: '0 0 4px',
            textAlign: 'center',
          }}
        >
          {member.name}
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            color: '#8d7753',
            margin: '0 0 1rem',
            textAlign: 'center',
          }}
        >
          {member.role} · <em>{member.tag}</em>
        </p>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#5B3A15',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {member.bio}
        </p>
      </div>
    </div>
  );
}

function OrbitOverlay({ pillar, showAll }) {
  const a = ACCENTS[pillar.accent];

  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 28,
        width: 'min(360px, calc(100% - 2rem))',
        background: 'rgba(255,253,247,0.82)',
        backdropFilter: 'blur(14px)',
        border: `1px solid ${showAll ? '#ead9b7' : a.soft}`,
        borderTop: `3px solid ${showAll ? '#C58A3E' : a.fill}`,
        borderRadius: 20,
        padding: '1rem 1.1rem',
        boxShadow: '0 18px 42px rgba(59,37,7,0.10)',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {showAll ? (
        <>
          <p
            style={{
              margin: '0 0 6px',
              color: '#8B6A3E',
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Final constellation
          </p>

          <h3
            style={{
              margin: '0 0 6px',
              fontFamily: "'Fraunces', serif",
              fontSize: '1.2rem',
              color: '#3B2507',
              fontWeight: 500,
            }}
          >
            The full circle comes together
          </h3>

          <p
            style={{
              margin: 0,
              color: '#5B3A15',
              fontSize: '0.88rem',
              lineHeight: 1.6,
            }}
          >
            Nature, design, labour, and stewardship move together as one living ecosystem.
          </p>
        </>
      ) : (
        <>
          <p
            style={{
              margin: '0 0 4px',
              color: a.ink,
              fontFamily: "'Caveat', cursive",
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {pillar.numeral} · {pillar.telugu}
          </p>

          <h3
            style={{
              margin: '0 0 4px',
              fontFamily: "'Fraunces', serif",
              fontSize: '1.2rem',
              color: '#3B2507',
              fontWeight: 500,
            }}
          >
            {pillar.english}
          </h3>

          <p
            style={{
              margin: '0 0 6px',
              color: '#7a5a2c',
              fontStyle: 'italic',
              fontSize: '0.88rem',
            }}
          >
            {pillar.tagline}
          </p>

          <p
            style={{
              margin: 0,
              color: '#5B3A15',
              fontSize: '0.86rem',
              lineHeight: 1.6,
            }}
          >
            {pillar.blurb}
          </p>
        </>
      )}
    </div>
  );
}

function RingLegend({ activeIndex, showAll }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.65rem',
        flexWrap: 'wrap',
        padding: '0.75rem 1.5rem 1rem',
      }}
    >
      {PILLARS.map((pillar, idx) => {
        const a = ACCENTS[pillar.accent];
        const active = showAll || idx === activeIndex;

        return (
          <div
            key={pillar.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: active ? a.soft : 'rgba(255,255,255,0.22)',
              borderRadius: 24,
              padding: '6px 16px',
              border: active ? `1.5px solid ${a.fill}` : '1px solid rgba(91,58,21,0.12)',
              transform: active ? 'scale(1.04)' : 'scale(1)',
              opacity: active ? 1 : 0.45,
              boxShadow: active ? '0 8px 22px rgba(59,37,7,0.10)' : 'none',
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: a.fill,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.9rem',
                color: a.ink,
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {pillar.numeral}. {pillar.english}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrbitalSVG({ progress, activeIndex, showAll, onSelect, hovered, onHover, tick }) {
  const phaseProgress = easeInOut((progress * 4) % 1);
  const revealProgress = showAll ? easeInOut(clamp((progress - 0.96) / 0.04, 0, 1)) : 0;

  const pulse = 0.5 + 0.5 * Math.sin(tick / 45);
  const centerGlowOpacity = lerp(0.22, 0.34, pulse);
  const centerRingOpacity = lerp(0.12, 0.2, pulse);
  const centerScale = lerp(0.985, 1.015, pulse);

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      <svg
        viewBox="0 0 1000 1000"
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label="Aamrutham team ecosystem"
      >
        <defs>
          <radialGradient id="bgWash" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fff7e6" />
            <stop offset="55%" stopColor="#f5e7c9" />
            <stop offset="100%" stopColor="#F4EBD4" />
          </radialGradient>

          <radialGradient id="mangoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD98A" stopOpacity="1" />
            <stop offset="45%" stopColor="#F4C76A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F4EBD4" stopOpacity="0" />
          </radialGradient>

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#5B3A15"
              floodOpacity="0.16"
            />
          </filter>
        </defs>

        <rect x="0" y="0" width="1000" height="1000" fill="url(#bgWash)" />

        <circle cx={CX} cy={CY} r={460} fill="none" stroke="#eadfca" strokeWidth="1" opacity="0.25" />
        <circle cx={CX} cy={CY} r={320} fill="none" stroke="#efe4d0" strokeWidth="1" opacity="0.35" />

        <circle cx={CX} cy={CY} r={108} fill="url(#mangoGlow)" opacity={centerGlowOpacity} />

        {PILLARS.map((pillar, idx) => {
          const a = ACCENTS[pillar.accent];
          const isActive = idx === activeIndex;
          const isHoveredRing = hovered?.pillarId === pillar.id;

          const currentRadius = showAll
            ? lerp(getFocusRadius(pillar.ring), RING_RADII[pillar.ring], revealProgress)
            : isActive
              ? getFocusRadius(pillar.ring)
              : RING_RADII[pillar.ring];

          const visible = showAll || isActive;
          const baseOpacity = showAll ? lerp(0.22, 0.65, revealProgress) : visible ? 0.82 : 0.08;
          const opacity = isHoveredRing ? Math.min(1, baseOpacity + 0.2) : baseOpacity;
          const strokeWidth = isHoveredRing ? 2.8 : visible ? 2 : 1;

          return (
            <circle
              key={pillar.id}
              cx={CX}
              cy={CY}
              r={currentRadius}
              fill="none"
              stroke={a.fill}
              strokeWidth={strokeWidth}
              strokeDasharray={visible ? '6 10' : '3 10'}
              opacity={opacity}
            />
          );
        })}

        {PILLARS.map((pillar, idx) => {
          const a = ACCENTS[pillar.accent];
          const isActive = idx === activeIndex;
          const visible = showAll || isActive;
          if (!visible) return null;

          const n = pillar.members.length;

          const currentRadius = showAll
            ? lerp(getFocusRadius(pillar.ring), RING_RADII[pillar.ring], revealProgress)
            : getFocusRadius(pillar.ring);

          const baseRotation = RING_SPEEDS[pillar.ring] * progress * Math.PI * 2;

          return pillar.members.map((member, j) => {
            const baseAngle = (j / n) * Math.PI * 2 - Math.PI / 2;
            const angle = baseAngle + baseRotation;
            const x = CX + Math.cos(angle) * currentRadius;
            const y = CY + Math.sin(angle) * currentRadius;

            const isHovered = hovered?.memberName === member.name && hovered?.pillarId === pillar.id;
            const anyHovered = !!hovered;
            const isDimmed = anyHovered && !isHovered;

            const nodeOpacityBase = showAll ? lerp(0.82, 1, revealProgress) : lerp(0.82, 1, phaseProgress);
            const nodeOpacity = isHovered ? 1 : isDimmed ? nodeOpacityBase * 0.42 : nodeOpacityBase;
            const haloOpacityBase = showAll ? lerp(0.12, 0.2, revealProgress) : lerp(0.16, 0.24, phaseProgress);
            const haloOpacity = isHovered ? haloOpacityBase * 1.8 : isDimmed ? haloOpacityBase * 0.45 : haloOpacityBase;
            const scale = isHovered ? 1.12 : 1;

            return (
              <g
                key={`${pillar.id}-${member.name}`}
                transform={`translate(${x},${y}) scale(${scale})`}
                onClick={() => onSelect({ member, pillar })}
                onMouseEnter={() => onHover({ memberName: member.name, pillarId: pillar.id, x, y, accent: pillar.accent })}
                onMouseLeave={() => onHover(null)}
                style={{ cursor: 'pointer', transition: 'transform 180ms ease, opacity 180ms ease' }}
                role="button"
                tabIndex={0}
                fill={isHovered ? '#3B2507' : a.ink}
                onFocus={() => onHover({ memberName: member.name, pillarId: pillar.id, x, y, accent: pillar.accent })}
                onBlur={() => onHover(null)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect({ member, pillar })}
                aria-label={member.name}
                opacity={nodeOpacity}
              >
                <circle r={30} fill={a.soft} opacity={haloOpacity} />
                <circle r={22} fill={a.soft} opacity={haloOpacity * 0.9} />
                <circle
                  r={16}
                  fill={a.fill}
                  stroke={a.ink}
                  strokeWidth={isHovered ? 2.1 : 1.5}
                  filter="url(#softShadow)"
                />

                <text
                  y={-30}
                  textAnchor="middle"
                  fontFamily="'Caveat', cursive"
                  fontWeight="700"
                  fontSize={14}
                  fill={a.ink}
                >
                  {member.name}
                </text>

                <text
                  y={37}
                  textAnchor="middle"
                  fontFamily="'Caveat', cursive"
                  fontSize={10.5}
                  fill={a.ink}
                  opacity={0.75}
                >
                  {member.telugu}
                </text>
              </g>
            );
          });
        })}

        {hovered && (
          <line
            x1={CX}
            y1={CY}
            x2={hovered.x}
            y2={hovered.y}
            stroke={ACCENTS[hovered.accent].fill}
            strokeWidth="1.4"
            strokeDasharray="5 7"
            opacity="0.38"
          />
        )}

        <g transform={`translate(${CX},${CY}) scale(${centerScale})`}>
          <circle
            r={66}
            fill="rgba(255,248,232,0.98)"
            stroke="#efcf8b"
            strokeWidth="1.6"
          />

          <circle
            r={86}
            fill="none"
            stroke="#efcf8b"
            strokeWidth="1"
            opacity={centerRingOpacity}
          />

          <circle
            r={104}
            fill="none"
            stroke="#efcf8b"
            strokeWidth="0.8"
            opacity="0.1"
          />

          <image
            href={CENTER_LOGO}
            x={-48}
            y={-48}
            width={96}
            height={96}
            preserveAspectRatio="xMidYMid meet"
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </g>
      </svg>
    </div>
  );
}

function MobileView({ onSelect }) {
  return (
    <div style={{ padding: '0 1rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: 52 }}>🥭</span>
      </div>

      {PILLARS.map((pillar) => {
        const a = ACCENTS[pillar.accent];
        return (
          <div
            key={pillar.id}
            style={{
              marginBottom: '2rem',
              background: 'rgba(255,253,247,0.8)',
              border: `1px solid ${a.soft}`,
              borderRadius: 18,
              padding: '1rem',
              boxShadow: '0 12px 26px rgba(59,37,7,0.06)',
            }}
          >
            <div style={{ marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: a.fill,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '0.82rem',
                    color: a.ink,
                    margin: 0,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {pillar.numeral} · {pillar.english}
                </p>
              </div>
              <p
                style={{
                  margin: '0 0 4px',
                  color: '#3B2507',
                  fontFamily: "'Fraunces', serif",
                  fontSize: '1rem',
                }}
              >
                {pillar.tagline}
              </p>
              <p
                style={{
                  margin: 0,
                  color: '#7a5a2c',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                }}
              >
                {pillar.blurb}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {pillar.members.map((member) => (
                <button
                  key={member.name}
                  onClick={() => onSelect({ member, pillar })}
                  style={{
                    background: '#fffdf7',
                    border: `1.5px solid ${a.soft}`,
                    borderRadius: 14,
                    padding: '0.8rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: '0.75rem',
                      color: a.ink,
                      margin: '0 0 2px',
                      opacity: 0.7,
                    }}
                  >
                    {member.telugu}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: '0.92rem',
                      color: '#3B2507',
                      margin: '0 0 2px',
                      fontWeight: 600,
                    }}
                  >
                    {member.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#999', margin: 0 }}>{member.role}</p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TeamPage() {
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);

  const sectionRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    let rafId;

    const loop = () => {
      setTick((t) => t + 1);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const next = scrollable > 0 ? clamp(scrolled / scrollable, 0, 1) : 0;
      setTargetProgress(next);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const animate = () => {
      setProgress((prev) => {
        const next = lerp(prev, targetProgress, 0.085);
        return Math.abs(next - targetProgress) < 0.0005 ? targetProgress : next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetProgress, isMobile]);

  const phase = useMemo(() => {
    if (progress >= 0.96) return 4;
    return Math.min(3, Math.floor(progress * 4));
  }, [progress]);

  const showAll = phase === 4;
  const activePillar = PILLARS[Math.min(phase, 3)];

  const header = (
    <div style={{ textAlign: 'center', padding: '2.2rem 1rem 0.75rem' }}>
      <p
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '0.72rem',
          letterSpacing: '0.32em',
          color: '#8B6A3E',
          textTransform: 'uppercase',
          margin: '0 0 8px',
        }}
      >
        Aamrutham
      </p>

      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
          color: '#3B2507',
          margin: '0 0 8px',
          lineHeight: 1.1,
        }}
      >
        Meet Our Circle
      </h1>

      {!isMobile && (
        <p
          style={{
            color: '#8B6A3E',
            fontSize: '0.86rem',
            fontFamily: "'Caveat', cursive",
            margin: 0,
            opacity: 0.85,
          }}
        >
          Scroll through each pillar · at the end the full ecosystem appears
        </p>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div
        style={{
          background: 'radial-gradient(circle at top, #fbf2df 0%, #F4EBD4 55%, #efe2c5 100%)',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
        }}
      >
        {header}
        <div style={{ padding: '1rem 0 0' }}>
          <MobileView onSelect={setSelected} />
        </div>
        {selected && <BioModal {...selected} onClose={() => setSelected(null)} />}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      style={{
        height: '320vh',
        position: 'relative',
        background: 'radial-gradient(circle at top, #fbf2df 0%, #F4EBD4 55%, #efe2c5 100%)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {header}

        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <OrbitOverlay pillar={activePillar} showAll={showAll} />

          <OrbitalSVG
            progress={progress}
            activeIndex={Math.min(phase, 3)}
            showAll={showAll}
            onSelect={setSelected}
            hovered={hovered}
            onHover={setHovered}
            tick={tick}
          />
        </div>

        <RingLegend activeIndex={Math.min(phase, 3)} showAll={showAll} />
      </div>

      {selected && <BioModal {...selected} onClose={() => setSelected(null)} />}
    </div>
  );
}