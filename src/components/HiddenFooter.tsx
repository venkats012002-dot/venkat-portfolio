"use client";

import { useEffect, useRef } from "react";

const DAMPING = 0.08;
const PULL_LERP = 0.2;
const RETRACT_DELAY = 20;
const RETRACT_DURATION = 450;

function getScrollEl(): HTMLElement | null {
  // Use [data-scroll-container] only when it actually scrolls (home page).
  // Other pages keep the attribute as a styling hook but the document is the
  // real scroller, so fall back to document.scrollingElement so the wheel
  // logic can read/write the right scroll position there too.
  const container = document.querySelector<HTMLElement>("[data-scroll-container]");
  if (container) {
    const overflowY = window.getComputedStyle(container).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      container.scrollHeight > container.clientHeight
    ) {
      return container;
    }
  }
  return (
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

export default function HiddenFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = getScrollEl();
    const el = wrapperRef.current;
    if (!scrollEl || !el) return;

    let target = scrollEl.scrollTop;
    let pullRaf: number | null = null;
    let retractTimer: ReturnType<typeof setTimeout> | null = null;
    let retractRaf: number | null = null;

    const getZone = () => {
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const h = el.offsetHeight;
      return { revealStart: maxScroll - h, maxScroll, height: h };
    };

    const cancelPull = () => {
      if (pullRaf !== null) {
        cancelAnimationFrame(pullRaf);
        pullRaf = null;
      }
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

    const runPull = () => {
      if (pullRaf !== null) return;
      const tick = () => {
        const current = scrollEl.scrollTop;
        const diff = target - current;
        if (Math.abs(diff) < 0.5) {
          scrollEl.scrollTop = target;
          pullRaf = null;
          return;
        }
        scrollEl.scrollTop = current + diff * PULL_LERP;
        pullRaf = requestAnimationFrame(tick);
      };
      pullRaf = requestAnimationFrame(tick);
    };

    const runRetract = () => {
      const { revealStart } = getZone();
      if (scrollEl.scrollTop <= revealStart + 1) return;

      cancelPull();

      const startTop = scrollEl.scrollTop;
      const targetTop = revealStart;
      const startTime = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / RETRACT_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        scrollEl.scrollTop = startTop + (targetTop - startTop) * eased;
        target = scrollEl.scrollTop;
        if (t < 1) {
          retractRaf = requestAnimationFrame(step);
        } else {
          retractRaf = null;
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

    const handleWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;
      if (findInternalScrollable(e.target as Element | null, scrollEl)) return;

      const { revealStart, maxScroll, height } = getZone();
      if (height === 0 || maxScroll === 0) return;

      cancelRetract();

      if (e.deltaY > 0 && scrollEl.scrollTop >= revealStart - 1) {
        e.preventDefault();
        target = Math.max(scrollEl.scrollTop, target);
        target += e.deltaY * DAMPING;
        target = Math.min(target, maxScroll);
        runPull();
        scheduleRetract();
      } else if (e.deltaY < 0) {
        cancelPull();
        target = scrollEl.scrollTop;
        if (scrollEl.scrollTop > revealStart) {
          scheduleRetract();
        }
      }
    };

    // Listen on window so wheel events bubble in regardless of which element
    // actually scrolls (data-scroll-container on home, document elsewhere).
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelPull();
      cancelRetract();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-hidden-footer
      style={{
        alignSelf: "stretch",
        lineHeight: 0,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hidden-footer.png"
        alt=""
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}
