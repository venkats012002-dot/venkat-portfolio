"use client";

import { useEffect } from "react";
import { useDiscoMode, toggleDiscoMode } from "@/hooks/useDiscoMode";

export default function DiscoMode() {
  const enabled = useDiscoMode();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      toggleDiscoMode();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 999,
        mixBlendMode: "multiply",
        opacity: 0.35,
      }}
    >
      <div className="disco-blob disco-blob-1" />
      <div className="disco-blob disco-blob-2" />
      <div className="disco-blob disco-blob-3" />
      <div className="disco-blob disco-blob-4" />
    </div>
  );
}
