"use client";

import { useEffect, useState } from "react";

export type AccentColor = "red" | "orange" | "yellow" | "green" | "blue" | "neutral";

export const ACCENT_COLORS: Record<AccentColor, { main: string; light: string }> = {
  red:     { main: "#F01D25", light: "#FCD2D4" },
  orange:  { main: "#F7941C", light: "#FDEAD2" },
  yellow:  { main: "#F7ED0F", light: "#FDFBD0" },
  green:   { main: "#6BBD40", light: "#E1F2D9" },
  blue:    { main: "#3653A3", light: "#D7DDED" },
  neutral: { main: "#101010", light: "#CACACA" },
};

export const ACCENT_ORDER: AccentColor[] = ["red", "orange", "yellow", "green", "blue", "neutral"];

const STORAGE_KEY = "portfolio-accent-color";
const EVENT_NAME = "accent-color:change";
const DEFAULT_ACCENT: AccentColor = "red";

function isAccentColor(v: string): v is AccentColor {
  return (ACCENT_ORDER as string[]).includes(v);
}

function readLocal(): AccentColor {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isAccentColor(raw)) return raw;
  } catch {}
  return DEFAULT_ACCENT;
}

export function setAccentColor(color: AccentColor) {
  try {
    localStorage.setItem(STORAGE_KEY, color);
  } catch {}
  window.dispatchEvent(new CustomEvent<AccentColor>(EVENT_NAME, { detail: color }));
}

export function useAccentColor(): AccentColor {
  const [accent, setAccent] = useState<AccentColor>(DEFAULT_ACCENT);

  useEffect(() => {
    setAccent(readLocal());

    function onChange(e: Event) {
      setAccent((e as CustomEvent<AccentColor>).detail);
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  return accent;
}
