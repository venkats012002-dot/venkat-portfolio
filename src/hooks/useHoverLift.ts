"use client";

import { useState, type CSSProperties } from "react";

const STYLE_BASE: CSSProperties = {
  display: "inline-block",
  transformOrigin: "center bottom",
  transition: "transform 0.4s var(--ease-out)",
  willChange: "transform",
};

export function useHoverLift(scale = 1.1) {
  const [hovered, setHovered] = useState(false);

  return {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      ...STYLE_BASE,
      transform: hovered ? `scale(${scale})` : "scale(1)",
    } as CSSProperties,
  };
}
