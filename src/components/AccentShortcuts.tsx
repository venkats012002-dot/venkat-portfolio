"use client";

import { useEffect } from "react";
import { setAccentColor, type AccentColor } from "@/hooks/useAccentColor";

const KEY_MAP: Record<string, AccentColor> = {
  r: "red",
  o: "orange",
  y: "yellow",
  g: "green",
  b: "blue",
  n: "neutral",
};

export default function AccentShortcuts() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (!(key in KEY_MAP)) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      setAccentColor(KEY_MAP[key]);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
