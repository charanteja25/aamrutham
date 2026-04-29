import React, { useState } from 'react';

const DATA = [
  { age: '2',     label: 'Toddlers',      pcs: 0.25, range: 'Age 2',    emoji: '¼',  color: '#fff3cd', border: '#f5c842', text: '#7a5a00' },
  { age: '5',     label: 'Young Kids',    pcs: 0.5,  range: 'Age 5',    emoji: '½',  color: '#fde8d8', border: '#e07b39', text: '#7a3a00' },
  { age: '10',    label: 'School Age',    pcs: 1.0,  range: 'Age 10',   emoji: '1',  color: '#e8f5e9', border: '#4caf50', text: '#1a5c1a' },
  { age: '15',    label: 'Teens',         pcs: 1.5,  range: 'Age 15',   emoji: '1½', color: '#e3f2fd', border: '#2196f3', text: '#0d47a1' },
  { age: '25',    label: 'Young Adults',  pcs: 2.0,  range: 'Age 25',   emoji: '2',  color: '#f3e5f5', border: '#9c27b0', text: '#4a148c' },
  { age: '40',    label: 'Adults',        pcs: 1.5,  range: 'Age 40',   emoji: '1½', color: '#e0f7fa', border: '#00bcd4', text: '#006064' },
  { age: '60',    label: 'Older Adults',  pcs: 1.0,  range: 'Age 60',   emoji: '1',  color: '#fce4ec', border: '#e91e63', text: '#880e4f' },
  { age: '75+',   label: 'Seniors',       pcs: 0.75, range: 'Age 75+',  emoji: '¾',  color: '#fff8e1', border: '#ff9800', text: '#e65100' },
];

const MAX = 2.0;

function MangoBar({ pcs }) {
  const full  = Math.floor(pcs);
  const frac  = pcs % 1;
  const empty = Math.floor(MAX) - full - (frac > 0 ? 1 : 0);
  return (
    <div className="mpd-bar" aria-label={`${pcs} mangoes per day`}>
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="mpd-mango mpd-mango--full">🥭</span>)}
      {frac > 0 && <span className="mpd-mango mpd-mango--frac" style={{ opacity: 0.4 + frac * 0.5 }}>🥭</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="mpd-mango mpd-mango--empty">🥭</span>)}
    </div>
  );
}

export default function MangoesPerDayChart() {
  const [active, setActive] = useState(null);

  return (
    <div className="mpd-wrap2">
      <div className="mpd-head2">
        <span className="section-eyebrow">🥭 Mango Intake Guide</span>
        <h2 className="mpd-title2">How many mangoes a day,<br /><em>by age?</em></h2>
        <p className="mpd-sub2">One mango ≈ 200g · A starting point, not a prescription</p>
      </div>

      <div className="mpd-grid2">
        {DATA.map((d, i) => {
          const isActive = active === i;
          return (
            <button
              key={d.age}
              className={`mpd-card2${isActive ? ' mpd-card2--active' : ''}`}
              style={{
                background: d.color,
                borderColor: isActive ? d.border : `${d.border}55`,
                '--mpd-border': d.border,
              }}
              onClick={() => setActive(isActive ? null : i)}
            >
              <div className="mpd-card2-age" style={{ color: d.border }}>{d.range}</div>
              <div className="mpd-card2-label" style={{ color: d.text }}>{d.label}</div>
              <div className="mpd-card2-count" style={{ color: d.border }}>
                <span className="mpd-card2-num">{d.pcs}</span>
                <span className="mpd-card2-unit">mango{d.pcs !== 1 ? 's' : ''}/day</span>
              </div>
              <MangoBar pcs={d.pcs} />
              {isActive && (
                <div className="mpd-card2-tip" style={{ color: d.text }}>
                  {d.pcs < 1
                    ? 'Small portions are ideal at this age — mangoes are high in natural sugar.'
                    : d.pcs === 2.0
                    ? 'Peak activity — 2 mangoes/day provides great energy and vitamins.'
                    : d.pcs >= 1.5
                    ? 'Growing body needs the vitamins and natural sugars mangoes provide.'
                    : 'Moderate intake recommended — balance with other seasonal fruits.'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="mpd-disclaimer2">
        General dietary guidance only. Not medical advice. Adjust for diabetes, kidney conditions,
        or specific dietary needs — consult your doctor or nutritionist.
      </p>
    </div>
  );
}
