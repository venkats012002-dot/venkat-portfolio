"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ACCENT_COLORS, ACCENT_ORDER } from "@/hooks/useAccentColor";

const BOX_PALETTE = ACCENT_ORDER.map((c) => ACCENT_COLORS[c].main);
const STAGGER_MS = 60;

type Props = {
  text: string;
  inactiveColor?: string;
  activeColor?: string;
  style?: CSSProperties;
};

/**
 * Per-letter sequential color-box wave behind text on hover. Lifted from the
 * original NavLink so the same interaction can be reused anywhere a single
 * line of text wants the navbar's hover treatment (footer links, "Copy Mail
 * Id" button, etc.). One letter is "active" at a time, 60ms stagger, accent
 * palette cycling per index, white letter on top, box scales 0.75 -> 1 with
 * opacity fade. The wave runs through and resets on its own; mouseleave
 * cancels mid-run.
 */
export default function LetterWaveText({
  text,
  inactiveColor = "currentColor",
  activeColor = "#FFFFFF",
  style,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const onEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let current = 0;
    setActiveIdx(0);
    intervalRef.current = setInterval(() => {
      current++;
      if (current < text.length) {
        setActiveIdx(current);
      } else {
        setActiveIdx(-1);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, STAGGER_MS);
  };

  const onLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIdx(-1);
  };

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={style}
    >
      {text.split("").map((ch, i) => {
        const isActive = activeIdx === i;
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: "inline-block", position: "relative" }}
          >
            <span
              style={{
                backgroundColor: BOX_PALETTE[i % BOX_PALETTE.length],
                inset: 0,
                opacity: isActive ? 1 : 0,
                position: "absolute",
                transform: isActive ? "scale(1)" : "scale(0.75)",
                transition: "opacity 100ms ease, transform 100ms ease",
                zIndex: 0,
              }}
            />
            <span
              style={{
                color: isActive ? activeColor : inactiveColor,
                position: "relative",
                transition: "color 75ms ease",
                zIndex: 1,
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        );
      })}
    </span>
  );
}
