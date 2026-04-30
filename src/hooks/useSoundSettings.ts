"use client";

import { useEffect, useState } from "react";

const STORAGE_MUTED = "portfolio-sound-muted";
const STORAGE_LEVEL = "portfolio-sound-level";
const EVENT_NAME = "sound:change";
const DEFAULT_LEVEL = 3;
const MIN_LEVEL = 1;
const MAX_LEVEL = 10;

export type SoundState = { muted: boolean; level: number };

function readLocal(): SoundState {
  let muted = false;
  let level = DEFAULT_LEVEL;
  try {
    muted = localStorage.getItem(STORAGE_MUTED) === "true";
    const raw = localStorage.getItem(STORAGE_LEVEL);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= MIN_LEVEL && parsed <= MAX_LEVEL) level = parsed;
    }
  } catch {}
  return { muted, level };
}

function writeLocal(state: SoundState) {
  try {
    localStorage.setItem(STORAGE_MUTED, String(state.muted));
    localStorage.setItem(STORAGE_LEVEL, String(state.level));
  } catch {}
}

function broadcast(state: SoundState) {
  window.dispatchEvent(new CustomEvent<SoundState>(EVENT_NAME, { detail: state }));
}

export function setMuted(muted: boolean) {
  const next = { ...readLocal(), muted };
  writeLocal(next);
  broadcast(next);
}

export function setLevel(level: number) {
  const clamped = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(level)));
  const next = { ...readLocal(), level: clamped };
  writeLocal(next);
  broadcast(next);
}

export function useSoundSettings(): SoundState {
  const [state, setState] = useState<SoundState>({ muted: false, level: DEFAULT_LEVEL });

  useEffect(() => {
    setState(readLocal());

    function onChange(e: Event) {
      setState((e as CustomEvent<SoundState>).detail);
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  return state;
}
