"use client";

import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import PlayButton from "./PlayButton";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import type { Exploration } from "./ExplorationCard";

const ITEM_HEIGHT = 85;
const ITEM_WIDTH = 120;
const ITEM_GAP = 24;
const ITEM_SPACING = ITEM_HEIGHT + ITEM_GAP;

const OVAL_A = 350;
const TILT = -0.15;

const FRICTION = 0.95;
const SCROLL_SENSITIVITY = 0.12;
const SNAP_THRESHOLD = 0.5;
const SNAP_IDLE_MS = 120;
const SNAP_DURATION = 500;

function playTick(ctx: AudioContext, level: number) {
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
}

export default function ExplorationsGallery({ items }: { items: Exploration[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const controlsRef = useRef<{ snapToIndex: (i: number) => void } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sound = useSoundSettings();
  const soundRef = useRef(sound);
  const haptic = useWebHaptics();
  const hapticRef = useRef(haptic);

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  useEffect(() => {
    hapticRef.current = haptic;
  }, [haptic]);

  itemRefs.current.length = items.length;

  useEffect(() => {
    const wheelEl = wheelRef.current;
    const containerEl = containerRef.current;
    if (!wheelEl || !containerEl || items.length === 0) return;

    const total = items.length;

    let centerY = wheelEl.clientHeight / 2;
    let C = centerY - ITEM_HEIGHT / 2;

    let scrollOffset = -C; // item 0 at center
    let velocity = 0;
    let isScrolling = false;
    let scrollRaf: number | null = null;
    let snapRaf: number | null = null;
    let lastScrollTime = 0;
    let currentIndex = -1;

    const updateMetrics = () => {
      centerY = wheelEl.clientHeight / 2;
      C = centerY - ITEM_HEIGHT / 2;
    };

    const positionItems = () => {
      const totalHeight = total * ITEM_SPACING;

      let closestIdx = 0;
      let closestDist = Infinity;

      for (let i = 0; i < total; i++) {
        const node = itemRefs.current[i];
        if (!node) continue;

        let rawY = i * ITEM_SPACING - scrollOffset;
        rawY =
          ((rawY % totalHeight) + totalHeight + ITEM_SPACING / 2) %
            totalHeight -
          ITEM_SPACING / 2;

        const relY = rawY - C;
        const t = relY / centerY;
        const clampedT = Math.max(-1, Math.min(1, t));
        const ovalX = OVAL_A * Math.sqrt(Math.max(0, 1 - clampedT * clampedT));
        const arcX = -ovalX + OVAL_A + relY * Math.sin(TILT) * 0.5;

        const absDist = Math.abs(relY);
        const maxDist = centerY;

        const isCenter = absDist < ITEM_SPACING * 0.4;
        const scale = isCenter
          ? 1.25
          : Math.max(0.6, 1 - absDist / (maxDist * 1.2));
        const edgeDist = Math.max(0, absDist - (maxDist - 48));
        const opacity = edgeDist > 0 ? Math.max(0.3, 1 - edgeDist / 48) : 1;

        node.style.transform = `translate(${arcX}px, ${rawY}px) scale(${scale})`;
        node.style.opacity = String(opacity);
        node.style.zIndex = String(isCenter ? 10 : Math.round(10 - absDist / 50));

        const distToCenter = Math.abs(rawY - C);
        if (distToCenter < closestDist) {
          closestDist = distToCenter;
          closestIdx = i;
        }
      }

      if (closestIdx !== currentIndex) {
        const isInitial = currentIndex === -1;
        currentIndex = closestIdx;
        setActiveIdx(closestIdx);

        if (!isInitial && !soundRef.current.muted) {
          hapticRef.current?.trigger?.("weak");
          if (!audioCtxRef.current) {
            const Ctx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            if (Ctx) audioCtxRef.current = new Ctx();
          }
          const ctx = audioCtxRef.current;
          if (ctx) {
            if (ctx.state === "suspended") ctx.resume();
            playTick(ctx, soundRef.current.level);
          }
        }
      }
    };

    const cancelSnap = () => {
      if (snapRaf !== null) {
        cancelAnimationFrame(snapRaf);
        snapRaf = null;
      }
    };

    const snapToTarget = (target: number) => {
      cancelSnap();
      const startVal = scrollOffset;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / SNAP_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        scrollOffset = startVal + (target - startVal) * eased;
        positionItems();
        if (t < 1) {
          snapRaf = requestAnimationFrame(tick);
        } else {
          scrollOffset = target;
          snapRaf = null;
          positionItems();
        }
      };
      snapRaf = requestAnimationFrame(tick);
    };

    const snapToNearest = () => {
      const k = Math.round((scrollOffset + C) / ITEM_SPACING);
      snapToTarget(k * ITEM_SPACING - C);
    };

    const snapToIndex = (i: number) => {
      // Choose the wrap that requires the shortest travel, so clicking
      // on a thumbnail near either end doesn't sweep across the whole list.
      const totalHeight = total * ITEM_SPACING;
      const naive = i * ITEM_SPACING - C;
      const candidates = [naive, naive + totalHeight, naive - totalHeight];
      let best = naive;
      let bestDist = Infinity;
      for (const c of candidates) {
        const d = Math.abs(c - scrollOffset);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      snapToTarget(best);
    };

    controlsRef.current = { snapToIndex };

    const fluidScroll = () => {
      scrollOffset += velocity;
      velocity *= FRICTION;
      positionItems();
      const idle = Date.now() - lastScrollTime;
      if (Math.abs(velocity) < SNAP_THRESHOLD && idle > SNAP_IDLE_MS) {
        isScrolling = false;
        velocity = 0;
        snapToNearest();
        return;
      }
      scrollRaf = requestAnimationFrame(fluidScroll);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelSnap();
      velocity += e.deltaY * SCROLL_SENSITIVITY;
      lastScrollTime = Date.now();
      if (!isScrolling) {
        isScrolling = true;
        scrollRaf = requestAnimationFrame(fluidScroll);
      }
    };

    const onResize = () => {
      updateMetrics();
      positionItems();
    };

    containerEl.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    updateMetrics();
    positionItems();

    return () => {
      containerEl.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      cancelSnap();
      controlsRef.current = null;
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        alignSelf: "stretch",
        boxSizing: "border-box",
        display: "flex",
        flex: 1,
        gap: 48,
        minHeight: "min(720px, calc(100dvh - 240px))",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        ref={wheelRef}
        style={{
          flexShrink: 0,
          height: "auto",
          overflow: "visible",
          position: "relative",
          transform: "translateX(168px)",
          width: 480,
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => controlsRef.current?.snapToIndex(i)}
            aria-label={`Show ${item.name}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              height: ITEM_HEIGHT,
              left: 0,
              outline: "none",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              top: 0,
              width: ITEM_WIDTH,
              willChange: "transform, opacity",
            }}
          >
            <Thumbnail item={item} />
          </button>
        ))}
      </div>

      <div
        style={{
          left: "50%",
          pointerEvents: "none",
          position: "absolute",
          top: "50%",
          transform: "translate(calc(-50% + 216px), -50%)",
          width: 480,
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <Preview item={items[activeIdx]} />
        </div>
      </div>

      <GalleryNav />
    </div>
  );
}

function GalleryNav() {
  const links = [
    { label: "Work", href: "/work" },
    { label: "Sides", href: "/sides" },
    { label: "About", href: "/about" },
  ];
  return (
    <nav
      style={{
        alignItems: "start",
        bottom: 48,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        left: 48,
        position: "fixed",
        zIndex: 10,
      }}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          style={{
            boxSizing: "border-box",
            color: "var(--color-neutral-dark)",
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            textDecoration: "none",
            ...(link.label === "Sides" ? { width: 40 } : {}),
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function Thumbnail({ item }: { item: Exploration }) {
  if (item.media?.type === "video") {
    return (
      <video
        src={item.media.src}
        autoPlay
        muted
        loop
        playsInline
        style={{
          display: "block",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          width: "100%",
        }}
      />
    );
  }
  if (item.media?.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.media.src}
        alt={item.name}
        loading="lazy"
        style={{
          display: "block",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          width: "100%",
        }}
      />
    );
  }
  return (
    <div
      style={{
        backgroundColor: "var(--color-neutral-3)",
        height: "100%",
        width: "100%",
      }}
    />
  );
}

function Preview({ item }: { item: Exploration }) {
  return (
    <article
      key={item.id}
      style={{
        animation: "exploration-preview-fade 320ms ease",
        aspectRatio: "1 / 1",
        border: "1px solid var(--color-neutral-4)",
        boxSizing: "border-box",
        maxWidth: 480,
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: item.media ? "transparent" : "var(--color-neutral-3)",
          backgroundImage:
            item.media?.type === "image" ? `url(${item.media.src})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          boxSizing: "border-box",
          height: "70%",
          left: "50%",
          overflow: "clip",
          position: "absolute",
          top: "50%",
          translate: "-50% -50%",
          width: "70%",
        }}
      >
        {item.media?.type === "video" && (
          <video
            src={item.media.src}
            autoPlay
            muted
            loop
            playsInline
            style={{
              display: "block",
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
          />
        )}
      </div>

      {item.link && (
        <div style={{ position: "absolute", right: 24, top: 16 }}>
          <PlayButton label={item.link.label ?? "View Live"} href={item.link.href} />
        </div>
      )}

      <div
        style={{
          bottom: 16,
          color: "var(--color-neutral-dark)",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          left: 32,
          lineHeight: "29px",
          position: "absolute",
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          bottom: 16,
          color: "var(--color-neutral-7)",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "29px",
          position: "absolute",
          right: 32,
        }}
      >
        {item.year}
      </div>
    </article>
  );
}
