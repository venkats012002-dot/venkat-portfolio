"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 120;
const TRACK_WIDTH = 120;
const TRACK_HEIGHT = 20;
const THUMB_SIZE = 16;
const THUMB_PADDING = 2;
const THUMB_MIN = THUMB_PADDING;
const THUMB_MAX = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING;
const THUMB_RANGE = THUMB_MAX - THUMB_MIN;

const MIN_N = 6;
const MAX_N = 120;

export default function PixelateSlider({
  src,
  alt = "",
  onProgress,
}: {
  src: string;
  alt?: string;
  onProgress?: (value: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const draggingRef = useRef(false);
  const [thumbX, setThumbX] = useState(THUMB_MIN);
  const [hasInteracted, setHasInteracted] = useState(false);

  const render = (x: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const value = (x - THUMB_MIN) / THUMB_RANGE;
    const n = Math.max(2, Math.round(MIN_N + (MAX_N - MIN_N) * value));

    const off = document.createElement("canvas");
    off.width = n;
    off.height = n;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    offCtx.imageSmoothingEnabled = true;
    offCtx.drawImage(img, 0, 0, n, n);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(off, 0, 0, n, n, 0, 0, SIZE, SIZE);
  };

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      render(thumbX);
    };
    return () => {
      imageRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    render(thumbX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbX]);

  useEffect(() => {
    if (!onProgress) return;
    onProgress((thumbX - THUMB_MIN) / THUMB_RANGE);
  }, [thumbX, onProgress]);

  const updateFromPointerX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const cursorX = clientX - rect.left;
    const newX = Math.max(
      THUMB_MIN,
      Math.min(THUMB_MAX, cursorX - THUMB_SIZE / 2)
    );
    setThumbX(newX);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setHasInteracted(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromPointerX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointerX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const valuePct = Math.round(((thumbX - THUMB_MIN) / THUMB_RANGE) * 100);

  return (
    <div
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        aria-label={alt}
        style={{
          display: "block",
          height: SIZE,
          imageRendering: "pixelated",
          width: SIZE,
        }}
      />
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valuePct}
        aria-label="Reveal photo"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          backgroundColor: "#DDDDDD",
          boxSizing: "border-box",
          cursor: "pointer",
          flexShrink: 0,
          height: TRACK_HEIGHT,
          overflow: "clip",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
          width: TRACK_WIDTH,
        }}
      >
        {/* Filled portion behind the thumb — tinted with the Control Center accent */}
        <div
          aria-hidden
          style={{
            backgroundColor: "var(--color-accent-light)",
            boxSizing: "border-box",
            height: THUMB_SIZE,
            left: 0,
            position: "absolute",
            top: 2,
            transition: "background-color 0.25s ease",
            width: thumbX + THUMB_SIZE / 2,
          }}
        />
        <div
          style={{
            backgroundColor: "var(--color-accent-main)",
            boxSizing: "border-box",
            height: THUMB_SIZE,
            left: thumbX,
            overflow: "clip",
            position: "absolute",
            top: 2,
            transition: "background-color 0.25s ease",
            width: THUMB_SIZE,
          }}
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          style={{
            left: thumbX + THUMB_SIZE + 4,
            opacity: hasInteracted ? 0 : 1,
            pointerEvents: "none",
            position: "absolute",
            top: 2,
            transition: "opacity 0.2s ease",
          }}
        >
          <path d="M7.99965 12.6667C7.86723 12.6674 7.73758 12.6288 7.62724 12.5556C7.51689 12.4824 7.43084 12.378 7.38006 12.2557C7.32929 12.1334 7.31608 11.9987 7.34213 11.8689C7.36817 11.7391 7.43229 11.6199 7.52631 11.5267L11.0596 8L7.52631 4.47334C7.41709 4.3458 7.36002 4.18175 7.3665 4.01397C7.37299 3.84618 7.44254 3.68702 7.56127 3.56829C7.68 3.44956 7.83916 3.38001 8.00694 3.37353C8.17473 3.36705 8.33878 3.42412 8.46631 3.53334L12.4663 7.53334C12.5905 7.65824 12.6602 7.82721 12.6602 8.00334C12.6602 8.17946 12.5905 8.34843 12.4663 8.47334L8.46631 12.4733C8.34214 12.5965 8.17454 12.6659 7.99965 12.6667Z" fill="#CACACA"/>
          <path d="M3.99965 12.6667C3.86723 12.6674 3.73758 12.6288 3.62724 12.5556C3.51689 12.4824 3.43084 12.378 3.38006 12.2557C3.32929 12.1334 3.31608 11.9987 3.34213 11.8689C3.36817 11.7391 3.43229 11.6199 3.52631 11.5267L7.05965 8.00001L3.52631 4.47334C3.40078 4.3478 3.33025 4.17754 3.33025 4.00001C3.33025 3.82247 3.40078 3.65221 3.52631 3.52667C3.65185 3.40114 3.82211 3.33061 3.99965 3.33061C4.17718 3.33061 4.34744 3.40114 4.47298 3.52667L8.47298 7.52667C8.59715 7.65158 8.66684 7.82055 8.66684 7.99667C8.66684 8.1728 8.59715 8.34177 8.47298 8.46667L4.47298 12.4667C4.41124 12.5297 4.33761 12.5798 4.25636 12.6141C4.17511 12.6484 4.08785 12.6663 3.99965 12.6667Z" fill="#CACACA"/>
        </svg>
      </div>
    </div>
  );
}
