"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-click-interaction";
const EVENT_NAME = "click-interaction:change";
const DEFAULT_ENABLED = true;

function readLocal(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) return raw === "true";
  } catch {}
  return DEFAULT_ENABLED;
}

export function setClickInteraction(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {}
  window.dispatchEvent(new CustomEvent<boolean>(EVENT_NAME, { detail: value }));
}

export function toggleClickInteraction() {
  setClickInteraction(!readLocal());
}

export function useClickInteraction(): boolean {
  const [enabled, setEnabled] = useState<boolean>(DEFAULT_ENABLED);

  useEffect(() => {
    setEnabled(readLocal());

    function onChange(e: Event) {
      setEnabled((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  return enabled;
}
