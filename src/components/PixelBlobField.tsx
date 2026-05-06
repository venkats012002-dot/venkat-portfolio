"use client";

import { useEffect, useRef } from "react";

const CELL = 12;
const MIN_DOT = 1;
const MAX_DOT = CELL * 0.5; // softer max so dots never crowd
const BG_COLOR = "#FFFFFF";
const DOT_COLOR = "#DDDDDD";

// Layered wave parameters: directional (kx, ky), spatial frequency (freq),
// temporal speed, phase offset. Combined sin field produces a soft, drifting
// interference pattern with no visible "blobs."
const WAVES = [
  { kx: 1.0,  ky: 0.3,  freq: 0.045, speed: 0.0006, phase: 0 },
  { kx: -0.6, ky: 0.9,  freq: 0.060, speed: 0.0008, phase: 1.7 },
  { kx: 0.4,  ky: -0.7, freq: 0.038, speed: 0.0005, phase: 3.1 },
];

export default function PixelBlobField({ height = 215 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let rafId = 0;
    let cancelled = false;

    function resize() {
      const width = container!.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      cols = Math.max(1, Math.floor(width / CELL));
      rows = Math.max(1, Math.floor(height / CELL));
      canvas!.width = cols * CELL * dpr;
      canvas!.height = rows * CELL * dpr;
      canvas!.style.width = `${cols * CELL}px`;
      canvas!.style.height = `${rows * CELL}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function render(now: number) {
      if (cancelled) return;
      ctx!.fillStyle = BG_COLOR;
      ctx!.fillRect(0, 0, cols * CELL, rows * CELL);

      ctx!.fillStyle = DOT_COLOR;
      const denom = WAVES.length;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v = 0;
          for (let i = 0; i < WAVES.length; i++) {
            const w = WAVES[i];
            v += Math.sin(
              (x * w.kx + y * w.ky) * w.freq + now * w.speed + w.phase
            );
          }
          // Map v from [-N..N] to [0..1] with a gentle curve
          const t = 0.5 + v / (denom * 2);
          const eased = t * t * (3 - 2 * t); // smoothstep
          const size = MIN_DOT + (MAX_DOT - MIN_DOT) * eased;
          const cx = x * CELL + CELL / 2;
          const cy = y * CELL + CELL / 2;
          ctx!.fillRect(cx - size / 2, cy - size / 2, size, size);
        }
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: BG_COLOR,
        boxSizing: "border-box",
        height,
        overflow: "clip",
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
      />
    </div>
  );
}
