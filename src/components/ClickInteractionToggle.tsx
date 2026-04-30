"use client";

import { useClickInteraction, toggleClickInteraction } from "@/hooks/useClickInteraction";

const THUMB_OFF_X = 2;
const THUMB_ON_X = 16;

export default function ClickInteractionToggle() {
  const enabled = useClickInteraction();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Click interaction"
      onClick={toggleClickInteraction}
      style={{
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        fontSynthesis: "none",
        height: 44,
        MozOsxFontSmoothing: "grayscale",
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        padding: 0,
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        width: 140,
      }}
    >
      <span
        style={{
          boxSizing: "border-box",
          color: "var(--color-neutral-dark)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          left: 8,
          lineHeight: "18px",
          position: "absolute",
          top: "50%",
          translate: "0 -50%",
          width: "fit-content",
        }}
      >
        Click int.
      </span>
      <span
        style={{
          backgroundColor: "var(--color-neutral-6)",
          boxSizing: "border-box",
          display: "block",
          height: 16,
          left: 94,
          overflow: "clip",
          position: "absolute",
          top: "50%",
          translate: "0 -50%",
          width: 30,
        }}
      >
        <span
          style={{
            backgroundColor: "var(--color-neutral-2)",
            boxSizing: "border-box",
            display: "block",
            height: 12,
            left: enabled ? THUMB_ON_X : THUMB_OFF_X,
            overflow: "clip",
            position: "absolute",
            top: 2,
            transition: "left 200ms var(--ease-out)",
            width: 12,
          }}
        />
      </span>
    </button>
  );
}
