import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
   All timings in ms:
     0        – scene mounts, hanging mango + farmer appear
     0–540    – farmer walks LEFT → RIGHT toward the logo-tree
     540–800  – both arms raise (reaching up to pluck)
     800      – mango detaches, flying mango spawns, arms snap back
     800–     – mango arcs to basket via Bezier, falls in
     960+280  – farmer fades out
   ──────────────────────────────────────────────────────── */

const styles = `
  /* ── overlay ── */
  .mango-cart-animation-layer {
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: none; overflow: hidden; background: transparent;
  }

  /* ═══════════════════════════════
     FLYING MANGO  (realistic shape)
     ═══════════════════════════════ */
  .mc-fruit {
    position: fixed; width: 54px; height: 68px;
    transform-origin: center center;
    will-change: transform; z-index: 10001;
  }
  .mc-body {
    position: absolute; inset: 0;
    /* base gradient – warm mango yellow-orange */
    background:
      radial-gradient(ellipse at 62% 20%, rgba(255,255,200,.75) 0%, transparent 30%),
      radial-gradient(ellipse at 28% 68%, rgba(200,80,0,.30) 0%, transparent 38%),
      radial-gradient(ellipse at 38% 35%, #ffee80 0%, #ffca30 25%, #f59210 52%, #d96000 78%, #b04500 100%);
    border-radius: 58% 46% 66% 40% / 54% 46% 70% 42%;
    transform: rotate(16deg);
    box-shadow:
      inset -5px -10px 0 rgba(0,0,0,.11),
      0 8px 18px rgba(0,0,0,.12);
  }
  /* green blush — realistic mangoes have a green patch */
  .mc-body::after {
    content: '';
    position: absolute; bottom: 14px; right: 3px;
    width: 20px; height: 15px;
    background: radial-gradient(ellipse, rgba(60,150,30,.38) 0%, transparent 70%);
    border-radius: 50%; transform: rotate(-18deg);
  }
  .mc-stem {
    position: absolute; top: -3px; left: 22px;
    width: 4px; height: 13px;
    background: linear-gradient(to bottom, #3d1e06, #70481e);
    border-radius: 4px; transform: rotate(14deg); z-index: 2;
  }
  .mc-leaf {
    position: absolute; top: -12px; left: 26px;
    width: 24px; height: 12px;
    background: linear-gradient(130deg, #68d46c 0%, #2e8c34 55%, #1a6020 100%);
    border-radius: 100% 0 100% 0;
    transform: rotate(-22deg); z-index: 1;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.12);
  }
  /* midrib vein */
  .mc-leaf::after {
    content: ''; position: absolute;
    top: 4px; left: 4px; width: 15px; height: 1.5px;
    background: rgba(255,255,255,.28); border-radius: 2px;
    transform: rotate(10deg);
  }

  /* basket pop */
  .basket-target-pop { animation: basketPop 420ms ease; }
  @keyframes basketPop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.18); }
    70%  { transform: scale(0.94); }
    100% { transform: scale(1); }
  }

  /* ═══════════════════════════════════════════
     HANGING MANGO (small, swaying at logo-tree)
     ═══════════════════════════════════════════ */
  .f-hang-stem {
    position: fixed; width: 3px; height: 13px;
    background: #5a3010; border-radius: 3px; z-index: 10000;
    transform-origin: top center;
    animation: fSway 1.6s ease-in-out infinite alternate;
  }
  .f-hang-mango {
    position: fixed; width: 19px; height: 25px;
    background:
      radial-gradient(ellipse at 36% 28%, #ffe87c 0%, #ffc830 30%, #f59810 64%, #d96500 100%);
    border-radius: 60% 50% 66% 44% / 58% 46% 74% 42%;
    z-index: 10000;
    transform-origin: 50% -15px;
    animation: fSway 1.6s ease-in-out infinite alternate;
    box-shadow: inset -2px -4px 0 rgba(0,0,0,.10);
  }
  @keyframes fSway {
    from { transform: rotate(-7deg); }
    to   { transform: rotate(7deg); }
  }

  /* ═══════════════════════════════════════════
     FARMER — walks L→R toward the logo-tree
     ═══════════════════════════════════════════ */

  /* scene wrapper: anchored so farmer ends up just left of the logo */
  .f-scene {
    position: fixed; z-index: 10000;
    animation: fSceneIn 100ms ease forwards,
               fSceneOut 300ms ease 940ms forwards;
  }
  @keyframes fSceneIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fSceneOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.88) translateY(-6px); }
  }

  /* walk-in: translates from off-left into final resting position */
  .f-walk {
    position: absolute; bottom: 0;
    animation: fWalkIn 540ms cubic-bezier(0.20, 0, 0.42, 1) forwards;
  }
  @keyframes fWalkIn {
    from { transform: translateX(-110px); opacity: 0.05; }
    to   { transform: translateX(0);      opacity: 1;    }
  }

  /* body bob while walking */
  .f-bob {
    animation: fBob 280ms ease-in-out infinite;
  }
  @keyframes fBob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-2px); }
  }

  /* ── Farmer body: 36px wide × 72px tall, facing RIGHT ── */
  .f-man { position: relative; width: 36px; height: 72px; }

  /* ─ Pagdi (saffron turban, rolls up on forehead) ─ */
  .f-pagdi {
    position: absolute; top: 0; left: 4px;
    width: 28px; height: 14px;
    background: linear-gradient(165deg, #ffb200, #e06e00);
    border-radius: 50% 50% 28% 28% / 62% 62% 38% 38%;
    box-shadow: inset 0 -2px 0 rgba(0,0,0,.10);
  }
  /* horizontal wrap band */
  .f-pagdi::before {
    content: ''; position: absolute;
    top: 7px; left: -3px; width: 34px; height: 5px;
    background: #c86000; border-radius: 3px;
  }
  /* pagdi tail/knot visible on the right (since farmer faces right) */
  .f-pagdi::after {
    content: ''; position: absolute;
    top: 1px; right: -6px; width: 10px; height: 10px;
    background: radial-gradient(circle at 38% 38%, #e07500, #b85000);
    border-radius: 50% 40% 50% 42%;
  }

  /* ─ Face (dark south-Indian skin, rounded jaw) ─ */
  .f-face {
    position: absolute; top: 10px; left: 9px;
    width: 18px; height: 20px;
    background: radial-gradient(ellipse at 40% 38%, #9c5220, #6b2e08);
    border-radius: 46% 46% 52% 52%;
    box-shadow: inset -3px -3px 0 rgba(0,0,0,.13);
  }
  /* eyes (two dots) */
  .f-face::before {
    content: ''; position: absolute;
    top: 6px; left: 3px;
    width: 4px; height: 4px;
    background: #140600; border-radius: 50%;
    box-shadow:
      0 0 0 1.5px rgba(255,255,255,.18),
      9px 0 0 #140600,
      9px 0 0 1.5px rgba(255,255,255,.18);
  }
  /* eyebrows */
  .f-face::after {
    content: ''; position: absolute;
    top: 3px; left: 2px;
    width: 6px; height: 2px;
    background: #140600; border-radius: 2px;
    box-shadow: 8px 0 0 #140600;
  }

  /* ─ Nose ─ */
  .f-nose {
    position: absolute; top: 21px; left: 15px;
    width: 6px; height: 4px;
    background: #5a2008;
    border-radius: 50%;
    box-shadow: -1px 2px 0 rgba(0,0,0,.15);
  }

  /* ─ Thick south-Indian mustache ─ */
  .f-mustache {
    position: absolute; top: 24px; left: 10px;
    width: 16px; height: 5px;
    background: #0e0400;
    border-radius: 5px 5px 8px 8px;
  }
  /* center gap to read as two halves */
  .f-mustache::after {
    content: ''; position: absolute;
    top: 0; left: 7px; width: 2px; height: 5px;
    background: #6b2e08;
  }

  /* ─ Neck ─ */
  .f-neck {
    position: absolute; top: 29px; left: 13px;
    width: 10px; height: 5px;
    background: #6b2e08; border-radius: 3px;
  }

  /* ─ Kurta (white Indian cotton shirt) ─ */
  .f-kurta {
    position: absolute; top: 33px; left: 6px;
    width: 24px; height: 20px;
    background: linear-gradient(170deg, #f8f4ec, #ece4d0);
    border-radius: 3px 3px 0 0;
    box-shadow: inset -2px 0 0 rgba(0,0,0,.06);
  }
  /* V-neck placket */
  .f-kurta::before {
    content: ''; position: absolute;
    top: 0; left: 9px;
    width: 0; height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 8px solid #d8d0be;
  }
  /* center seam */
  .f-kurta::after {
    content: ''; position: absolute;
    top: 8px; left: 11px;
    width: 2px; height: 12px;
    background: rgba(0,0,0,.05);
  }

  /* ─ Dhoti (white, wider than kurta, with drape) ─ */
  .f-dhoti {
    position: absolute; top: 52px; left: 3px;
    width: 30px; height: 20px;
    background: linear-gradient(175deg, #f4efe4, #e6dece);
    border-radius: 3px 3px 7px 7px;
  }
  /* fold lines */
  .f-dhoti::before {
    content: ''; position: absolute;
    top: 0; left: 7px; width: 2px; height: 20px;
    background: rgba(0,0,0,.055); border-radius: 1px;
  }
  .f-dhoti::after {
    content: ''; position: absolute;
    top: 0; left: 18px; width: 2px; height: 20px;
    background: rgba(0,0,0,.055); border-radius: 1px;
  }

  /* ─ Bare feet (dark, peek below dhoti) ─ */
  .f-leg-l, .f-leg-r {
    position: absolute; bottom: 0;
    width: 9px; height: 20px;
    background: linear-gradient(175deg, #7a3508, #522008);
    border-radius: 4px 4px 5px 5px;
    transform-origin: top center;
  }
  /* 2 walk-cycles (280ms each = 560ms), then hold */
  .f-leg-l {
    left: 9px;
    animation: fLegL 280ms ease-in-out 2 alternate;
  }
  .f-leg-r {
    left: 18px;
    animation: fLegR 280ms ease-in-out 2 alternate;
    animation-delay: 140ms;
  }
  @keyframes fLegL { from { transform: rotate(-23deg); } to { transform: rotate(23deg);  } }
  @keyframes fLegR { from { transform: rotate(23deg);  } to { transform: rotate(-23deg); } }

  /* ─ Arms ─ */
  .f-arm-l, .f-arm-r {
    position: absolute; top: 35px;
    width: 22px; height: 7px;
    background: #7a3508; border-radius: 8px;
  }
  /* left arm: behind body, swings back-forward while walking, raises on pluck */
  .f-arm-l {
    left: -5px;
    transform-origin: right center;
    animation:
      fArmWalkL  280ms ease-in-out 2 alternate,
      fArmRaiseL 350ms ease-in-out 560ms 1 forwards;
  }
  @keyframes fArmWalkL {
    from { transform: rotate(28deg); }
    to   { transform: rotate(-14deg); }
  }
  /* raise left arm up overhead to grab */
  @keyframes fArmRaiseL {
    0%   { transform: rotate(-14deg); }
    55%  { transform: rotate(-110deg); }
    100% { transform: rotate(-90deg);  }
  }

  /* right arm: forward swing while walking, raises on pluck */
  .f-arm-r {
    right: -5px;
    transform-origin: left center;
    animation:
      fArmWalkR  280ms ease-in-out 2 alternate,
      fArmRaiseR 350ms ease-in-out 560ms 1 forwards;
  }
  @keyframes fArmWalkR {
    from { transform: rotate(-14deg); }
    to   { transform: rotate(28deg);  }
  }
  /* raise right arm up overhead to grab — HANDS plucking the mango */
  @keyframes fArmRaiseR {
    0%   { transform: rotate(14deg);  }
    55%  { transform: rotate(-95deg); }
    100% { transform: rotate(-80deg); }
  }

  /* ─ Hands (small rounds at arm tips) ─ */
  .f-hand-l, .f-hand-r {
    position: absolute; top: -3px;
    width: 10px; height: 10px;
    background: #9c5220; border-radius: 50%;
  }
  .f-hand-l { right: -5px; }
  .f-hand-r { right: -5px; }

  /* ─ Dust puff left behind as farmer strides in ─ */
  .f-dust {
    position: fixed; width: 36px; height: 12px;
    background: radial-gradient(ellipse, rgba(180,130,58,.28) 0%, transparent 70%);
    animation: fDust 560ms ease-out forwards;
  }
  @keyframes fDust {
    from { transform: scaleX(0.3) translateX(-12px); opacity: .9; }
    to   { transform: scaleX(2.8) translateX(-22px); opacity: 0;  }
  }
`;

function bezier(p0, p1, p2, t) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export default function MangoThattaAnimation({ active, onDone }) {
  const rafRef      = useRef(null);
  const finishedRef = useRef(false);

  const [mango,        setMango]        = useState({ x: 0, y: 0, angle: -18, opacity: 0 });
  const [mangoFlying,  setMangoFlying]  = useState(false);
  const [showHanging,  setShowHanging]  = useState(false);
  const [showFarmer,   setShowFarmer]   = useState(false);
  const [layout,       setLayout]       = useState(null);

  useEffect(() => {
    if (!active) {
      finishedRef.current = false;
      setShowFarmer(false);
      setShowHanging(false);
      setMangoFlying(false);
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const basketEl = document.querySelector(".basket-float");
    if (!basketEl) { onDone?.(); return; }

    /* ── Locate the navbar logo (the "tree") ── */
    const logoEl =
      document.querySelector(".mango-source-logo") ||
      document.querySelector(".nav-brand img")     ||
      document.querySelector(".nav-brand");

    const lr = logoEl?.getBoundingClientRect() ?? { left: 20, top: 10, width: 44, height: 46 };

    /* Farmer stands just left of the logo when he "arrives" at the tree.
       He walks in from 110px further left (off-screen or just visible). */
    const farmerDestLeft = Math.max(8, lr.left - 30);
    const farmerTop      = Math.max(2, lr.top + lr.height / 2 - 52); // vertically centred in navbar

    /* Hanging mango: below the logo's bottom-center */
    const hangStemLeft  = lr.left + lr.width  / 2 - 2;
    const hangStemTop   = lr.top  + lr.height - 2;
    const hangMangoLeft = lr.left + lr.width  / 2 - 10;
    const hangMangoTop  = lr.top  + lr.height + 11;

    /* Dust spawns behind the farmer (to his left) */
    const dustLeft = farmerDestLeft - 28;
    const dustTop  = farmerTop + 60;

    setLayout({ farmerDestLeft, farmerTop, hangStemLeft, hangStemTop, hangMangoLeft, hangMangoTop, dustLeft, dustTop });
    finishedRef.current = false;
    setShowHanging(true);
    setShowFarmer(true);
    setMangoFlying(false);

    /* ── Mango launch: from the hanging mango position ── */
    const br = basketEl.getBoundingClientRect();

    const startX   = hangMangoLeft - 2;
    const startY   = hangMangoTop  - 2;
    const hoverX   = br.left + br.width  / 2 - 27;
    const hoverY   = br.top  - 80;
    const landingX = br.left + br.width  / 2 - 18;
    const landingY = br.top  + br.height / 2 - 18;

    /* Wide arc — mango travels left-to-right, looping up then falling in */
    const controlX = startX + (hoverX - startX) * 0.48 + 20;
    const controlY = Math.min(startY, hoverY) - 110;

    /* Farmer's hands "pluck" at ~800ms — mango detaches */
    const cutTimer = setTimeout(() => {
      setShowHanging(false);
      setMangoFlying(true);
      setMango({ x: startX, y: startY, angle: -20, opacity: 1 });

      let phase = "fly";
      let t = 0;
      let fallV = 0.6;

      const animate = () => {
        if (finishedRef.current) return;

        if (phase === "fly") {
          t += 0.014;
          if (t >= 1) { t = 1; phase = "fall"; }
          setMango({
            x:       bezier(startX, controlX, hoverX, t),
            y:       bezier(startY, controlY, hoverY, t),
            angle:   -18 + t * 68,
            opacity: 1,
          });
          rafRef.current = requestAnimationFrame(animate);
          return;
        }

        /* fall phase — gravity */
        fallV += 0.10;
        setMango((prev) => {
          const ny = prev.y + fallV;
          const na = prev.angle + 4.5;
          if (ny >= landingY) {
            finishedRef.current = true;
            basketEl.classList.remove("basket-target-pop");
            void basketEl.offsetWidth;
            basketEl.classList.add("basket-target-pop");
            setTimeout(() => {
              basketEl.classList.remove("basket-target-pop");
              onDone?.();
            }, 260);
            return { x: landingX, y: landingY, angle: na, opacity: 0 };
          }
          return { x: prev.x + 0.06, y: ny, angle: na, opacity: 1 };
        });
        if (!finishedRef.current) rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    }, 800);

    /* hide scene after CSS fade-out completes */
    const sceneTimer = setTimeout(() => {
      setShowFarmer(false);
      setShowHanging(false);
    }, 1320);

    return () => {
      clearTimeout(cutTimer);
      clearTimeout(sceneTimer);
      setShowFarmer(false);
      setShowHanging(false);
      setMangoFlying(false);
      cancelAnimationFrame(rafRef.current);
      finishedRef.current = false;
    };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="mango-cart-animation-layer">

        {/* ── Hanging mango at the logo-tree ── */}
        {showHanging && layout && (
          <>
            <div className="f-hang-stem"
              style={{ left: layout.hangStemLeft, top: layout.hangStemTop }} />
            <div className="f-hang-mango"
              style={{ left: layout.hangMangoLeft, top: layout.hangMangoTop }} />
          </>
        )}

        {/* ── Indian farmer walks L→R, reaches up to pluck ── */}
        {showFarmer && layout && (
          <>
            <div className="f-scene"
              style={{ left: layout.farmerDestLeft, top: layout.farmerTop, height: 72 }}>
              <div className="f-walk">
                <div className="f-bob">
                  <div className="f-man">
                    <div className="f-pagdi" />
                    <div className="f-face" />
                    <div className="f-nose" />
                    <div className="f-mustache" />
                    <div className="f-neck" />
                    <div className="f-kurta" />
                    <div className="f-dhoti" />
                    <div className="f-arm-l">
                      <div className="f-hand-l" />
                    </div>
                    <div className="f-arm-r">
                      <div className="f-hand-r" />
                    </div>
                    <div className="f-leg-l" />
                    <div className="f-leg-r" />
                  </div>
                </div>
              </div>
            </div>
            {/* dust trail left behind */}
            <div className="f-dust"
              style={{ left: layout.dustLeft, top: layout.dustTop }} />
          </>
        )}

        {/* ── Flying mango arcs left→right to basket ── */}
        {mangoFlying && (
          <div className="mc-fruit"
            style={{
              left:      mango.x,
              top:       mango.y,
              opacity:   mango.opacity,
              transform: `rotate(${mango.angle}deg)`,
            }}>
            <div className="mc-stem" />
            <div className="mc-leaf" />
            <div className="mc-body" />
          </div>
        )}

      </div>
    </>
  );
}
