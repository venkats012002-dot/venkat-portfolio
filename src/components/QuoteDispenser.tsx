"use client";

import { useEffect, useRef, useState } from "react";
import { useSoundSettings } from "@/hooks/useSoundSettings";

const QUOTE = "The unexamined life is not worth living.";
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const SFX_SRC = "/audio/ticket-dispense.mp3";

type Props = { width?: number; height?: number };

export default function QuoteDispenser({ width = 467, height = 129 }: Props = {}) {
  const [isOut, setIsOut] = useState(false);
  const sound = useSoundSettings();
  const soundRef = useRef(sound);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    const a = new Audio(SFX_SRC);
    a.preload = "auto";
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const handleGenerate = () => {
    const { muted, level } = soundRef.current;
    if (!muted && audioRef.current) {
      const a = audioRef.current;
      a.currentTime = 0;
      a.volume = Math.max(0, Math.min(1, level / 10));
      void a.play().catch(() => {});
    }
    setIsOut(true);
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        fontSynthesis: "none",
        height,
        MozOsxFontSmoothing: "grayscale",
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        width,
      }}
    >
      <svg
        width="435"
        height="97"
        viewBox="0 0 435 97"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          left: "50%",
          top: 16,
          position: "absolute",
          translate: "-50%",
        }}
      >
        <defs>
          <linearGradient
            id="dispenser-slot-gradient"
            x1="217.5"
            y1="29"
            x2="217.5"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#666666" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
        </defs>

        <rect
          x="0.5"
          y="0.5"
          width="434"
          height="29"
          rx="14.5"
          fill="var(--color-neutral-2)"
          stroke="#101010"
        />
        <rect
          x="8"
          y="8"
          width="419"
          height="14"
          rx="7"
          fill="url(#dispenser-slot-gradient)"
        />

        <path
          style={{
            clipPath: isOut ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: `clip-path 1.2s ${EASE_OUT}`,
          }}
          d="M19.635 13.499H414.406C414.405 13.507 414.404 13.514 414.402 13.522C414.337 13.901 414.246 14.432 414.143 15.036C413.939 16.243 413.688 17.746 413.506 18.923C412.959 22.464 412.689 29.125 412.588 37.087C412.486 45.063 412.554 54.38 412.689 63.257C412.825 72.135 413.027 80.575 413.196 86.794C413.281 89.904 413.357 92.46 413.412 94.238C413.44 95.127 413.461 95.822 413.477 96.294C413.479 96.369 413.481 96.437 413.483 96.501H20.518C20.521 96.436 20.524 96.366 20.526 96.29C20.543 95.815 20.567 95.115 20.598 94.219C20.658 92.429 20.743 89.856 20.837 86.726C21.024 80.467 21.249 71.98 21.398 63.071C21.548 54.162 21.623 44.828 21.511 36.876C21.398 28.938 21.099 22.334 20.492 18.913C20.052 16.43 19.774 14.666 19.615 13.44L19.635 13.499Z"
          fill="var(--color-neutral-1)"
          stroke="#101010"
        />
      </svg>

      <div
        aria-hidden={!isOut}
        style={{
          boxSizing: "border-box",
          color: "var(--color-neutral-dark)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          left: "50%",
          lineHeight: "26px",
          opacity: isOut ? 1 : 0,
          pointerEvents: "none",
          position: "absolute",
          textAlign: "center",
          top: "calc(50% + 6.5px)",
          transition: isOut
            ? "opacity 0.5s ease 1.2s"
            : "opacity 0.2s ease",
          translate: "-50% -50%",
          width: 314,
        }}
      >
        &ldquo; {QUOTE} &rdquo;
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isOut}
        style={{
          alignItems: "center",
          backgroundColor: "var(--color-neutral-2)",
          borderColor: "var(--color-neutral-dark)",
          borderRadius: 0,
          borderStyle: "solid",
          borderWidth: 1,
          boxSizing: "border-box",
          color: "var(--color-neutral-dark)",
          cursor: isOut ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          gap: 6,
          left: "50%",
          lineHeight: "26px",
          opacity: isOut ? 0 : 1,
          overflow: "clip",
          paddingBlock: 8,
          paddingInline: 16,
          pointerEvents: isOut ? "none" : "auto",
          position: "absolute",
          top: 62,
          transition: "opacity 0.3s ease",
          translate: "-50%",
        }}
      >
        Generate
      </button>
    </div>
  );
}
