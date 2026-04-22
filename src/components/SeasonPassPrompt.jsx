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
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ✦ Better Value Option
        </p>

        {/* Title */}
        <h3
          style={{
            margin: 0,
            marginBottom: "10px",
            fontSize: "1.35rem",
            lineHeight: 1.3,
            color: "#2f2f2f",
          }}
        >
          Check Season Pass first?
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            marginBottom: "18px",
            color: "#555",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          You may get better weekly value with our Season Pass. Want to take a quick look before adding this?
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
              padding: "12px 16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(244,179,49,0.25)",
            }}
          >
            View Season Pass
          </button>

          <button
            onClick={ignoreSeasonPassSuggestion}
            style={{
              flex: 1,
              minWidth: "140px",
              background: "#fff",
              color: "#444",
              border: "1px solid #e6e6e6",
              borderRadius: "999px",
              padding: "12px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Skip & Add
          </button>
        </div>
      </div>
    </div>
  );
}