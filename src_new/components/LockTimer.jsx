/**
 * LockTimer
 * Shows a countdown until the 5-minute inventory lock expires.
 * Turns red in the last 60 seconds.
 *
 * Props:
 *   expiresAt  ISO string | null   — if null, renders nothing
 *   onExpired  () => void          — called once when the timer hits 0
 */
import React, { useEffect, useState } from "react";

export default function LockTimer({ expiresAt, onExpired }) {
  const [secsLeft, setSecsLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) { setSecsLeft(null); return; }

    function tick() {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
      setSecsLeft(diff);
      if (diff === 0) onExpired?.();
    }

    tick(); // immediate
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpired]);

  if (secsLeft === null) return null;

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const isUrgent = secsLeft <= 60;

  return (
    <div
      className="lock-timer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 0.9rem",
        borderRadius: "8px",
        background: isUrgent ? "rgba(220,38,38,0.08)" : "rgba(45,80,22,0.07)",
        border: `1px solid ${isUrgent ? "rgba(220,38,38,0.25)" : "rgba(45,80,22,0.18)"}`,
        fontSize: "0.82rem",
        color: isUrgent ? "#b91c1c" : "#2d5016",
        fontWeight: 600,
        transition: "background 0.4s, color 0.4s, border-color 0.4s",
      }}
    >
      <span style={{ fontSize: "1rem" }}>{isUrgent ? "⏰" : "🔒"}</span>
      <span>
        Cart reserved for{" "}
        <strong>
          {mins}:{String(secs).padStart(2, "0")}
        </strong>
        {isUrgent && " — complete payment soon!"}
      </span>
    </div>
  );
}
