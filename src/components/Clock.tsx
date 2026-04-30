"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CLOCK_SIZE = 72;
const CLOCK_CENTER = CLOCK_SIZE / 2;
const HAND_RADIUS = 30;
const BOX_SIZE = 4;

function handPos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad) * HAND_RADIUS;
  const dy = -Math.cos(rad) * HAND_RADIUS;
  return {
    left: CLOCK_CENTER + dx - BOX_SIZE / 2,
    top: CLOCK_CENTER + dy - BOX_SIZE / 2,
  };
}

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function formatTime(d: Date) {
  const h24 = d.getHours();
  const m = d.getMinutes();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")}`;
}

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now?.getHours() ?? 0;
  const minutes = now?.getMinutes() ?? 0;
  const seconds = now?.getSeconds() ?? 0;

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const hourP = handPos(hourAngle);
  const minuteP = handPos(minuteAngle);
  const secondP = handPos(secondAngle);

  const dateText = now ? formatDate(now) : "";
  const timeText = now ? formatTime(now) : "";

  return (
    <div
      style={{
        boxSizing: "border-box",
        fontSynthesis: "none",
        height: 120,
        MozOsxFontSmoothing: "grayscale",
        overflow: "clip",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        width: 120,
      }}
    >
      <div
        suppressHydrationWarning
        style={{
          boxSizing: "border-box",
          color: "var(--color-neutral-dark)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          left: "50%",
          lineHeight: "18px",
          position: "absolute",
          top: 8,
          translate: "-50%",
          whiteSpace: "nowrap",
        }}
      >
        {dateText}
      </div>
      <div
        style={{
          borderRadius: "calc(infinity * 1px)",
          boxSizing: "border-box",
          height: CLOCK_SIZE,
          left: "50%",
          outline: "1px solid #000000",
          overflow: "clip",
          position: "absolute",
          top: 38,
          translate: "-50%",
          width: CLOCK_SIZE,
        }}
      >
        <div
          suppressHydrationWarning
          style={{
            boxSizing: "border-box",
            color: "var(--color-neutral-dark)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            left: "50%",
            lineHeight: "16px",
            position: "absolute",
            top: 27,
            translate: "-50%",
            whiteSpace: "nowrap",
          }}
        >
          {timeText}
        </div>
        {now && (
          <>
            <div
              aria-hidden
              style={{
                backgroundColor: "var(--color-neutral-3)",
                boxSizing: "border-box",
                height: BOX_SIZE,
                left: secondP.left,
                position: "absolute",
                top: secondP.top,
                width: BOX_SIZE,
              }}
            />
            <div
              aria-hidden
              style={{
                backgroundColor: "var(--color-neutral-7)",
                boxSizing: "border-box",
                height: BOX_SIZE,
                left: minuteP.left,
                position: "absolute",
                top: minuteP.top,
                width: BOX_SIZE,
              }}
            />
            <div
              aria-hidden
              style={{
                backgroundColor: "var(--color-brand-red)",
                boxSizing: "border-box",
                height: BOX_SIZE,
                left: hourP.left,
                position: "absolute",
                top: hourP.top,
                width: BOX_SIZE,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
