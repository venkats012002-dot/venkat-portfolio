"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  'Your Eyes Are Always Viewing a "Darkness" That Isn\'t Black',
  "You Are Most Creative When You Are Tired",
  'Your Brain "Fabricates" 30% of Your Memories',
  "QWERTY Was Built to Slow You Down",
  "Bubble Wrap Was Originally Textured Wallpaper",
  'Blue is the World\'s "Safest" Color',
];

const DAMPING = 0.10;
const MAX_PULL = 72;
const RETRACT_DELAY = 80;
const RETRACT_DURATION = 380;
const ENGAGE_QUIET_MS = 250;
const GESTURE_GAP_MS = 120;

function getScrollEl(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>("[data-scroll-container]") ||
    (document.scrollingElement as HTMLElement | null) ||
    document.documentElement
  );
}

function findInternalScrollable(
  el: Element | null,
  mainScrollEl: HTMLElement
): HTMLElement | null {
  let current = el as HTMLElement | null;
  while (current && current !== mainScrollEl) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export default function TopCloud() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const pageEl = document.getElementById("page-translate");
    if (!pageEl) return;

    let accumulated = 0;
    let readyForNext = false;
    let retractTimer: ReturnType<typeof setTimeout> | null = null;
    let retractRaf: number | null = null;
    let lastNotAtTopAt = -Infinity;
    let lastWheelAt = -Infinity;

    const onAnyScroll = () => {
      const el = getScrollEl();
      if (el && el.scrollTop > 0) lastNotAtTopAt = performance.now();
    };
    // Capture phase catches scroll events on any element (they don't bubble).
    document.addEventListener("scroll", onAnyScroll, true);

    const applyTransform = (px: number) => {
      pageEl.style.transform =
        px > 0 ? `translate3d(0, ${px}px, 0)` : "";
    };

    const cancelRetract = () => {
      if (retractTimer) {
        clearTimeout(retractTimer);
        retractTimer = null;
      }
      if (retractRaf !== null) {
        cancelAnimationFrame(retractRaf);
        retractRaf = null;
      }
    };

    const runRetract = () => {
      const start = accumulated;
      if (start <= 0) {
        readyForNext = true;
        return;
      }
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / RETRACT_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = start * (1 - eased);
        accumulated = value;
        applyTransform(value);
        if (t < 1) {
          retractRaf = requestAnimationFrame(step);
        } else {
          accumulated = 0;
          applyTransform(0);
          retractRaf = null;
          readyForNext = true;
        }
      };
      retractRaf = requestAnimationFrame(step);
    };

    const scheduleRetract = () => {
      if (retractTimer) clearTimeout(retractTimer);
      retractTimer = setTimeout(() => {
        retractTimer = null;
        runRetract();
      }, RETRACT_DELAY);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;
      const scrollEl = getScrollEl();
      if (!scrollEl) return;
      if (findInternalScrollable(e.target as Element | null, scrollEl)) return;
      const scrollTop = scrollEl.scrollTop;
      const now = performance.now();
      const sinceLastWheel = now - lastWheelAt;
      lastWheelAt = now;
      // Treat the wheel event itself as evidence the page just moved if it
      // was above 0; this catches the moment scrollTop ticks down to 0.
      if (scrollTop > 0) lastNotAtTopAt = now;

      if (e.deltaY < 0 && scrollTop <= 0) {
        // Only engage on a fresh upward gesture made while already settled at
        // the top. Two-part guard: time settled at top AND a gap since the
        // last wheel tick (proves the user lifted fingers / momentum died).
        const settledAtTopFor = now - lastNotAtTopAt;
        const isFreshGesture =
          accumulated > 0 ||
          (settledAtTopFor > ENGAGE_QUIET_MS && sinceLastWheel > GESTURE_GAP_MS);
        if (!isFreshGesture) return;

        e.preventDefault();
        cancelRetract();

        if (readyForNext && accumulated === 0) {
          setQuoteIdx((i) => (i + 1) % QUOTES.length);
          readyForNext = false;
        }

        const next = Math.min(
          MAX_PULL,
          accumulated - e.deltaY * DAMPING
        );
        accumulated = next;
        applyTransform(next);
        scheduleRetract();
      } else if (e.deltaY > 0 && accumulated > 0) {
        e.preventDefault();
        cancelRetract();
        const next = Math.max(0, accumulated - e.deltaY * DAMPING);
        accumulated = next;
        applyTransform(next);
        if (next > 0) scheduleRetract();
        else readyForNext = true;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("scroll", onAnyScroll, true);
      cancelRetract();
      applyTransform(0);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        backgroundColor: "var(--color-neutral-light)",
        height: MAX_PULL,
        left: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/svgs/cloud-top.svg"
        alt=""
        style={{
          bottom: 0,
          display: "block",
          left: 0,
          position: "absolute",
          width: "100%",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          color: "var(--color-neutral-7)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          left: 0,
          lineHeight: "21px",
          paddingTop: 20,
          position: "absolute",
          right: 0,
          textAlign: "center",
          top: 0,
        }}
      >
        {QUOTES[quoteIdx]}
      </div>
    </div>
  );
}
