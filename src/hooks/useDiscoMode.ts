"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-disco-mode";
const EVENT_NAME = "disco:change";

export function setDiscoMode(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: value }));
}

export function toggleDiscoMode() {
  let current = false;
  try {
    current = localStorage.getItem(STORAGE_KEY) === "true";
  } catch {}
  setDiscoMode(!current);
}

export function useDiscoMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") setEnabled(true);
    } catch {}

    function onChange(e: Event) {
      setEnabled((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  return enabled;
}
