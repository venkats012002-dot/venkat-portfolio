"use client";

import { useEffect } from "react";
import { useAccentColor, ACCENT_COLORS } from "@/hooks/useAccentColor";

export default function AccentBridge() {
  const accent = useAccentColor();

  useEffect(() => {
    const { main, light } = ACCENT_COLORS[accent];
    document.documentElement.style.setProperty("--color-accent-main", main);
    document.documentElement.style.setProperty("--color-accent-light", light);
  }, [accent]);

  return null;
}
