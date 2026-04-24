import React from "react";
import { useCart } from "../context/CartContext";

export default function SeasonPassPrompt() {
  const {
    showSeasonPassPrompt,
    closeSeasonPassPrompt,
    ignoreSeasonPassSuggestion,
    viewSeasonPassDetails,
  } = useCart();

  if (!showSeasonPassPrompt) return null;

  return (
    <div
      onClick={closeSeasonPassPrompt}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fffdf7",
          border: "1px solid #f3e2b3",
          borderRadius: "20px",
          padding: "22px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            margin: 0,
            marginBottom: "8px",
            color: "#c69214",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ⚡ Loving the Varieties?
        </p>

        {/* Title */}
        <h3
          style={{
            margin: 0,
            marginBottom: "10px",
            fontSize: "1.5rem",
            lineHeight: 1.25,
            color: "#2f2f2f",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Try our <em style={{ color: "#c69214" }}>Season Pass</em>
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            marginBottom: "18px",
            color: "#555",
            lineHeight: 1.65,
            fontSize: "1rem",
          }}
        >
          Since you're picking more than one, our Season Pass might be a better deal —
          rare heritage mangoes delivered fresh every week for 4 weeks, one payment, free delivery.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={viewSeasonPassDetails}
            style={{
              flex: 1,
              minWidth: "160px",
              background: "#f4b331",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "999px",
              padding: "13px 18px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(244,179,49,0.3)",
            }}
          >
            View Season Pass →
          </button>

          <button
            onClick={ignoreSeasonPassSuggestion}
            style={{
              flex: 1,
              minWidth: "140px",
              background: "#fff",
              color: "#555",
              border: "1px solid #e6e6e6",
              borderRadius: "999px",
              padding: "13px 18px",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            No thanks, add
          </button>
        </div>
      </div>
    </div>
  );
}