"use client";

import { useEffect, useRef, useState } from "react";

const STATES = ["Idle", "Sleepy", "Sleep"] as const;
type StateName = typeof STATES[number];

const FRAME_SIZE = 32;
const DISPLAY_SIZE = 72;
const FRAME_INTERVAL = 120;
const SLEEPY_DELAY = 5000;
const SLEEP_DELAY = 7000;

export default function StickyWhit3fang() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hiddenForFooter, setHiddenForFooter] = useState(false);

  useEffect(() => {
    const scrollEl = document.querySelector<HTMLElement>("[data-scroll-container]");
    if (!scrollEl) return;

    const compute = () => {
      const hiddenEl = document.querySelector<HTMLElement>("[data-hidden-footer]");
      if (!hiddenEl) return;
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const revealStart = maxScroll - hiddenEl.offsetHeight;
      setHiddenForFooter(scrollEl.scrollTop > revealStart - 40);
    };

    compute();
    scrollEl.addEventListener("scroll", compute, { passive: true });
    return () => scrollEl.removeEventListener("scroll", compute);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = DISPLAY_SIZE;
    canvas.height = DISPLAY_SIZE;
    ctx.imageSmoothingEnabled = false;

    const sprites: Partial<Record<StateName, { img: HTMLImageElement; frames: number }>> = {};
    let currentState: StateName = "Idle";
    let currentFrame = 0;
    let lastFrameTime = 0;
    let rafId: number | null = null;
    let sleepyTimer: ReturnType<typeof setTimeout> | null = null;
    let sleepTimer: ReturnType<typeof setTimeout> | null = null;
    let loadedCount = 0;

    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      const sprite = sprites[currentState];
      if (!sprite) return;
      ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
      ctx.drawImage(
        sprite.img,
        currentFrame * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE,
        0, 0, DISPLAY_SIZE, DISPLAY_SIZE
      );
      currentFrame = (currentFrame + 1) % sprite.frames;
    };

    STATES.forEach((name) => {
      const img = new Image();
      img.onload = () => {
        sprites[name] = { img, frames: img.width / FRAME_SIZE };
        loadedCount++;
        if (loadedCount === STATES.length && rafId === null) {
          rafId = requestAnimationFrame(animate);
        }
      };
      img.src = `/whit3fang/${name}.png`;
    });

    const resetInactivity = () => {
      if (sleepyTimer) clearTimeout(sleepyTimer);
      if (sleepTimer) clearTimeout(sleepTimer);
      sleepyTimer = setTimeout(() => {
        currentState = "Sleepy";
        currentFrame = 0;
        sleepTimer = setTimeout(() => {
          if (currentState === "Sleepy") {
            currentState = "Sleep";
            currentFrame = 0;
          }
        }, SLEEP_DELAY);
      }, SLEEPY_DELAY);
    };

    const wake = () => {
      if (currentState === "Sleepy" || currentState === "Sleep") {
        currentState = "Idle";
        currentFrame = 0;
      }
      resetInactivity();
    };

    document.addEventListener("mousemove", wake);
    document.addEventListener("click", wake);
    resetInactivity();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (sleepyTimer) clearTimeout(sleepyTimer);
      if (sleepTimer) clearTimeout(sleepTimer);
      document.removeEventListener("mousemove", wake);
      document.removeEventListener("click", wake);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="whit3fang"
      className="sticky-whit3fang"
      style={{
        position: "fixed",
        right: "32px",
        bottom: "32px",
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 50,
        opacity: hiddenForFooter ? 0 : 1,
        pointerEvents: hiddenForFooter ? "none" : "auto",
        transition: "opacity 0.3s ease",
      }}
    >
      <canvas ref={canvasRef} style={{ imageRendering: "pixelated", display: "block" }} />
    </button>
  );
}
