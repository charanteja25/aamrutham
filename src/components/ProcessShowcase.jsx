import React, { useEffect, useRef, useState } from "react";

export default function ProcessShowcase({ steps = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const mobileListRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!steps.length || isMobile) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [steps.length, isMobile]);

  useEffect(() => {
    if (!steps.length || !isMobile || !mobileListRef.current) return;

    const container = mobileListRef.current;
    const cards = Array.from(container.querySelectorAll(".process-mobile-card"));
    if (!cards.length) return;

    let current = 0;

    const timer = setInterval(() => {
      current = (current + 1) % cards.length;
      const nextCard = cards[current];

      container.scrollTo({
        top: nextCard.offsetTop,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [steps.length, isMobile]);

  return (
    <div className="process-showcase">
      <div className="process-desktop-slider">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={`process-slide ${index === activeIndex ? "active" : ""}`}
          >
            <img src={step.image} alt={step.title} className="process-slide-image" />
            <div className="process-slide-overlay" />

            <div className="process-slide-content">
              <span className="process-slide-kicker">
                Step 0{index + 1} of {steps.length} · Farm to Your Doorstep
              </span>
              <div className="process-slide-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}

        <div className="process-slide-nav">
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className={`process-slide-nav-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="process-slide-nav-index">0{index + 1}</span>
              <span className="process-slide-nav-title">{step.title}</span>
            </button>
          ))}
        </div>

        <div className="process-slide-dots">
          {steps.map((step, index) => (
            <button
              key={`${step.title}-dot`}
              type="button"
              className={`process-slide-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${step.title}`}
            />
          ))}
        </div>
      </div>

      <div className="process-mobile-stack" ref={mobileListRef}>
        {steps.map((step, index) => (
          <article className="process-mobile-card" key={`${step.title}-mobile`}>
            <div className="process-mobile-image-wrap">
              <img src={step.image} alt={step.title} className="process-mobile-image" />
              <div className="process-mobile-number">0{index + 1}</div>
            </div>

            <div className="process-mobile-body">
              <div className="process-mobile-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}