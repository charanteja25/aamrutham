import React, { useMemo, useState } from 'react';

const DATA = [
  { age: 2,  pcs: 0.25, label: 'Toddlers',     color: '#f5c842', text: '#7a5a00' },
  { age: 5,  pcs: 0.5,  label: 'Young Kids',   color: '#e07b39', text: '#7a3a00' },
  { age: 10, pcs: 1.0,  label: 'School Age',   color: '#4caf50', text: '#1a5c1a' },
  { age: 15, pcs: 1.5,  label: 'Teens',        color: '#2196f3', text: '#0d47a1' },
  { age: 25, pcs: 2.0,  label: 'Young Adults', color: '#9c27b0', text: '#4a148c' },
  { age: 40, pcs: 1.5,  label: 'Adults',       color: '#00bcd4', text: '#006064' },
  { age: 60, pcs: 1.0,  label: 'Older Adults', color: '#e91e63', text: '#880e4f' },
  { age: 75, pcs: 0.75, label: 'Seniors',      color: '#ff9800', text: '#e65100' },
];

const W = 800, H = 340;
const PAD = { top: 40, right: 30, bottom: 70, left: 55 };
const X_MIN = 0, X_MAX = 80, Y_MIN = 0, Y_MAX = 2.5;

const xPos = (a) => PAD.left + ((a - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
const yPos = (p) => H - PAD.bottom - ((p - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);

function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function MangoBar({ pcs, color }) {
  const full  = Math.floor(pcs);
  const frac  = pcs % 1;
  const empty = 2 - full - (frac > 0 ? 1 : 0);
  return (
    <div className="mpd-bar">
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} style={{ fontSize: '1rem' }}>🥭</span>)}
      {frac > 0 && <span style={{ fontSize: '1rem', opacity: 0.4 + frac * 0.5 }}>🥭</span>}
      {Array.from({ length: Math.max(0, empty) }).map((_, i) => <span key={`e${i}`} style={{ fontSize: '1rem', opacity: 0.15 }}>🥭</span>)}
    </div>
  );
}

export default function MangoesPerDayChart() {
  const [hovered, setHovered] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const points = useMemo(() => DATA.map(d => ({ ...d, x: xPos(d.age), y: yPos(d.pcs) })), []);
  const linePath = useMemo(() => smoothPath(points), [points]);
  const areaPath = useMemo(() => `${linePath} L ${xPos(X_MAX)} ${yPos(0)} L ${xPos(X_MIN)} ${yPos(0)} Z`, [linePath]);
  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80];
  const yTicks = [0, 0.5, 1, 1.5, 2, 2.5];

  return (
    <div className="mpd-wrap2">
      <div className="mpd-head2">
        <span className="section-eyebrow">🥭 Mango Intake Guide</span>
        <h2 className="mpd-title2">How many mangoes a day,<br /><em>by age?</em></h2>
        <p className="mpd-sub2">One mango ≈ 200g · A starting point, not a prescription</p>
      </div>

      {/* ── SVG Chart ── */}
      <div className="mpd-chart-scroll">
        <figure className="mpd-figure2">
          <svg viewBox={`0 0 ${W} ${H}`} className="mpd-svg2" role="img" aria-label="Mangoes per day by age">
            <defs>
              <linearGradient id="mpd-area2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"   stopColor="#f4b331" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f4b331" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yTicks.map(t => (
              <g key={`y-${t}`}>
                <line x1={PAD.left} x2={W - PAD.right} y1={yPos(t)} y2={yPos(t)}
                  stroke="#ece1c3" strokeWidth="1" strokeDasharray={t === 0 ? '0' : '5 7'} />
                <text x={PAD.left - 10} y={yPos(t) + 4} textAnchor="end"
                  fontSize="13" fill="#8a7453" fontFamily="'Inter', sans-serif" fontWeight="600">
                  {t}
                </text>
              </g>
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#mpd-area2)" />

            {/* Curve */}
            <path d={linePath} fill="none" stroke="#c68311" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" />

            {/* X axis ticks */}
            {xTicks.map(t => (
              <g key={`x-${t}`}>
                <line x1={xPos(t)} x2={xPos(t)} y1={H - PAD.bottom} y2={H - PAD.bottom + 5}
                  stroke="#bfa97a" strokeWidth="1" />
                <text x={xPos(t)} y={H - PAD.bottom + 20} textAnchor="middle"
                  fontSize="13" fill="#8a7453" fontFamily="'Inter', sans-serif">
                  {t}
                </text>
              </g>
            ))}

            {/* Axis labels */}
            <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="13" fill="#5b3a15"
              fontFamily="'Inter', sans-serif" fontWeight="700">Age (years)</text>
            <text x={-H / 2} y={17} transform="rotate(-90)" textAnchor="middle"
              fontSize="13" fill="#5b3a15" fontFamily="'Inter', sans-serif" fontWeight="700">
              Mangoes / day
            </text>

            {/* Data points */}
            {points.map((p, i) => {
              const isHov = hovered === i;
              return (
                <g key={p.age} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                  <circle cx={p.x} cy={p.y} r={isHov ? 14 : 9} fill={p.color} opacity={0.25} />
                  <circle cx={p.x} cy={p.y} r={isHov ? 8 : 6} fill="white" stroke={p.color} strokeWidth="2.5" />
                  <circle cx={p.x} cy={p.y} r={isHov ? 4 : 3} fill={p.color} />
                  {isHov && (
                    <g>
                      <rect x={p.x - 75} y={p.y - 62} width="150" height="46" rx="10"
                        fill="white" stroke={p.color} strokeWidth="2" />
                      <text x={p.x} y={p.y - 44} textAnchor="middle" fontSize="13"
                        fill="#1c1208" fontFamily="'Inter', sans-serif" fontWeight="700">
                        {p.label} · Age {p.age}
                      </text>
                      <text x={p.x} y={p.y - 27} textAnchor="middle" fontSize="12"
                        fill={p.color} fontFamily="'Inter', sans-serif" fontWeight="700">
                        {p.pcs === 1 ? '1 mango' : `${p.pcs} mangoes`} / day
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </figure>
      </div>

      {/* ── Cards ── */}
      <div className="mpd-grid2">
        {DATA.map((d, i) => (
          <button
            key={d.age}
            className={`mpd-card2${activeCard === i ? ' mpd-card2--active' : ''}`}
            style={{ background: `${d.color}22`, borderColor: activeCard === i ? d.color : `${d.color}55`, '--mpd-border': d.color }}
            onClick={() => setActiveCard(activeCard === i ? null : i)}
          >
            <div className="mpd-card2-label" style={{ color: d.text }}>{d.label}</div>
            <div className="mpd-card2-num" style={{ color: d.color }}>{d.pcs}</div>
            <MangoBar pcs={d.pcs} color={d.color} />
          </button>
        ))}
      </div>

      <p className="mpd-disclaimer2">
        General dietary guidance only · Not medical advice · Consult your doctor for personalised advice
      </p>
    </div>
  );
}
