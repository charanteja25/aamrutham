import React, { useState, useEffect, useRef } from 'react';

const Glyph = ({ kind, size = 28, stroke = "currentColor" }) => {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke,
    strokeWidth: 1.3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (kind === "sun") {
    const rays = Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const x1 = 20 + Math.cos(a) * 11;
      const y1 = 20 + Math.sin(a) * 11;
      const x2 = 20 + Math.cos(a) * 15;
      const y2 = 20 + Math.sin(a) * 15;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    });
    return (
      <svg {...common}>
        <circle cx="20" cy="20" r="7" />
        {rays}
      </svg>
    );
  }
  if (kind === "compass") {
    return (
      <svg {...common}>
        <circle cx="20" cy="20" r="13" />
        <path d="M20 8 L23 20 L20 32 L17 20 Z" fill={stroke} fillOpacity="0.15" />
        <circle cx="20" cy="20" r="1.2" fill={stroke} />
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg {...common}>
        <path d="M10 28 C 10 15, 20 8, 30 8 C 30 20, 22 30, 10 30 Z" />
        <path d="M12 28 C 18 22, 24 16, 28 10" />
      </svg>
    );
  }
  if (kind === "mango") {
    return (
      <svg {...common}>
        <path d="M14 10 C 9 14, 8 24, 16 30 C 26 33, 32 24, 30 15 C 28 10, 22 8, 14 10 Z" />
        <path d="M20 10 C 22 8, 24 7, 26 7" />
      </svg>
    );
  }
  if (kind === "bee") {
    return (
      <svg {...common}>
        <ellipse cx="20" cy="22" rx="8" ry="6" />
        <path d="M16 18 L16 26 M20 17 L20 27 M24 18 L24 26" />
        <path d="M12 18 C 8 14, 10 10, 14 12 Z" />
        <path d="M28 18 C 32 14, 30 10, 26 12 Z" />
      </svg>
    );
  }
  return null;
};


// Ecosystem Rings — the main orbital visualization.
// - Desktop: concentric rings, each holds a pillar; members orbit on their ring.
// - A slow continuous rotation (paused on hover/focus).
// - Click a member → bio card opens (unfolds like a pressed leaf).
// - Click a pillar label → the ring pulses and highlights its members.


const ACCENTS = {
  ochre:      { fill: "#C58A3E", soft: "#E9C98B", ink: "#5B3A15" },
  leaf:       { fill: "#3F6B3A", soft: "#A9C49A", ink: "#1F3A1D" },
  terracotta: { fill: "#B5502E", soft: "#E2A98C", ink: "#5B2311" },
  mango:      { fill: "#E3A432", soft: "#F4D891", ink: "#6A430E" },
};

function RingLabel({ pillar, onClick, active, isNew }) {
  const a = ACCENTS[pillar.accent];
  return (
    <button
      onClick={onClick}
      className={["ring-label", active ? "is-active" : "", isNew ? "is-new" : ""].filter(Boolean).join(" ")}
      style={{ "--ink": a.ink, "--fill": a.fill, "--soft": a.soft }}
    >
      <span className="ring-label__numeral">{pillar.numeral}</span>
      <span className="ring-label__stack">
        <span className="ring-label__telugu">{pillar.telugu}</span>
        <span className="ring-label__english">{pillar.english}</span>
      </span>
      <span className="ring-label__glyph">
        <Glyph kind={pillar.glyph} size={22} stroke={a.ink} />
      </span>
    </button>
  );
}

function MemberDot({ member, pillar, angle, radius, onOpen, cx, cy, isPillarActive, isNew }) {
  const a = ACCENTS[pillar.accent];
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  const r = isPillarActive ? 22 : 14;
  const clipId = `clip-${member.name.replace(/[\s&]/g, '-')}`;
  return (
    <g className={["member-dot", isPillarActive ? "is-pillar-active" : "", isNew ? "is-new" : ""].filter(Boolean).join(" ")}
      style={isNew ? {"--dot-delay": `${(angle % (Math.PI*2) / (Math.PI*2) * 0.4).toFixed(2)}s`} : {}}
      transform={`translate(${x}, ${y})`}
      onClick={() => onOpen(member, pillar)}
      onKeyDown={(e) => e.key === "Enter" ? onOpen(member, pillar) : null}
      tabIndex={0} role="button">
      <circle r={isPillarActive ? 34 : 22} className="member-dot__halo"
        fill={a.soft} opacity={isPillarActive ? 0.45 : 0.35} />
      {member.photo ? (
        <g className="member-dot__photo">
          <clipPath id={clipId}><circle r={r} /></clipPath>
          <image href={member.photo} x={-r} y={-r} width={r*2} height={r*2}
            clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
          <circle r={r} fill="none" stroke={a.ink} strokeWidth={isPillarActive ? 2 : 1.2} />
        </g>
      ) : (
        <circle r={r} className="member-dot__core"
          fill={isPillarActive ? a.soft : a.fill} stroke={a.ink}
          strokeWidth={isPillarActive ? 1.5 : 1} />
      )}
      <text y={isPillarActive ? "-42" : "-28"} textAnchor="middle" className="member-dot__name" fill={a.ink}>{member.name}</text>
      <text y={isPillarActive ? "50"  : "36"}  textAnchor="middle" className="member-dot__telugu" fill={a.ink}>{member.telugu}</text>
    </g>
  );
}

function RingsCanvas({ onOpen, activePillar, setActivePillar, paused, revealed }) {
  const pillars = PILLARS;
  const W = 1000, H = 1000;
  const cx = W / 2, cy = H / 2;
  const ringRadii = [130, 240, 350, 460];

  return (
    <svg viewBox={`-60 -60 ${W+120} ${H+120}`} className="rings-svg" aria-label="Aamrutham ecosystem">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4D891" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#E9C98B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E9C98B" stopOpacity="0" />
        </radialGradient>
        <pattern id="paper" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r="0.35" fill="#5B3A15" opacity="0.05" />
        </pattern>
              <filter id="ring-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sun glow at center */}
      <circle cx={cx} cy={cy} r="200" fill="url(#sunGlow)" />

      {ringRadii.map((r, i) => {
        if (i >= revealed) return null;
        const active = activePillar === i;
        const ac = ACCENTS[pillars[i].accent];
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={active ? ac.fill : "#8B6A3E"}
            strokeOpacity={active ? 0.9 : 0.22}
            strokeWidth={active ? 2 : 0.8}
            strokeDasharray={i === 0 ? "" : "2 6"}
            filter={active ? "url(#ring-glow)" : undefined}
            className={["ring-track", active ? "is-active" : "", i === revealed-1 ? "ring-track-new" : ""].filter(Boolean).join(" ")}
          />
        );
      })}

      {/* Decorative radial ticks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const r1 = 505, r2 = 520;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke="#8B6A3E"
            strokeOpacity="0.3"
            strokeWidth="0.8"
          />
        );
      })}

      {/* Rotating group */}
      <g id="__ring-rotating">
        {pillars.map((p, i) => {
          if (i >= revealed) return null;
          const r = ringRadii[i];
          const count = p.members.length;
          const offsets = [0, Math.PI / 6, -Math.PI / 8, Math.PI / 10];
          const isNewRing = i === revealed - 1;
          return p.members.map((mm, j) => {
            const a = offsets[i] + (j / count) * Math.PI * 2;
            return (
              <MemberDot key={`${i}-${j}`}
                member={mm} pillar={p} angle={a} radius={r}
                cx={cx} cy={cy} onOpen={onOpen}
                isPillarActive={activePillar === i} isNew={isNewRing} />
            );
          });
        })}
      </g>

      {/* Center mark — the "amrutham" drop */}
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r="52" fill="#F6EAD1" stroke="#C58A3E" strokeWidth="1.2" />
        <text textAnchor="middle" y="-6" className="center-script">Aamrutham</text>
        <text textAnchor="middle" y="14" className="center-telugu">అమృతం</text>
        <text textAnchor="middle" y="32" className="center-sub">the grove</text>
      </g>
    </svg>
  );
}

function BioCard({ item, onClose }) {
  if (!item) return null;
  const { member, pillar } = item;
  const a = ACCENTS[pillar.accent];
  return (
    <div className="bio-backdrop" onClick={onClose}>
      <div
        className="bio-card"
        onClick={(e) => e.stopPropagation()}
        style={{ "--ink": a.ink, "--fill": a.fill, "--soft": a.soft }}
      >
        <div className="bio-card__rule" />
        <div className="bio-card__head">
          <div className="bio-card__meta">
            <span className="bio-card__numeral">{pillar.numeral}</span>
            <span className="bio-card__pillar">{pillar.english}</span>
          </div>
          <button className="bio-card__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="bio-card__body">
          <div className="bio-card__portrait">
            {member.photo
              ? <img src={member.photo} alt={member.name} className="bio-card__photo" />
              : <div className="bio-card__portrait-inner"><Glyph kind={pillar.glyph} size={56} stroke={a.ink} /></div>
            }
          </div>
          <div className="bio-card__text">
            <p className="bio-card__telugu">{member.telugu}</p>
            <h3 className="bio-card__name">{member.name}</h3>
            <p className="bio-card__role">{member.role} · <em>{member.tag}</em></p>
            <p className="bio-card__bio">{member.bio}</p>
          </div>
        </div>
        <div className="bio-card__foot">
          <span>{pillar.sanskrit}</span>
          <span>·</span>
          <span>{pillar.tagline}</span>
        </div>
      </div>
    </div>
  );
}

function PillarStory({ pillar }) {
  if (!pillar) return null;
  const a = ACCENTS[pillar.accent];
  return (
    <div className="pillar-story" key={pillar.id}
      style={{ "--fill": a.fill, "--soft": a.soft, "--ink-accent": a.ink }}>
      <div className="pillar-story__numeral">{pillar.numeral}</div>
      <div className="pillar-story__body">
        <div className="pillar-story__sanskrit">{pillar.sanskrit}</div>
        <div className="pillar-story__telugu">{pillar.telugu}</div>
        <div className="pillar-story__tagline">{pillar.tagline}</div>
        <p className="pillar-story__blurb">{pillar.blurb}</p>
        <div className="pillar-story__members">
          {pillar.members.map(mm => (
            <span key={mm.name} className="pillar-story__chip">{mm.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PillarBar({ pillars, revealed, activePillar, onSelect }) {
  return (
    <div className="pillar-bar">
      {pillars.map((p, i) => {
        const a = ACCENTS[p.accent];
        const isRevealed = i < revealed;
        const isActive = activePillar === i;
        return (
          <button key={p.id}
            className={["pillar-bar__tab", isRevealed ? "is-revealed" : "", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
            style={{ "--fill": a.fill }}
            onClick={() => isRevealed && onSelect(i)}
            disabled={!isRevealed}>
            <span className="pillar-bar__numeral">{p.numeral}</span>
            <span className="pillar-bar__name">{p.sanskrit}</span>
          </button>
        );
      })}
    </div>
  );
}


function PillarAccordion({ pillar, isRevealed, isActive }) {
  const a = ACCENTS[pillar.accent];
  return (
    <div className={["pa", isRevealed ? "is-revealed" : "", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
         style={{ "--ink": a.ink, "--fill": a.fill, "--soft": a.soft }}>
      <div className="pa__label">
        <span className="pa__numeral">{pillar.numeral}</span>
        <div className="pa__stack">
          <span className="pa__telugu">{pillar.telugu}</span>
          <span className="pa__english">{pillar.english}</span>
        </div>
        <span className="pa__glyph"><Glyph kind={pillar.glyph} size={20} stroke={a.ink} /></span>
      </div>
      <div className="pa__hover-popup">
        <p className="pa__hover-title">{pillar.sanskrit}</p>
        {pillar.members.map(m => (
          <div key={m.name} className="pa__mini-member">
            <div className="pa__mini-dot" />
            <span>{m.name}</span>
          </div>
        ))}
      </div>
      <div className="pa__body">
        <p className="pa__tagline">{pillar.tagline}</p>
        <p className="pa__blurb">{pillar.blurb}</p>
      </div>
    </div>
  );
}

function PillarTabs({ pillars, revealed }) {
  return (
    <div className="ptabs">
      {pillars.map((p, i) => {
        const a = ACCENTS[p.accent];
        return (
          <div key={p.id}
            className={["ptab", i < revealed ? "is-active" : ""].join(" ")}
            style={{ "--fill": a.fill, "--soft": a.soft, "--ink": a.ink }}>
            <span className="ptab__numeral">{p.numeral}</span>
            <span className="ptab__name">{p.english}</span>
          </div>
        );
      })}
    </div>
  );
}

function EcosystemRings({ tweaks }) {
  const pillars = PILLARS;
  const [open, setOpen] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const rafRef = useRef(null);
  const lastRef = useRef(performance.now());
  const rawRot = useRef(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const scrolled = -wrap.getBoundingClientRect().top;
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      const newRevealed = Math.min(4, Math.ceil(p * 4));
      setRevealed(newRevealed);
      setActivePillar(newRevealed > 0 ? newRevealed - 1 : null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const speed = tweaks.motion === "still" ? 0 : tweaks.motion === "fast" ? 4 : 1.2;
    function tick(now) {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      const v = (revealed >= 4 && !open) ? speed : 0;
      rawRot.current = (rawRot.current + v * dt + 360) % 360;
      const ring = document.getElementById('__ring-rotating');
      if (ring) ring.setAttribute('transform', `rotate(${rawRot.current}, 500, 500)`);
      document.querySelectorAll('.member-dot__name, .member-dot__telugu, .member-dot__photo').forEach(
        t => t.setAttribute('transform', `rotate(${-rawRot.current})`)
      );
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealed, open, tweaks.motion]);

  return (
    <div ref={wrapRef} className="reveal-wrap">
      <div className="rings-stage">
        <div className="rings-legend">
          {pillars.map((p, i) => (
            <PillarAccordion key={p.id} pillar={p}
              isRevealed={i < revealed}
              isActive={i === activePillar} />
          ))}
        </div>
        <div className="rings-inner">
          <RingsCanvas onOpen={(member, pillar) => setOpen({ member, pillar })}
            activePillar={activePillar} setActivePillar={() => {}}
            paused={false} revealed={revealed} />
        </div>
        <PillarTabs pillars={pillars} revealed={revealed} />
        <BioCard item={open} onClose={() => setOpen(null)} />
      </div>
    </div>
  );
}

export default EcosystemRings;
