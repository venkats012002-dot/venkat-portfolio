"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useSoundSettings } from "@/hooks/useSoundSettings";

const STEP_PX = 64;
const MAX_LEVER_DEG = 45;

const PLACEHOLDER_BODY =
  "Lorem ipsum dolor sit amet consectetur. Venenatis non nisl non amet sed ipsum.";

const CATEGORIES: { title: string; body: string }[] = [
  { title: "Design Philosophies", body: PLACEHOLDER_BODY },
  { title: "Interesting things about me", body: PLACEHOLDER_BODY },
  { title: "Technical Skills", body: PLACEHOLDER_BODY },
  { title: "Recommendations", body: PLACEHOLDER_BODY },
  { title: "Personal Archive", body: PLACEHOLDER_BODY },
];

const N = CATEGORIES.length;

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function wrap(d: number, total: number) {
  let v = d;
  while (v > total / 2) v -= total;
  while (v < -total / 2) v += total;
  return v;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpHex(c1: string, c2: string, t: number) {
  const parse = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(c1);
  const [r2, g2, b2] = parse(c2);
  return `rgb(${Math.round(lerp(r1, r2, t))}, ${Math.round(lerp(g1, g2, t))}, ${Math.round(lerp(b1, b2, t))})`;
}

function labelColor(absFrac: number): string {
  if (absFrac >= 2) return "#CACACA";
  if (absFrac >= 1) return lerpHex("#7A7A7A", "#CACACA", absFrac - 1);
  return lerpHex("#101010", "#7A7A7A", absFrac);
}

function labelFontSize(absFrac: number): number {
  return lerp(16, 14, Math.min(1, absFrac));
}

export default function CircularSelector() {
  const [activeIdx, setActiveIdx] = useState(2);
  const [dragShift, setDragShift] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef<number | null>(null);
  const prevLiveCenterRef = useRef<number>(activeIdx);

  const sound = useSoundSettings();
  const soundRef = useRef(sound);
  const haptic = useWebHaptics();
  const hapticRef = useRef(haptic);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  useEffect(() => {
    hapticRef.current = haptic;
  }, [haptic]);
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playTick = () => {
    const { muted, level } = soundRef.current;
    if (muted) return;
    hapticRef.current?.trigger?.("weak");
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const peak = Math.max(0.0001, (level / 10) * 0.08);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 1800;
    gain.gain.setValueAtTime(peak, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  const onPointerDown = (e: React.PointerEvent<Element>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragStartYRef.current = e.clientY;
    prevLiveCenterRef.current = activeIdx;
    setIsDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<Element>) => {
    if (dragStartYRef.current === null) return;
    const dy = e.clientY - dragStartYRef.current;
    const newShift = dy / STEP_PX;
    setDragShift(newShift);

    const liveCenter = mod(activeIdx - Math.round(newShift), N);
    if (liveCenter !== prevLiveCenterRef.current) {
      prevLiveCenterRef.current = liveCenter;
      playTick();
    }
  };
  const onPointerUp = (e: React.PointerEvent<Element>) => {
    if (dragStartYRef.current === null) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const next = mod(activeIdx - Math.round(dragShift), N);
    setActiveIdx(next);
    setDragShift(0);
    dragStartYRef.current = null;
    setIsDragging(false);
    prevLiveCenterRef.current = next;
  };

  const dragHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };

  const grabCursor = isDragging ? "grabbing" : "grab";
  const SNAP_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const transition = isDragging
    ? "none"
    : `translate 0.35s ${SNAP_EASE}, rotate 0.35s ${SNAP_EASE}, color 0.25s ease, font-size 0.25s ease, opacity 0.25s ease`;

  // Asymptotic curve: lever glides toward ±45° smoothly, never bumps a hard cap.
  // At dragShift=1 (one step), leverDeg ≈ 22.5°; at 2, ≈ 31.7°; at 4, ≈ 38°.
  const leverDeg =
    MAX_LEVER_DEG * (2 / Math.PI) * Math.atan(dragShift);

  const activeCat = CATEGORIES[activeIdx];

  return (
    <div
      style={{
        alignSelf: "stretch",
        boxSizing: "border-box",
        flexShrink: 0,
        height: 565,
        marginInline: "auto",
        maxWidth: 720,
        overflow: "visible",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        width: "100%",
      }}
    >
      {/* Lever knob — primary drag handle */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Spin selector"
        role="slider"
        style={{
          cursor: grabCursor,
          left: -328,
          position: "absolute",
          rotate: `${leverDeg}deg`,
          top: 259,
          touchAction: "none",
          transformOrigin: "center center",
          transition: isDragging
            ? "none"
            : `rotate 0.35s ${SNAP_EASE}`,
        }}
        {...dragHandlers}
      >
        <circle cx="24" cy="24" r="24" fill="#101010" />
        <line x1="8" y1="24" x2="40" y2="24" stroke="#FFFFFF" strokeWidth="4" />
      </svg>

      {/* Static tick marks */}
      <svg
        width="46"
        height="238"
        viewBox="0 0 46 238"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{
          left: -256,
          pointerEvents: "none",
          position: "absolute",
          top: 164,
        }}
      >
        <line x1="21.742" y1="118.473" x2="45.742" y2="118.473" stroke="#000000" />
        <line x1="15.829" y1="174.48" x2="39.464" y2="178.648" stroke="#000000" />
        <line x1="0.913" y1="228.503" x2="23.466" y2="236.712" stroke="#000000" />
        <line x1="5.809" y1="209.744" x2="17.253" y2="213.353" stroke="#CACACA" />
        <line x1="10.872" y1="192.49" x2="22.463" y2="195.596" stroke="#CACACA" />
        <line x1="16.655" y1="62.648" x2="40.291" y2="58.48" stroke="#000000" />
        <line x1="0.171" y1="8.678" x2="22.723" y2="0.47" stroke="#000000" />
        <line x1="18.788" y1="155.475" x2="29.788" y2="156.475" stroke="#CACACA" />
        <line x1="20.727" y1="99.809" x2="31.767" y2="99.473" stroke="#CACACA" />
        <line x1="18.717" y1="81.194" x2="29.707" y2="80.093" stroke="#CACACA" />
        <line x1="11.627" y1="45.027" x2="22.376" y2="42.486" stroke="#CACACA" />
        <line x1="6.547" y1="26.829" x2="16.714" y2="22.513" stroke="#CACACA" />
        <line x1="20.772" y1="137.262" x2="31.805" y2="137.798" stroke="#CACACA" />
      </svg>

      {/* Category labels — draggable, fractional positioning during drag */}
      {CATEGORIES.map((cat, i) => {
        const raw = i - activeIdx + dragShift;
        const fractional = wrap(raw, N);
        const absFrac = Math.abs(fractional);
        if (absFrac > 2.5) return null;

        const x = -194 - 7 * fractional * fractional;
        const y = 270 + 63 * fractional;
        const rotation = 10 * fractional;

        const color = labelColor(absFrac);
        const fontSize = labelFontSize(absFrac);
        const opacity = absFrac > 2 ? Math.max(0, 1 - (absFrac - 2) * 2) : 1;

        const labelStyle: CSSProperties = {
          boxSizing: "border-box",
          color,
          cursor: grabCursor,
          fontFamily: "var(--font-body)",
          fontSize,
          left: 0,
          lineHeight: "21px",
          opacity,
          position: "absolute",
          rotate: `${rotation}deg`,
          top: 0,
          touchAction: "none",
          transformOrigin: "0% 0%",
          transition,
          translate: `${x}px ${y}px`,
          whiteSpace: "nowrap",
        };

        return (
          <div key={i} style={labelStyle} {...dragHandlers}>
            {cat.title}
          </div>
        );
      })}

      {/* Content panel — updates on release */}
      <div
        style={{
          borderColor: "#DDDDDD",
          borderStyle: "solid",
          borderWidth: 1,
          boxSizing: "border-box",
          height: 399,
          overflow: "clip",
          position: "absolute",
          right: 0,
          top: 82,
          width: 660,
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            color: "#101010",
            fontFamily: "var(--font-body)",
            fontSize: 18,
            left: 31,
            lineHeight: "32px",
            position: "absolute",
            top: 15,
          }}
        >
          {activeCat.title}
        </div>
        <div
          style={{
            boxSizing: "border-box",
            color: "#7A7A7A",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            left: 31,
            lineHeight: "21px",
            position: "absolute",
            top: 72,
          }}
        >
          {activeCat.body}
        </div>
      </div>
    </div>
  );
}
