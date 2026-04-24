import React, { useMemo, useState } from 'react';

/**
 * Mangoes per day vs age — a rough dietary guideline, not medical advice.
 *
 * Values assume one mango ≈ 200g. The curve rises through childhood, plateaus
 * in the teens/twenties when activity and growth peak, and softens with age.
 * Individual needs vary; this is a starting point, not a prescription.
 */
const DATA = [
  { age: 2,  pcs: 0.25, label: 'Toddlers'      },
  { age: 5,  pcs: 0.5,  label: 'Young kids'    },
  { age: 10, pcs: 1.0,  label: 'School age'    },
  { age: 15, pcs: 1.5,  label: 'Teens'         },
  { age: 25, pcs: 2.0,  label: 'Young adults'  },
  { age: 40, pcs: 1.5,  label: 'Adults'        },
  { age: 60, pcs: 1.0,  label: 'Older adults'  },
  { age: 75, pcs: 0.75, label: 'Seniors'       },
];

const W = 800;
const H = 360;
const PAD = { top: 40, right: 30, bottom: 60, left: 50 };

const X_MIN = 0;
const X_MAX = 80;
const Y_MIN = 0;
const Y_MAX = 2.5;

const x = (a) => PAD.left + ((a - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
const y = (p) => H - PAD.bottom - ((p - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);

// Catmull-Rom → cubic Bézier, so the line reads as a gentle curve.
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

export default function MangoesPerDayChart() {
  const [hovered, setHovered] = useState(null);

  const points = useMemo(
    () => DATA.map((d) => ({ ...d, x: x(d.age), y: y(d.pcs) })),
    []
  );

  const linePath = useMemo(() => smoothPath(points), [points]);
  const areaPath = useMemo(
    () => `${linePath} L ${x(X_MAX)} ${y(0)} L ${x(X_MIN)} ${y(0)} Z`,
    [linePath]
  );

  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80];
  const yTicks = [0, 0.5, 1, 1.5, 2, 2.5];

  return (
    <div className="mpd-wrap">
      <div className="mpd-head">
        <p className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>How Many a Day?</p>
        <h2 className="section-title">Mangoes per day, by <em>age</em></h2>
        <p className="mpd-sub">
          A rough dietary guideline. One mango ≈ 200g. Your appetite and activity can justify more —
          this is a starting point, not a prescription.
        </p>
      </div>

      <figure className="mpd-figure">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mpd-svg"
          role="img"
          aria-label="Line chart of recommended mangoes per day across age groups"
        >
          <defs>
            <linearGradient id="mpd-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor="#f4b331" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f4b331" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {yTicks.map((t) => (
            <g key={`y-${t}`}>
              <line
                x1={PAD.left} x2={W - PAD.right}
                y1={y(t)} y2={y(t)}
                stroke="#ece1c3" strokeWidth="1"
                strokeDasharray={t === 0 ? '0' : '4 6'}
              />
              <text
                x={PAD.left - 10} y={y(t) + 4}
                textAnchor="end"
                fontSize="12" fill="#8a7453"
                fontFamily="'Inter', sans-serif"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Shaded area under the curve */}
          <path d={areaPath} fill="url(#mpd-area)" />

          {/* The curve itself */}
          <path
            d={linePath}
            fill="none"
            stroke="#c68311"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Age tick labels on x-axis */}
          {xTicks.map((t) => (
            <g key={`x-${t}`}>
              <line
                x1={x(t)} x2={x(t)}
                y1={H - PAD.bottom} y2={H - PAD.bottom + 5}
                stroke="#bfa97a" strokeWidth="1"
              />
              <text
                x={x(t)} y={H - PAD.bottom + 20}
                textAnchor="middle"
                fontSize="12" fill="#8a7453"
                fontFamily="'Inter', sans-serif"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Axis titles */}
          <text
            x={W / 2} y={H - 12}
            textAnchor="middle"
            fontSize="13" fill="#5b3a15"
            fontFamily="'Inter', sans-serif"
            fontWeight="600"
          >
            Age (years)
          </text>
          <text
            x={-H / 2} y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="13" fill="#5b3a15"
            fontFamily="'Inter', sans-serif"
            fontWeight="600"
          >
            Mangoes per day
          </text>

          {/* Data points */}
          {points.map((p, i) => {
            const isHovered = hovered === i;
            return (
              <g
                key={p.age}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x} cy={p.y}
                  r={isHovered ? 10 : 6}
                  fill="#fff"
                  stroke="#c68311"
                  strokeWidth={isHovered ? 3 : 2}
                />
                <circle
                  cx={p.x} cy={p.y}
                  r={isHovered ? 4 : 2.5}
                  fill="#c68311"
                />

                {isHovered && (
                  <g>
                    <rect
                      x={p.x - 70} y={p.y - 56}
                      width="140" height="42"
                      rx="8"
                      fill="#fff8e6"
                      stroke="#c68311"
                      strokeWidth="1.5"
                    />
                    <text
                      x={p.x} y={p.y - 38}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#5b3a15"
                      fontFamily="'Inter', sans-serif"
                      fontWeight="700"
                    >
                      {p.label} · age {p.age}
                    </text>
                    <text
                      x={p.x} y={p.y - 22}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#8a6540"
                      fontFamily="'Inter', sans-serif"
                    >
                      ≈ {p.pcs === 1 ? '1 mango' : `${p.pcs} mangoes`}/day
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <figcaption className="mpd-caption">
          Based on general dietary guidance and typical serving sizes. Children under 1 should
          not be given whole mango. Diabetes, kidney conditions, or specific dietary needs may
          change this — ask your doctor or nutritionist for personalised advice.
        </figcaption>
      </figure>

      <ul className="mpd-legend">
        {DATA.map((d) => (
          <li key={d.age}>
            <span className="mpd-legend-dot" />
            <span className="mpd-legend-label"><strong>{d.label}</strong> · {d.pcs === 1 ? '1 mango' : `${d.pcs} mangoes`}/day</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
