#!/usr/bin/env python3
"""team-draft.html: scroll reveal + expanded pillar story + bottom nav bar."""
import base64, json, re, gzip, io

def gz_decode(b64): return gzip.decompress(base64.b64decode(b64)).decode()
def gz_encode(text):
    buf = io.BytesIO()
    with gzip.GzipFile(fileobj=buf, mode='wb', mtime=0) as f: f.write(text.encode())
    return base64.b64encode(buf.getvalue()).decode()

with open('Aamrutham Meet Our Team.html', 'r') as f: html = f.read()
m   = re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.DOTALL)
manifest = json.loads(m.group(1))
tmpl_m = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.DOTALL)
template = json.loads(tmpl_m.group(1))

KEY = 'c8397246-0485-4439-b889-564ff92c26fd'
code = gz_decode(manifest[KEY]['data'])

# ── 1. RingLabel: add isNew ───────────────────────────────────────────────────
code = code.replace(
    'function RingLabel({ pillar, onClick, active }) {',
    'function RingLabel({ pillar, onClick, active, isNew }) {'
).replace(
    'className={`ring-label ${active ? "is-active" : ""}`}',
    'className={["ring-label", active ? "is-active" : "", isNew ? "is-new" : ""].filter(Boolean).join(" ")}'
)

# ── 2. MemberDot: isPillarActive → glyph pop ─────────────────────────────────
OLD_DOT = '''function MemberDot({ member, pillar, angle, radius, onOpen, cx, cy, paused }) {
  const a = ACCENTS[pillar.accent];
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  return (
    <g
      className="member-dot"
      transform={`translate(${x}, ${y})`}
      onClick={() => onOpen(member, pillar)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(member, pillar) : null)}
      tabIndex={0}
      role="button"
    >
      <circle r="22" className="member-dot__halo" fill={a.soft} opacity="0.35" />
      <circle r="14" className="member-dot__core" fill={a.fill} stroke={a.ink} strokeWidth="1" />
      <text
        y="-28"
        textAnchor="middle"
        className="member-dot__name"
        fill={a.ink}
      >
        {member.name}
      </text>
      <text
        y="36"
        textAnchor="middle"
        className="member-dot__telugu"
        fill={a.ink}
      >
        {member.telugu}
      </text>
    </g>
  );
}'''
NEW_DOT = '''function MemberDot({ member, pillar, angle, radius, onOpen, cx, cy, isPillarActive, isNew }) {
  const a = ACCENTS[pillar.accent];
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  return (
    <g className={["member-dot", isPillarActive ? "is-pillar-active" : "", isNew ? "is-new" : ""].filter(Boolean).join(" ")}
      transform={`translate(${x}, ${y})`}
      onClick={() => onOpen(member, pillar)}
      onKeyDown={(e) => e.key === "Enter" ? onOpen(member, pillar) : null}
      tabIndex={0} role="button">
      <circle r={isPillarActive ? 34 : 22} className="member-dot__halo"
        fill={a.soft} opacity={isPillarActive ? 0.45 : 0.35} />
      <circle r={isPillarActive ? 22 : 14} className="member-dot__core"
        fill={isPillarActive ? a.soft : a.fill} stroke={a.ink}
        strokeWidth={isPillarActive ? 1.5 : 1} />
      {isPillarActive && <g transform="translate(-11,-11)"><Glyph kind={pillar.glyph} size={22} stroke={a.ink}/></g>}
      <text y={isPillarActive ? "-42" : "-28"} textAnchor="middle" className="member-dot__name" fill={a.ink}>{member.name}</text>
      <text y={isPillarActive ? "50"  : "36"}  textAnchor="middle" className="member-dot__telugu" fill={a.ink}>{member.telugu}</text>
    </g>
  );
}'''
assert OLD_DOT in code
code = code.replace(OLD_DOT, NEW_DOT)

# ── 3. RingsCanvas: revealed filter + glow filter + __ring-rotating ──────────
code = code.replace(
    'function RingsCanvas({ onOpen, activePillar, setActivePillar, rotation, paused })',
    'function RingsCanvas({ onOpen, activePillar, setActivePillar, paused, revealed })'
)
OLD_DEFS = '''      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4D891" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#E9C98B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E9C98B" stopOpacity="0" />
        </radialGradient>
        <pattern id="paper" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r="0.35" fill="#5B3A15" opacity="0.05" />
        </pattern>
      </defs>'''
code = code.replace(OLD_DEFS, OLD_DEFS.replace('</defs>', '''        <filter id="ring-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>'''))

OLD_TRACKS = '''      {/* Ring tracks */}
      {ringRadii.map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#8B6A3E"
          strokeOpacity={activePillar === i ? 0.55 : 0.22}
          strokeWidth={activePillar === i ? 1.4 : 0.8}
          strokeDasharray={i === 0 ? "" : "2 6"}
          className={`ring-track ${activePillar === i ? "is-active" : ""}`}
        />
      ))}'''
NEW_TRACKS = '''      {ringRadii.map((r, i) => {
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
      })}'''
assert OLD_TRACKS in code
code = code.replace(OLD_TRACKS, NEW_TRACKS)

OLD_DOT_BLOCK = '''        {pillars.map((p, i) => {
          const r = ringRadii[i];
          const count = p.members.length;
          // Different starting offsets per ring so names don't stack vertically
          const offsets = [0, Math.PI / 6, -Math.PI / 8, Math.PI / 10];
          return p.members.map((m, j) => {
            const a = offsets[i] + (j / count) * Math.PI * 2;
            return (
              <MemberDot
                key={`${i}-${j}`}
                member={m}
                pillar={p}
                angle={a}
                radius={r}
                cx={cx}
                cy={cy}
                onOpen={onOpen}
                paused={paused}
              />
            );
          });
        })}'''
NEW_DOT_BLOCK = '''        {pillars.map((p, i) => {
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
        })}'''
assert OLD_DOT_BLOCK in code
code = code.replace(OLD_DOT_BLOCK, NEW_DOT_BLOCK)

code = code.replace(
    '''      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: "transform 0.6s cubic-bezier(.2,.7,.2,1)",
        }}
      >''',
    '      <g id="__ring-rotating">'
)
code = code.replace('viewBox={`0 0 ${W} ${H}`}', 'viewBox={`-60 -60 ${W+120} ${H+120}`}')

# ── 4. New components: PillarStory + PillarBar + EcosystemRings ───────────────
OLD_ECO = '''function EcosystemRings({ tweaks }) {
  const pillars = window.AAMRUTHAM_PILLARS;
  const [open, setOpen] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef(null);
  const lastRef = useRef(performance.now());

  // Continuous slow rotation
  useEffect(() => {
    const speed = tweaks.motion === "still" ? 0 : tweaks.motion === "fast" ? 4 : 1.2; // deg per second
    function tick(now) {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (!paused && !open && speed > 0) {
        setRotation((r) => (r + speed * dt) % 360);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, open, tweaks.motion]);

  return (
    <div
      className="rings-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rings-legend">
        {pillars.map((p, i) => (
          <RingLabel
            key={p.id}
            pillar={p}
            active={activePillar === i}
            onClick={() => setActivePillar(activePillar === i ? null : i)}
          />
        ))}
      </div>
      <div className="rings-inner">
        <RingsCanvas
          onOpen={(member, pillar) => setOpen({ member, pillar })}
          activePillar={activePillar}
          setActivePillar={setActivePillar}
          rotation={rotation}
          paused={paused}
        />
      </div>
      <BioCard item={open} onClose={() => setOpen(null)} />
    </div>
  );
}'''

NEW_COMPONENTS = '''function PillarStory({ pillar }) {
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

function EcosystemRings({ tweaks }) {
  const pillars = window.AAMRUTHAM_PILLARS;
  const [open, setOpen] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [userSelected, setUserSelected] = useState(false);
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
      if (!userSelected) setActivePillar(newRevealed > 0 ? newRevealed - 1 : null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [userSelected]);

  const handleTabSelect = (i) => {
    setActivePillar(activePillar === i ? null : i);
    setUserSelected(true);
  };

  useEffect(() => {
    const speed = tweaks.motion === "still" ? 0 : tweaks.motion === "fast" ? 4 : 1.2;
    function tick(now) {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      const v = (revealed >= 4 && !open) ? speed : 0;
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
  }, [revealed, open, tweaks.motion]);

  return (
    <div ref={wrapRef} className="reveal-wrap">
      <div className="rings-stage">
        <div className="rings-legend">
          <PillarStory pillar={activePillar !== null ? pillars[activePillar] : null} />
        </div>
        <div className="rings-inner">
          <RingsCanvas onOpen={(member, pillar) => setOpen({ member, pillar })}
            activePillar={activePillar} setActivePillar={() => {}}
            paused={false} revealed={revealed} />
        </div>
        <PillarBar pillars={pillars} revealed={revealed}
          activePillar={activePillar} onSelect={handleTabSelect} />
        <BioCard item={open} onClose={() => setOpen(null)} />
      </div>
    </div>
  );
}'''

assert OLD_ECO in code
code = code.replace(OLD_ECO, NEW_COMPONENTS)
print("c8397246 patched:", "__ring-rotating" in code, "PillarBar" in code, "PillarStory" in code)
manifest[KEY]['data'] = gz_encode(code)

# ── 5. CSS ────────────────────────────────────────────────────────────────────
NEW_CSS = """
/* ===== Scroll reveal layout ===== */
.reveal-wrap { position: relative; height: 500vh; }
.rings-stage {
  position: sticky !important;
  top: 0;
  height: 100vh !important;
  min-height: unset !important;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas: "story rings" "bar bar";
  overflow: hidden;
}
.rings-legend { grid-area: story; display: flex; align-items: center; padding: 32px 24px 24px 40px; border-right: 1px solid rgba(139,106,62,0.12); }
.rings-inner  { grid-area: rings; overflow: hidden; padding: 16px; }
.rings-svg    { width: 100%; height: 100%; overflow: hidden; display: block; }

/* ===== Pillar story (left panel) ===== */
.pillar-story {
  animation: story-enter 0.5s cubic-bezier(0.2,0.9,0.4,1) both;
  width: 100%;
}
@keyframes story-enter {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pillar-story__numeral {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 48px;
  font-weight: 300;
  color: var(--fill);
  line-height: 1;
  margin-bottom: 10px;
}
.pillar-story__body { display: flex; flex-direction: column; gap: 4px; }
.pillar-story__sanskrit {
  font-family: "Fraunces", serif;
  font-weight: 500;
  font-size: 22px;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.pillar-story__telugu {
  font-family: "Noto Serif Telugu", serif;
  font-size: 13px;
  color: var(--ink-soft);
}
.pillar-story__tagline {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 13px;
  color: var(--ink-faint);
  margin-top: 6px;
  line-height: 1.5;
}
.pillar-story__blurb {
  font-size: 13px;
  line-height: 1.65;
  color: var(--ink-soft);
  margin: 10px 0 0;
  max-width: 34ch;
}
.pillar-story__members {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.pillar-story__chip {
  font-family: "Fraunces", serif;
  font-size: 11px;
  color: var(--ink-accent);
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(139,106,62,0.2);
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

/* ===== Bottom pillar bar ===== */
.pillar-bar {
  grid-area: bar;
  display: flex;
  border-top: 1px solid rgba(139,106,62,0.15);
  background: rgba(244,235,212,0.7);
  backdrop-filter: blur(4px);
}
.pillar-bar__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 8px;
  border: none;
  background: transparent;
  cursor: default;
  opacity: 0.25;
  border-bottom: 2px solid transparent;
  transition: opacity 0.4s ease, border-color 0.4s ease, background 0.3s ease;
}
.pillar-bar__tab.is-revealed {
  opacity: 0.6;
  cursor: pointer;
}
.pillar-bar__tab.is-revealed:hover { opacity: 0.85; background: rgba(255,255,255,0.3); }
.pillar-bar__tab.is-active {
  opacity: 1;
  border-bottom-color: var(--fill);
  background: rgba(255,255,255,0.4);
}
.pillar-bar__tab + .pillar-bar__tab { border-left: 1px solid rgba(139,106,62,0.1); }
.pillar-bar__numeral {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 16px;
  font-weight: 300;
  color: var(--fill);
  line-height: 1;
}
.pillar-bar__name {
  font-family: "Fraunces", serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

/* Ring + dot entry */
@keyframes ring-enter { from { opacity: 0; } to { opacity: 1; } }
.ring-track-new { animation: ring-enter 0.7s ease both; }
.member-dot.is-new { animation: ring-enter 0.5s ease 0.2s both; }
.ring-track { transition: stroke 0.5s ease, stroke-opacity 0.5s ease, stroke-width 0.5s ease; }

/* Dot active */
@keyframes dot-bounce {
  0%  { transform: scale(1); }
  45% { transform: scale(1.5); }
  70% { transform: scale(0.88); }
  100%{ transform: scale(1); }
}
.member-dot.is-pillar-active .member-dot__core {
  animation: dot-bounce 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
}
.member-dot__core { transform-box: fill-box; transform-origin: center; }

/* Mobile */
@media (max-width: 768px) {
  .reveal-wrap { height: auto; }
  .rings-stage {
    position: relative !important; height: auto !important;
    grid-template-columns: 1fr; grid-template-rows: auto auto auto;
    grid-template-areas: "story" "rings" "bar";
  }
  .rings-legend { border-right: none; border-bottom: 1px solid rgba(139,106,62,0.12); padding: 24px 20px; }
  .rings-inner { height: 60vw; min-height: 280px; }
}
"""

styles_in_template = list(re.finditer(r'<style>.*?</style>', template, re.DOTALL))
assert len(styles_in_template) >= 2
tag = styles_in_template[1]
template = template[:tag.end()-8] + NEW_CSS + template[tag.end()-8:]
print("CSS injected")

# ── rebuild ───────────────────────────────────────────────────────────────────
new_manifest_json = json.dumps(manifest)
new_template_json = json.dumps(template).replace('</script>', r'<\/script>')
out = re.sub(r'(<script type="__bundler/manifest">)(.*?)(</script>)',
    lambda x: x.group(1) + new_manifest_json + x.group(3), html, flags=re.DOTALL)
out = re.sub(r'(<script type="__bundler/template">)(.*?)(</script>)',
    lambda x: x.group(1) + new_template_json + x.group(3), out, flags=re.DOTALL)
with open('team-draft.html', 'w') as f: f.write(out)
print(f"Done — {len(out):,} bytes")
