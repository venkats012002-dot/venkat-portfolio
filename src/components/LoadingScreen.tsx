"use client";

import { useEffect, useRef, useState } from "react";

const W = "#FFFFFF", R = "#EF1D26", O = "#F7941D", Y = "#F7ED11", G = "#6BBD3F", B = "#3554A4";

const STATES = [
  { letter: "V", grid: [[W,O,B,Y,W],[W,Y,R,O,W],[R,W,G,W,G],[B,W,W,W,O],[R,B,W,Y,G]] },
  { letter: "E", grid: [[W,W,W,W,W],[W,O,R,G,B],[W,W,W,W,Y],[W,R,B,G,O],[W,W,W,W,W]] },
  { letter: "N", grid: [[W,O,Y,R,W],[W,W,G,B,W],[W,Y,W,O,W],[W,B,R,W,W],[W,O,Y,G,W]] },
  { letter: "K", grid: [[W,R,B,W,O],[W,Y,W,Y,R],[W,W,W,G,B],[W,O,W,B,Y],[W,R,G,W,R]] },
  { letter: "A", grid: [[R,B,W,Y,O],[G,W,G,W,R],[W,W,W,W,W],[W,G,R,B,W],[W,O,Y,O,W]] },
  { letter: "T", grid: [[W,W,W,W,W],[R,G,W,B,Y],[O,Y,W,O,B],[Y,B,W,G,R],[R,G,W,Y,O]] },
];

type Axis = "row" | "col";
type Transition = { axis: Axis; order: number[] };

const TRANSITIONS: Transition[] = [
  { axis: "row", order: [0,1,2,3,4] },
  { axis: "col", order: [0,1,2,3,4] },
  { axis: "row", order: [4,3,2,1,0] },
  { axis: "col", order: [4,3,2,1,0] },
  { axis: "row", order: [0,1,2,3,4] },
];

const FUN_FACTS = [
  'Your Eyes Are Always Viewing a "Darkness" That Isn\'t Black',
  "You Are Most Creative When You Are Tired",
  'Your Brain "Fabricates" 30% of Your Memories',
  "QWERTY Was Built to Slow You Down",
  "Bubble Wrap Was Originally Textured Wallpaper",
  'Blue is the World\'s "Safest" Color',
];

const PERCENTS = [15, 30, 45, 60, 75, 90];

// Timing (~4s total)
const INITIAL_DELAY = 300;
const LETTER_INTERVAL = 600;
const FLIP_DURATION = 120;
const SLICE_STAGGER = 27;
const HOLD_AFTER_LAST = 200;
const FINAL_COUNT_DURATION = 250;
const FADE_DURATION = 500;

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [letterIdx, setLetterIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(0);
  const [axis, setAxis] = useState<Axis>("row");
  const [flippedSlices, setFlippedSlices] = useState<Set<number>>(new Set());

  const [percent, setPercent] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  const percentRef = useRef(0);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let rafId: number | null = null;

    const countTo = (target: number, duration: number) => {
      const start = percentRef.current;
      const startTime = performance.now();
      if (rafId !== null) cancelAnimationFrame(rafId);
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(start + (target - start) * eased);
        percentRef.current = val;
        setPercent(val);
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const runFlip = (toIdx: number, tIdx: number) => {
      const t = TRANSITIONS[tIdx];
      setAxis(t.axis);
      setNextIdx(toIdx);
      setFlippedSlices(new Set());

      t.order.forEach((sliceIdx, i) => {
        const to = setTimeout(() => {
          setFlippedSlices((prev) => {
            const n = new Set(prev);
            n.add(sliceIdx);
            return n;
          });
        }, i * SLICE_STAGGER);
        timeouts.push(to);
      });

      const commitAt = (t.order.length - 1) * SLICE_STAGGER + FLIP_DURATION;
      timeouts.push(setTimeout(() => {
        setLetterIdx(toIdx);
        setFlippedSlices(new Set());
      }, commitAt));
    };

    // Schedule letter transitions 1..5
    for (let i = 1; i < STATES.length; i++) {
      const delay = INITIAL_DELAY + (i - 1) * LETTER_INTERVAL;
      timeouts.push(setTimeout(() => {
        setFactVisible(false);
        timeouts.push(setTimeout(() => {
          setFactIdx(i);
          setFactVisible(true);
        }, 150));
        countTo(PERCENTS[i], 450);
        runFlip(i, i - 1);
      }, delay));
    }

    // After last letter: hold → count to 100 → fade → done
    const lastStart = INITIAL_DELAY + (STATES.length - 2) * LETTER_INTERVAL;
    const lastCommit = lastStart + (4 * SLICE_STAGGER + FLIP_DURATION);
    const endDelay = lastCommit + HOLD_AFTER_LAST;

    timeouts.push(setTimeout(() => {
      countTo(100, FINAL_COUNT_DURATION);
      timeouts.push(setTimeout(() => {
        setFadingOut(true);
        timeouts.push(setTimeout(() => {
          setHidden(true);
          onDone();
        }, FADE_DURATION));
      }, FINAL_COUNT_DURATION + 50));
    }, endDelay));

    return () => {
      timeouts.forEach(clearTimeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  const frontGrid = STATES[letterIdx].grid;
  const backGrid = STATES[nextIdx].grid;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      {/* Fun fact */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "180%",
          color: "#7A7A7A",
          padding: "0 48px",
          opacity: factVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {FUN_FACTS[factIdx]}
      </div>

      {/* Cube (keyed so each commit = fresh mount at rotation 0) */}
      <div
        key={letterIdx}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 58px)",
          gridTemplateRows: "repeat(5, 58px)",
          gap: 3,
          background: "#000",
          padding: 3,
          borderRadius: 6,
          transform: "scale(0.39)",
        }}
      >
        {frontGrid.flatMap((row, r) =>
          row.map((_, c) => {
            const sliceVal = axis === "row" ? r : c;
            const flipped = flippedSlices.has(sliceVal);
            const dir = sliceVal % 2 === 0 ? 1 : -1;
            const transform = flipped
              ? axis === "row"
                ? `rotateX(${dir * 180}deg)`
                : `rotateY(${dir * -180}deg)`
              : "rotateX(0deg) rotateY(0deg)";

            return (
              <div key={`${r}-${c}`} style={{ width: 58, height: 58, perspective: 400 }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transform,
                    transition: `transform ${FLIP_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 5,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: frontGrid[r][c],
                      transform: "rotateX(0deg)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 5,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: backGrid[r][c],
                      transform: axis === "row" ? "rotateX(-180deg)" : "rotateY(-180deg)",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Text group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          marginTop: 32,
        }}
      >
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, lineHeight: "180%", color: "#101010" }}>
          Loading...
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 32, lineHeight: "180%", color: "#101010" }}>
          {percent}%
        </span>
      </div>
    </div>
  );
}
