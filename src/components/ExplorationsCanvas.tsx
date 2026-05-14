"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ExplorationCard, { type Exploration } from "@/components/ExplorationCard";

const CARD_SIZE = 360;
const CELL = 520;
const MAX_JITTER = 90;
const MAX_ROTATE = 6;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number, salt: number): number {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

type Placed = {
  item: Exploration;
  x: number;
  y: number;
  rotate: number;
};

function layout(items: Exploration[]): Placed[] {
  const n = items.length;
  if (n === 0) return [];
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  return items.map((item, i) => {
    const seed = hash(item.id);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = (seededRand(seed, 1) - 0.5) * 2 * MAX_JITTER;
    const jy = (seededRand(seed, 2) - 0.5) * 2 * MAX_JITTER;
    const rot = (seededRand(seed, 3) - 0.5) * 2 * MAX_ROTATE;
    return {
      item,
      x: col * CELL + jx,
      y: row * CELL + jy,
      rotate: rot,
    };
  });
}

export default function ExplorationsCanvas({ items }: { items: Exploration[] }) {
  const placed = useMemo(() => layout(items), [items]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (placed.length === 0) return;
    const cols = Math.max(1, Math.ceil(Math.sqrt(placed.length)));
    const rows = Math.ceil(placed.length / cols);
    const contentW = cols * CELL;
    const contentH = rows * CELL;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setOffset({
      x: vw / 2 - contentW / 2 - CARD_SIZE / 2,
      y: vh / 2 - contentH / 2 - CARD_SIZE / 2,
    });
  }, [placed.length]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      setOffset({
        x: d.startX + (e.clientX - d.startClientX),
        y: d.startY + (e.clientY - d.startClientY),
      });
    }
    function onUp() {
      if (!dragRef.current) return;
      dragRef.current = null;
      setDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a, button")) return;
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: offset.x,
      startY: offset.y,
    };
    setDragging(true);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      style={{
        backgroundColor: "var(--color-neutral-light)",
        cursor: dragging ? "grabbing" : "grab",
        height: "100vh",
        left: 0,
        overflow: "hidden",
        position: "fixed",
        top: 0,
        touchAction: "none",
        userSelect: "none",
        width: "100vw",
      }}
    >
      <div
        style={{
          left: 0,
          position: "absolute",
          top: 0,
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          willChange: "transform",
        }}
      >
        {placed.map(({ item, x, y, rotate }) => (
          <div
            key={item.id}
            style={{
              left: x,
              position: "absolute",
              top: y,
              transform: `rotate(${rotate}deg)`,
              width: CARD_SIZE,
            }}
          >
            <ExplorationCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
