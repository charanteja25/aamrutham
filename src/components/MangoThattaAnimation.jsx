import React, { useEffect, useMemo, useRef, useState } from "react";

const styles = `
  .mango-cart-animation-layer {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    overflow: hidden;
    background: transparent;
  }

  .mango-cart-fruit {
    position: fixed;
    width: 48px;
    height: 62px;
    transform-origin: center center;
    will-change: transform, left, top, opacity;
    z-index: 10001;
  }

  .mango-cart-body {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 34% 28%, #ffe47c 0%, #ffc83a 34%, #f59b12 68%, #d96b00 100%);
    border-radius: 60% 50% 66% 44% / 58% 46% 74% 42%;
    transform: rotate(18deg);
    box-shadow:
      inset -4px -8px 0 rgba(0, 0, 0, 0.08),
      0 6px 10px rgba(0, 0, 0, 0.08);
  }

  .mango-cart-stem {
    position: absolute;
    top: -1px;
    left: 18px;
    width: 4px;
    height: 11px;
    background: #704827;
    border-radius: 4px;
    transform: rotate(18deg);
    z-index: 2;
  }

  .mango-cart-leaf {
    position: absolute;
    top: -8px;
    left: 23px;
    width: 18px;
    height: 10px;
    background: linear-gradient(to right, #4cb74f, #2d7c33);
    border-radius: 100% 0 100% 0;
    transform: rotate(-28deg);
    z-index: 1;
  }

  .basket-target-pop {
    animation: basketTargetPop 420ms ease;
  }

  @keyframes basketTargetPop {
    0% { transform: scale(1); }
    35% { transform: scale(1.18); }
    70% { transform: scale(0.94); }
    100% { transform: scale(1); }
  }

  .farmer-cut-wrap {
    position: fixed;
    width: 120px;
    height: 90px;
    z-index: 10000;
    transform-origin: center;
    will-change: opacity, transform;
  }

  .farmer-cut-scene {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: farmerFadeIn 140ms ease forwards, farmerFadeOut 300ms ease 500ms forwards;
  }

  @keyframes farmerFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes farmerFadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.8); }
  }

  .farmer-arm {
    position: absolute;
    left: 26px;
    top: 28px;
    width: 54px;
    height: 10px;
    background: #8b5a2b;
    border-radius: 10px;
    transform-origin: 10px 50%;
    animation: farmerCutArm 520ms ease-in-out 1;
    box-shadow: 0 1px 0 rgba(0,0,0,0.12);
  }

  .farmer-hand {
    position: absolute;
    right: -4px;
    top: -2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #b87944;
  }

  .farmer-knife-handle {
    position: absolute;
    right: 6px;
    top: 1px;
    width: 10px;
    height: 6px;
    border-radius: 4px;
    background: #5d3b1f;
  }

  .farmer-knife-blade {
    position: absolute;
    right: -16px;
    top: -2px;
    width: 22px;
    height: 10px;
    background: linear-gradient(to right, #d9d9d9, #f2f2f2);
    border-radius: 2px 12px 12px 2px;
    clip-path: polygon(0 28%, 74% 0, 100% 50%, 74% 100%, 0 72%);
  }

  .farmer-branch {
    position: absolute;
    left: 68px;
    top: 18px;
    width: 48px;
    height: 5px;
    background: #6b4322;
    border-radius: 10px;
    transform: rotate(-18deg);
    opacity: 0.95;
  }

  .farmer-leaf-a,
  .farmer-leaf-b,
  .farmer-leaf-c {
    position: absolute;
    background: linear-gradient(to right, #4cb74f, #2d7c33);
    border-radius: 100% 0 100% 0;
  }

  .farmer-leaf-a {
    left: 90px;
    top: 5px;
    width: 16px;
    height: 9px;
    transform: rotate(-20deg);
  }

  .farmer-leaf-b {
    left: 100px;
    top: 13px;
    width: 13px;
    height: 7px;
    transform: rotate(18deg);
  }

  .farmer-leaf-c {
    left: 78px;
    top: 9px;
    width: 14px;
    height: 8px;
    transform: rotate(-60deg);
  }

  @keyframes farmerCutArm {
    0%   { transform: rotate(-10deg); }
    35%  { transform: rotate(16deg); }
    55%  { transform: rotate(28deg); }
    100% { transform: rotate(0deg); }
  }
`;

function bezier(p0, p1, p2, t) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export default function MangoThattaAnimation({
  active,
  onDone,
  sourcePosition = null,
}) {
  const rafRef = useRef(null);
  const finishedRef = useRef(false);

  const [mango, setMango] = useState({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 24 : 0,
    y: -70,
    angle: -18,
    opacity: 0,
  });

  const [showFarmer, setShowFarmer] = useState(false);

  const startPoint = useMemo(() => {
    if (sourcePosition) {
      return {
        x: sourcePosition.x,
        y: sourcePosition.y,
      };
    }

    return {
      x: typeof window !== "undefined" ? window.innerWidth * 0.5 - 24 : 0,
      y: -70,
    };
  }, [sourcePosition]);

  useEffect(() => {
    if (!active) {
      finishedRef.current = false;
      setShowFarmer(false);
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const basketEl = document.querySelector(".basket-float");
    if (!basketEl) {
      onDone?.();
      return;
    }

    const rect = basketEl.getBoundingClientRect();

    const startX = startPoint.x;
    const startY = startPoint.y;

    const hoverX = rect.left + rect.width / 2 - 24;
    const hoverY = rect.top - 110;

    const landingX = rect.left + rect.width / 2 - 18;
    const landingY = rect.top + rect.height / 2 - 18;

    const controlX = Math.max(startX, window.innerWidth * 0.68);
    const controlY = Math.max(40, window.innerHeight * 0.14);

    let phase = "fly";
    let t = 0;
    let fallVelocity = 0.25; // Slower fall for better visibility

    setShowFarmer(true);
    // Show farmer for longer to make the cutting action visible
    const farmerTimer = setTimeout(() => {
      setShowFarmer(false);
    }, 800);

    const animate = () => {
      if (finishedRef.current) return;

      if (phase === "fly") {
        t += 0.011;

        if (t >= 1) {
          t = 1;
          phase = "fall";
          fallVelocity = 0.9;
        }

        const x = bezier(startX, controlX, hoverX, t);
        const y = bezier(startY, controlY, hoverY, t);
        const angle = -16 + t * 58;

        setMango({
          x,
          y,
          angle,
          opacity: 1,
        });

        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (phase === "fall") {
        fallVelocity += 0.08; // Slower acceleration for a more visible fall

        setMango((prev) => {
          const nextY = prev.y + fallVelocity;
          const nextX = prev.x + 0.05;
          const nextAngle = prev.angle + 3.8;

          if (nextY >= landingY) {
            finishedRef.current = true;

            basketEl.classList.remove("basket-target-pop");
            void basketEl.offsetWidth;
            basketEl.classList.add("basket-target-pop");

            setTimeout(() => {
              basketEl.classList.remove("basket-target-pop");
              onDone?.();
            }, 260);

            return {
              x: landingX,
              y: landingY,
              angle: nextAngle,
              opacity: 0,
            };
          }

          return {
            x: nextX,
            y: nextY,
            angle: nextAngle,
            opacity: 1,
          };
        });

        if (!finishedRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    setMango({
      x: startX,
      y: startY,
      angle: -18,
      opacity: 1,
    });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(farmerTimer);
      setShowFarmer(false);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, onDone, startPoint]);

  if (!active) return null;

  return (
    <>
      <style>{styles}</style>

      <div className="mango-cart-animation-layer">
        {showFarmer && (
          <div
            className="farmer-cut-wrap"
            style={{
              left: startPoint.x - 38,
              top: startPoint.y - 8,
            }}
          >
            <div className="farmer-cut-scene">
              <div className="farmer-branch" />
              <div className="farmer-leaf-a" />
              <div className="farmer-leaf-b" />
              <div className="farmer-leaf-c" />
              <div className="farmer-arm">
                <div className="farmer-hand" />
                <div className="farmer-knife-handle" />
                <div className="farmer-knife-blade" />
              </div>
            </div>
          </div>
        )}

        <div
          className="mango-cart-fruit"
          style={{
            left: mango.x,
            top: mango.y,
            opacity: mango.opacity,
            transform: `rotate(${mango.angle}deg)`,
          }}
        >
          <div className="mango-cart-stem" />
          <div className="mango-cart-leaf" />
          <div className="mango-cart-body" />
        </div>
      </div>
    </>
  );
}