"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWebHaptics } from "web-haptics/react";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import { useClickInteraction } from "@/hooks/useClickInteraction";

const COLORS = [
  "#F01C26",
  "#F7941C",
  "#F7ED12",
  "#6BBD40",
  "#CACACA",
  "#101010",
];

const PARTICLE_COUNT = 6;
const BURST_RADIUS = 16;
const GROWN_SIZE = 6;
const DURATION = 0.5;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Particle = { id: string; color: string; dx: number; dy: number };
type Burst = { id: number; x: number; y: number; particles: Particle[] };

function playTick(ctx: AudioContext, level: number) {
  const now = ctx.currentTime;
  const duration = 0.03;
  const peak = Math.max(0.001, (level / 10) * 0.5);

  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);
}

function hapticIntensity(level: number): "weak" | "medium" | "strong" {
  if (level <= 3) return "weak";
  if (level <= 7) return "medium";
  return "strong";
}

export default function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const haptic = useWebHaptics();
  const hapticRef = useRef(haptic);
  const sound = useSoundSettings();
  const soundRef = useRef(sound);
  const clickEnabled = useClickInteraction();
  const clickEnabledRef = useRef(clickEnabled);

  useEffect(() => {
    hapticRef.current = haptic;
  }, [haptic]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    clickEnabledRef.current = clickEnabled;
  }, [clickEnabled]);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!clickEnabledRef.current) return;
      // Mobile: skip the pixel click burst entirely
      if (window.matchMedia("(max-width: 640px)").matches) return;

      const target = e.target as Element | null;
      const onInteractive = !!target?.closest?.(
        'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"]'
      );

      const { muted, level } = soundRef.current;

      if (!muted) {
        hapticRef.current?.trigger?.(hapticIntensity(level));

        if (!audioCtxRef.current) {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (Ctx) audioCtxRef.current = new Ctx();
        }
        const ctx = audioCtxRef.current;
        if (ctx) {
          if (ctx.state === "suspended") ctx.resume();
          playTick(ctx, level);
        }
      }

      if (onInteractive) return;

      const x = e.clientX;
      const y = e.clientY;
      const id = ++idRef.current;

      const angleOffset = Math.random() * Math.PI * 2;
      const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = angleOffset + (i / PARTICLE_COUNT) * Math.PI * 2;
        const jitter = 0.85 + Math.random() * 0.3;
        return {
          id: `${id}-${i}`,
          color: COLORS[i % COLORS.length],
          dx: Math.cos(angle) * BURST_RADIUS * jitter,
          dy: Math.sin(angle) * BURST_RADIUS * jitter,
        };
      });

      setBursts((prev) => [...prev, { id, x, y, particles }]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, DURATION * 1000);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            style={{
              position: "absolute",
              left: burst.x,
              top: burst.y,
              width: 0,
              height: 0,
            }}
          >
            {burst.particles.map((p) => (
              <motion.span
                key={p.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "0.5px",
                  height: "0.5px",
                  backgroundColor: p.color,
                  imageRendering: "pixelated",
                  willChange: "transform, opacity",
                }}
                initial={{
                  transform: "translate3d(-50%, -50%, 0) scale(1)",
                  opacity: 0,
                }}
                animate={{
                  transform: `translate3d(calc(-50% + ${p.dx}px), calc(-50% + ${p.dy}px), 0) scale(${GROWN_SIZE})`,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: DURATION,
                  ease: EASE_OUT,
                  opacity: {
                    duration: DURATION,
                    times: [0, 0.12, 0.6, 1],
                    ease: "linear",
                  },
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
