#!/usr/bin/env python3
"""Rebuild team-draft.html with Ambient Orbit design."""
import base64, json, re, gzip, io

def gz_decode(b64): return gzip.decompress(base64.b64decode(b64)).decode()
def gz_encode(text):
    buf = io.BytesIO()
    with gzip.GzipFile(fileobj=buf, mode='wb', mtime=0) as f: f.write(text.encode())
    return base64.b64encode(buf.getvalue()).decode()

with open('Aamrutham Meet Our Team.html', 'r') as f: html = f.read()
m = re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.DOTALL)
manifest = json.loads(m.group(1))
tmpl_m = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.DOTALL)
template = json.loads(tmpl_m.group(1))

# ─── patch c8397246 ────────────────────────────────────────────────────────────
KEY = 'c8397246-0485-4439-b889-564ff92c26fd'
code = gz_decode(manifest[KEY]['data'])

NEW_COMPONENTS = '''function MemberDot({ member, pillar, angle, radius, onOpen, cx, cy, isPillarActive, isPillarOther }) {
  const a = ACCENTS[pillar.accent];
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  const cls = ["member-dot", isPillarOther ? "is-pillar-other" : ""].filter(Boolean).join(" ");
  return (
    <g className={cls} transform={`translate(${x}, ${y})`}
      onClick={() => onOpen(member, pillar)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(member, pillar) : null)}
      tabIndex={0} role="button">
      <circle r={isPillarActive ? 28 : 22} className="member-dot__halo" fill={a.soft}
        opacity={isPillarActive ? 0.5 : 0.35} />
      <circle r="14" className="member-dot__core" fill={a.fill} stroke={a.ink} strokeWidth="1" />
      <text y="-28" textAnchor="middle" className="member-dot__name" fill={a.ink}>{member.name}</text>
      <text y="36" textAnchor="middle" className="member-dot__telugu" fill={a.ink}>{member.telugu}</text>
    </g>
  );
}

function RingsCanvas({ onOpen, activePillar, setActivePillar, paused }) {
  const pillars = window.AAMRUTHAM_PILLARS;
  const W = 900, H = 900;
  const cx = W / 2, cy = H / 2;
  const ringRadii = [120, 230, 340, 450];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rings-svg" aria-label="Aamrutham ecosystem">
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
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <circle cx={cx} cy={cy} r="200" fill="url(#sunGlow)" />

      {ringRadii.map((r, i) => {
        const active = activePillar === i;
        const ac = ACCENTS[pillars[i].accent];
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={active ? ac.fill : "#8B6A3E"}
            strokeOpacity={active ? 0.95 : 0.45}
            strokeWidth={active ? 2.2 : 0.7}
            strokeDasharray={i === 0 ? "" : "2 6"}
            filter={active ? "url(#ring-glow)" : undefined}
            className={`ring-track${active ? " ring-track--active" : " ring-track--dim"}`}
          />
        );
      })}

      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const r1 = 465, r2 = 475;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
            stroke="#8B6A3E" strokeOpacity="0.3" strokeWidth="0.8"
          />
        );
      })}

      <g id="__ring-rotating">
        {pillars.map((p, i) => {
          const r = ringRadii[i];
          const count = p.members.length;
          const offsets = [0, Math.PI / 6, -Math.PI / 8, Math.PI / 10];
          return p.members.map((mm, j) => {
            const a = offsets[i] + (j / count) * Math.PI * 2;
            return (
              <MemberDot key={`${i}-${j}`}
                member={mm} pillar={p} angle={a} radius={r}
                cx={cx} cy={cy} onOpen={onOpen} paused={paused}
                isPillarActive={activePillar === i}
                isPillarOther={activePillar !== i}
              />
            );
          });
        })}
      </g>

      <g transform={`translate(${cx}, ${cy})`}>
        <circle r="46" fill="#F6EAD1" stroke="#C58A3E" strokeWidth="1.2" />
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
      <div className="bio-card" onClick={(e) => e.stopPropagation()}
        style={{ "--ink": a.ink, "--fill": a.fill, "--soft": a.soft }}>
        <div className="bio-card__rule" />
        <div className="bio-card__head">
          <div className="bio-card__meta">
            <span className="bio-card__numeral">{pillar.numeral}</span>
            <span className="bio-card__pillar">{pillar.english}</span>
          </div>
          <button className="bio-card__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="bio-card__body">
          <div className="bio-card__portrait" aria-label="Portrait placeholder">
            <div className="bio-card__portrait-inner">
              <Glyph kind={pillar.glyph} size={56} stroke={a.ink} />
              <span>portrait</span>
            </div>
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

function PillarCard({ pillar, active, onClick }) {
  const a = ACCENTS[pillar.accent];
  return (
    <button className={`pillar-card${active ? " is-active" : ""}`} onClick={onClick}
      style={{ "--fill": a.fill, "--soft": a.soft, "--ink-accent": a.ink }}>
      <span className="pillar-card__numeral">{pillar.numeral}</span>
      <span className="pillar-card__content">
        <span className="pillar-card__sanskrit">{pillar.sanskrit}</span>
        <span className="pillar-card__telugu">{pillar.telugu}</span>
        {active && <span className="pillar-card__tagline">{pillar.tagline}</span>}
        {active && <span className="pillar-card__blurb">{pillar.blurb}</span>}
        {active && (
          <span className="pillar-card__members">
            {pillar.members.map(mm => (
              <span key={mm.name} className="pillar-card__chip">{mm.name}</span>
            ))}
          </span>
        )}
      </span>
    </button>
  );
}

function EcosystemRings({ tweaks }) {
  const pillars = window.AAMRUTHAM_PILLARS;
  const [open, setOpen] = useState(null);
  const [activePillar, setActivePillar] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(null);
  const lastRef = useRef(performance.now());
  const rawRot = useRef(0);
  const cycleRef = useRef(null);

  // Auto-cycle pillars every 3.5s, pause on hover or open bio
  useEffect(() => {
    if (hovered || open) { clearInterval(cycleRef.current); return; }
    cycleRef.current = setInterval(() => {
      setActivePillar(p => (p + 1) % pillars.length);
    }, 3500);
    return () => clearInterval(cycleRef.current);
  }, [hovered, open, pillars.length]);

  // RAF: always rotating
  useEffect(() => {
    const speed = tweaks.motion === "still" ? 0 : tweaks.motion === "fast" ? 4 : 1.2;
    function tick(now) {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      const v = (!hovered && !open) ? speed : 0;
      rawRot.current = (rawRot.current + v * dt + 360) % 360;
      const ring = document.getElementById('__ring-rotating');
      if (ring) ring.setAttribute('transform', `rotate(${rawRot.current}, 450, 450)`);
      document.querySelectorAll('.member-dot__name, .member-dot__telugu').forEach(
        t => t.setAttribute('transform', `rotate(${-rawRot.current})`)
      );
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered, open, tweaks.motion]);

  return (
    <div className="ambient-wrap">
      <div className="ambient-stage" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="pillar-panel">
          {pillars.map((p, i) => (
            <PillarCard key={p.id} pillar={p} active={activePillar === i} onClick={() => setActivePillar(i)} />
          ))}
          <nav className="progress-pill" aria-label="Pillars">
            {pillars.map((p, i) => (
              <button key={p.id} className={`progress-dot${activePillar === i ? " is-active" : ""}`}
                aria-label={p.sanskrit} onClick={() => setActivePillar(i)} />
            ))}
          </nav>
        </div>
        <div className="rings-panel">
          <RingsCanvas onOpen={(member, pillar) => setOpen({ member, pillar })}
            activePillar={activePillar} setActivePillar={setActivePillar} paused={paused} />
        </div>
        <BioCard item={open} onClose={() => setOpen(null)} />
      </div>
    </div>
  );
}

window.EcosystemRings = EcosystemRings;
window.ACCENTS = ACCENTS;
'''

# Find the block to replace: from MemberDot to end (window.ACCENTS line)
start = code.find('function MemberDot(')
end_marker = 'window.ACCENTS = ACCENTS;\n'
end = code.find(end_marker) + len(end_marker)
assert start > 0 and end > start, f"Markers not found: start={start}, end={end}"

code = code[:start] + NEW_COMPONENTS + code[end:]
print(f"c8397246 patched: MemberDot at {start}, replaced through {end}")

manifest[KEY]['data'] = gz_encode(code)

# ─── patch template CSS ────────────────────────────────────────────────────────
NEW_CSS = '''
/* ===== Ambient Orbit Layout ===== */
.ambient-wrap { position: relative; }
.ambient-stage {
  display: grid;
  grid-template-columns: 340px 1fr;
  align-items: stretch;
  min-height: 640px;
  overflow: hidden;
}

/* Left pillar panel */
.pillar-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 40px 28px;
  border-right: 1px solid rgba(139,106,62,0.15);
  position: relative;
  background: rgba(244,235,212,0.4);
}

/* Pillar card button */
.pillar-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  background: transparent;
  border: 0;
  border-left: 2.5px solid transparent;
  padding: 11px 8px 11px 12px;
  cursor: pointer;
  color: var(--ink);
  width: 100%;
  transition: border-left-color 0.4s ease, background 0.4s ease, padding-top 0.3s, padding-bottom 0.3s;
}
.pillar-card.is-active {
  border-left-color: var(--fill);
  background: rgba(255,255,255,0.45);
  padding-top: 14px;
  padding-bottom: 14px;
}
.pillar-card:hover:not(.is-active) { background: rgba(255,255,255,0.2); }
.pillar-card__numeral {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 26px;
  font-weight: 300;
  color: var(--fill);
  min-width: 26px;
  line-height: 1.1;
  flex-shrink: 0;
  margin-top: 1px;
}
.pillar-card__content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}
.pillar-card__sanskrit {
  font-family: "Fraunces", serif;
  font-weight: 500;
  font-size: 17px;
  color: var(--ink);
  letter-spacing: -0.01em;
  display: block;
}
.pillar-card__telugu {
  font-family: "Noto Serif Telugu", serif;
  font-size: 12px;
  color: var(--ink-soft);
  display: block;
}
.pillar-card__tagline {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 12.5px;
  color: var(--ink-faint);
  display: block;
  margin-top: 6px;
  line-height: 1.4;
}
.pillar-card__blurb {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink-soft);
  display: block;
  margin-top: 7px;
  max-width: 36ch;
}
.pillar-card__members {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}
.pillar-card__chip {
  font-family: "Fraunces", serif;
  font-size: 10.5px;
  letter-spacing: 0.02em;
  color: var(--ink-accent, var(--ink-soft));
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(139,106,62,0.2);
  padding: 2px 9px;
  border-radius: 20px;
}

/* Progress pill */
.progress-pill {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
  align-items: center;
  background: rgba(244,235,212,0.8);
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid rgba(139,106,62,0.15);
}
.progress-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(139,106,62,0.3);
  border: none; cursor: pointer; padding: 0;
  transition: all 0.35s cubic-bezier(0.34,1.2,0.64,1);
}
.progress-dot.is-active {
  width: 22px;
  border-radius: 3px;
  background: var(--ochre);
}

/* Right rings panel */
.rings-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Ring track transitions */
.ring-track { transition: stroke-opacity 0.55s ease, stroke-width 0.55s ease, stroke 0.55s ease; }

/* Member dot pillar states */
.member-dot { cursor: pointer; outline: none; transition: opacity 0.5s ease; }
.member-dot.is-pillar-other { opacity: 0.4; }
.member-dot__halo { transition: r 0.4s ease, opacity 0.3s; }
.member-dot__core { transition: transform 0.3s; transform-box: fill-box; transform-origin: center; }
.member-dot:hover .member-dot__halo { opacity: 0.7; }
.member-dot:hover .member-dot__core { transform: scale(1.2); }
.member-dot__name {
  font-family: "Fraunces", serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.member-dot__telugu {
  font-family: "Noto Serif Telugu", serif;
  font-size: 11px;
  opacity: 0.75;
}

/* Mobile */
@media (max-width: 900px) {
  .ambient-wrap { height: auto; }
  .ambient-stage {
    position: relative !important;
    height: auto !important;
    min-height: unset !important;
    grid-template-columns: 1fr;
  }
  .pillar-panel {
    border-right: none;
    border-bottom: 1px solid rgba(139,106,62,0.15);
    padding: 28px 20px 48px;
  }
  .rings-panel { min-height: 340px; padding: 12px; }
}
'''

# Replace the old .rings-stage block and surrounding layout CSS in template
# Strategy: append new CSS block right before </style> of block 2
styles_in_template = re.findall(r'(<style>)(.*?)(</style>)', template, re.DOTALL)
print(f"Found {len(styles_in_template)} style blocks in template")

# Find the 2nd style block (index 1) which has .rings-stage
# Replace it: strip old .rings-stage layout, inject new ambient layout CSS
old_style_tag = styles_in_template[1][0] + styles_in_template[1][1] + styles_in_template[1][2]
new_body = styles_in_template[1][1]
# Remove old .rings-stage block
new_body = re.sub(r'\.rings-stage\s*\{[^}]*\}', '', new_body)
new_body = re.sub(r'\.rings-legend\s*\{[^}]*\}', '', new_body)
new_body = re.sub(r'\.rings-inner\s*\{[^}]*\}', '', new_body)
new_body = re.sub(r'\.reveal-wrap\s*\{[^}]*\}', '', new_body)
# Append new CSS
new_body = new_body + NEW_CSS
new_style_tag = '<style>' + new_body + '</style>'

# Replace only the 2nd style block
count = [0]
def replace_nth(match):
    count[0] += 1
    if count[0] == 2:
        return new_style_tag
    return match.group(0)
template = re.sub(r'<style>.*?</style>', replace_nth, template, flags=re.DOTALL)
print("CSS injected into template")

# ─── rebuild HTML ──────────────────────────────────────────────────────────────
new_manifest_json = json.dumps(manifest)
new_template_json = json.dumps(template).replace('</script>', r'<\/script>')

out = re.sub(
    r'(<script type="__bundler/manifest">)(.*?)(</script>)',
    lambda m: m.group(1) + new_manifest_json + m.group(3),
    html, flags=re.DOTALL
)
out = re.sub(
    r'(<script type="__bundler/template">)(.*?)(</script>)',
    lambda m: m.group(1) + new_template_json + m.group(3),
    out, flags=re.DOTALL
)

with open('team-draft.html', 'w') as f: f.write(out)
print(f"Done — team-draft.html written ({len(out):,} bytes)")
