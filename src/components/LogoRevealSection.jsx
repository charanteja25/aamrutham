import React, { useEffect, useRef, useState } from 'react';

export default function LogoRevealSection() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / scrollableHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0 → 0.4): logo flips in from side
  // Phase 2 (0.4 → 0.7): logo faces forward, rings & tagline appear
  // Phase 3 (0.7 → 1.0): logo scales up and fades out

  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const p1 = Math.min(1, progress / 0.4);           // 0→1 during phase 1
  const p2 = Math.max(0, Math.min(1, (progress - 0.4) / 0.3));  // 0→1 during phase 2
  const p3 = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));  // 0→1 during phase 3

  const rotateY = -75 + ease(p1) * 75;
  const scale = (0.5 + ease(p1) * 0.5) * (1 + ease(p3) * 0.6);
  const logoOpacity = p1 < 0.05 ? p1 / 0.05 : 1 - ease(p3);
  const blur = (1 - Math.min(1, p1 * 3)) * 6;
  const glow = ease(p1) * 35 * (1 - ease(p3));

  const ringOpacity = ease(p2) * (1 - ease(p3));
  const ringScale = 0.5 + ease(p2) * 0.5;

  const taglineOpacity = ease(p2) * (1 - ease(p3));
  const taglineY = (1 - ease(p2)) * 24;

  return (
    <section className="logo-reveal-section" ref={sectionRef}>
      <div className="logo-reveal-sticky">
        <div className="logo-reveal-ambient" />

        <div className="logo-reveal-wrap">
          <div
            className="logo-reveal-ring logo-reveal-ring--outer"
            style={{ opacity: ringOpacity, transform: `scale(${ringScale * 0.9})` }}
          />
          <div
            className="logo-reveal-ring logo-reveal-ring--inner"
            style={{ opacity: ringOpacity, transform: `scale(${ringScale})` }}
          />
          <img
            src="/assets/aam-final.png"
            alt="Aamrutham"
            className="logo-reveal-img"
            style={{
              opacity: logoOpacity,
              transform: `perspective(900px) rotateY(${rotateY}deg) scale(${scale})`,
              filter: `blur(${blur}px) drop-shadow(0 0 ${glow}px rgba(245,166,35,0.55))`,
            }}
          />
        </div>

        <p
          className="logo-reveal-label"
          style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}
        >
          ✦ &nbsp; Aamrutham &nbsp; ✦
        </p>

        <div className="logo-reveal-scroll-hint" style={{ opacity: progress < 0.05 ? 1 : 0 }}>
          <span>scroll</span>
          <div className="logo-reveal-scroll-arrow" />
        </div>
      </div>
    </section>
  );
}
