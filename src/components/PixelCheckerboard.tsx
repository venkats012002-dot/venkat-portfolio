"use client";

import { useEffect, useRef } from "react";

const BOX_SIZE = 120;
const CELL_SIZE = 8;
const GRID = BOX_SIZE / CELL_SIZE;

const BASE_DARK = { r: 245, g: 245, b: 245 };
const BASE_LIGHT = { r: 255, g: 255, b: 255 };

const GLOW_SHADES = [
  { r: 190, g: 190, b: 188 },
  { r: 165, g: 167, b: 170 },
  { r: 135, g: 135, b: 132 },
  { r: 110, g: 112, b: 115 },
  { r: 85, g: 85, b: 82 },
  { r: 60, g: 60, b: 62 },
  { r: 40, g: 40, b: 38 },
  { r: 20, g: 20, b: 20 },
];

type Cell = {
  x: number;
  y: number;
  isLight: boolean;
  glow: number;
  phase: 0 | 1 | 2;
  shade: { r: number; g: number; b: number };
  riseSpeed: number;
  fallSpeed: number;
};

export default function PixelCheckerboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cells: Cell[] = [];
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        cells.push({
          x,
          y,
          isLight: (x + y) % 2 === 0,
          glow: 0,
          phase: 0,
          shade: GLOW_SHADES[0],
          riseSpeed: 0,
          fallSpeed: 0,
        });
      }
    }

    function spawnTwinkles(count: number) {
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * cells.length);
        const cell = cells[idx];
        if (cell.isLight && cell.phase === 0) {
          cell.phase = 1;
          cell.glow = 0;
          cell.shade = GLOW_SHADES[Math.floor(Math.random() * GLOW_SHADES.length)];
          cell.riseSpeed = 0.002 + Math.random() * 0.004;
          cell.fallSpeed = 0.0008 + Math.random() * 0.002;
        }
      }
    }

    let lastTime = 0;
    let rafId = 0;
    let cancelled = false;

    function render(timestamp: number) {
      if (cancelled) return;
      const dt = timestamp - lastTime;
      lastTime = timestamp;

      spawnTwinkles(2);

      const imageData = ctx!.createImageData(GRID, GRID);
      const data = imageData.data;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        if (cell.phase === 1) {
          cell.glow = Math.min(1, cell.glow + dt * cell.riseSpeed);
          if (cell.glow >= 1) cell.phase = 2;
        } else if (cell.phase === 2) {
          cell.glow = Math.max(0, cell.glow - dt * cell.fallSpeed);
          if (cell.glow <= 0) {
            cell.phase = 0;
            cell.glow = 0;
          }
        }

        const base = cell.isLight ? BASE_LIGHT : BASE_DARK;
        const smooth = cell.glow * cell.glow * (3 - 2 * cell.glow);

        const r = base.r + (cell.shade.r - base.r) * smooth;
        const g = base.g + (cell.shade.g - base.g) * smooth;
        const b = base.b + (cell.shade.b - base.b) * smooth;

        const px = (cell.y * GRID + cell.x) * 4;
        data[px] = r;
        data[px + 1] = g;
        data[px + 2] = b;
        data[px + 3] = 255;
      }

      ctx!.putImageData(imageData, 0, 0);
      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: BOX_SIZE,
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        width: BOX_SIZE,
      }}
    >
      <canvas
        ref={canvasRef}
        width={GRID}
        height={GRID}
        style={{
          display: "block",
          height: BOX_SIZE,
          imageRendering: "pixelated",
          width: BOX_SIZE,
        }}
      />
    </div>
  );
}
