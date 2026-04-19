"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// 5x5 color grids for each letter state
const LETTER_GRIDS: Record<string, string[][]> = {
  V: [
    ["#FFFFFF", "#F7941D", "#3554A4", "#F7ED11", "#FFFFFF"],
    ["#FFFFFF", "#F7ED11", "#EF1D26", "#F7941D", "#FFFFFF"],
    ["#EF1D26", "#FFFFFF", "#6BBD3F", "#FFFFFF", "#6BBD3F"],
    ["#3554A4", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#F7941D"],
    ["#EF1D26", "#3554A4", "#FFFFFF", "#F7ED11", "#6BBD3F"],
  ],
  E: [
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ["#FFFFFF", "#F7941D", "#EF1D26", "#6BBD3F", "#3554A4"],
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#F7ED11"],
    ["#FFFFFF", "#EF1D26", "#3554A4", "#6BBD3F", "#F7941D"],
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
  ],
  N: [
    ["#FFFFFF", "#F7941D", "#F7ED11", "#EF1D26", "#FFFFFF"],
    ["#FFFFFF", "#FFFFFF", "#6BBD3F", "#3554A4", "#FFFFFF"],
    ["#FFFFFF", "#F7ED11", "#FFFFFF", "#F7941D", "#FFFFFF"],
    ["#FFFFFF", "#3554A4", "#EF1D26", "#FFFFFF", "#FFFFFF"],
    ["#FFFFFF", "#F7941D", "#F7ED11", "#6BBD3F", "#FFFFFF"],
  ],
  K: [
    ["#FFFFFF", "#EF1D26", "#3554A4", "#FFFFFF", "#F7941D"],
    ["#FFFFFF", "#F7ED11", "#FFFFFF", "#F7ED11", "#EF1D26"],
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#6BBD3F", "#3554A4"],
    ["#FFFFFF", "#F7941D", "#FFFFFF", "#3554A4", "#F7ED11"],
    ["#FFFFFF", "#EF1D26", "#6BBD3F", "#FFFFFF", "#EF1D26"],
  ],
  A: [
    ["#EF1D26", "#3554A4", "#FFFFFF", "#F7ED11", "#F7941D"],
    ["#6BBD3F", "#FFFFFF", "#6BBD3F", "#FFFFFF", "#EF1D26"],
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ["#FFFFFF", "#6BBD3F", "#EF1D26", "#3554A4", "#FFFFFF"],
    ["#FFFFFF", "#F7941D", "#F7ED11", "#F7941D", "#FFFFFF"],
  ],
  T: [
    ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ["#EF1D26", "#6BBD3F", "#FFFFFF", "#3554A4", "#F7ED11"],
    ["#F7941D", "#F7ED11", "#FFFFFF", "#F7941D", "#3554A4"],
    ["#F7ED11", "#3554A4", "#FFFFFF", "#6BBD3F", "#EF1D26"],
    ["#EF1D26", "#6BBD3F", "#FFFFFF", "#F7ED11", "#F7941D"],
  ],
};

const SEQUENCE = ["V", "E", "N", "K", "A", "T"] as const;

// Transition config matching loading screen specs
const FLIP_DURATION = 90; // ms per cell flip
const STAGGER = 27; // ms stagger between cells in a slice
const INTERVAL = 500; // ms between letter transitions

interface RubiksCubeProps {
  size?: number;
  animate?: boolean;
}

export default function RubiksCube({ size = 48, animate = false }: RubiksCubeProps) {
  const [grid, setGrid] = useState<string[][]>(LETTER_GRIDS.V);
  const animatingRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (cycleRef.current) {
      clearTimeout(cycleRef.current);
      cycleRef.current = null;
    }
  }, []);

  // Transition from current grid to target letter grid using row/column slice rotations
  const transitionTo = useCallback((targetLetter: string, useRows: boolean) => {
    const target = LETTER_GRIDS[targetLetter];

    for (let slice = 0; slice < 5; slice++) {
      for (let cell = 0; cell < 5; cell++) {
        const delay = slice * STAGGER + cell * STAGGER;
        const t = setTimeout(() => {
          setGrid((prev) => {
            const next = prev.map((r) => [...r]);
            if (useRows) {
              next[slice][cell] = target[slice][cell];
            } else {
              next[cell][slice] = target[cell][slice];
            }
            return next;
          });
        }, delay);
        timeoutsRef.current.push(t);
      }
    }
  }, []);

  const runCycle = useCallback(() => {
    if (!animatingRef.current) return;

    let elapsed = 0;
    SEQUENCE.forEach((letter, idx) => {
      const delay = idx * INTERVAL;
      const t = setTimeout(() => {
        if (!animatingRef.current) return;
        transitionTo(letter, idx % 2 === 0);
      }, delay);
      timeoutsRef.current.push(t);
      elapsed = delay + FLIP_DURATION + STAGGER * 5;
    });

    // Loop back after full cycle
    cycleRef.current = setTimeout(() => {
      if (animatingRef.current) runCycle();
    }, elapsed + INTERVAL);
  }, [transitionTo]);

  useEffect(() => {
    if (animate) {
      animatingRef.current = true;
      runCycle();
    } else {
      animatingRef.current = false;
      clearAllTimeouts();
      setGrid(LETTER_GRIDS.V);
    }

    return clearAllTimeouts;
  }, [animate, runCycle, clearAllTimeouts]);

  const cellSize = (size - 0.32 * 6) / 5; // account for strokes

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <clipPath id="rubiks-clip">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
      <g clipPath="url(#rubiks-clip)">
        <rect width={size} height={size} fill="#FFFFFF" />
        {grid.map((row, r) =>
          row.map((color, c) => {
            const x = 0.16 + c * (cellSize + 0.32);
            const y = 0.16 + r * (cellSize + 0.32);
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={color}
                stroke="#000000"
                strokeWidth="0.32"
                style={{
                  transition: `fill ${FLIP_DURATION}ms ease`,
                }}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}
