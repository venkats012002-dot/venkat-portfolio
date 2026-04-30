"use client";

import { useState } from "react";

const FRAME_W = 169;
const FRAME_H = 191;
const PHOTO_X = 14.9385;
const PHOTO_Y = 17.0941;
const PHOTO_W = 139.153;
const PHOTO_H = 156.609;

export default function PhotoFrame({
  src,
  alt = "",
}: {
  src?: string;
  alt?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxSizing: "border-box",
        flexShrink: 0,
        height: FRAME_H,
        position: "relative",
        transform: hovered ? "scale(1.2) rotate(5deg)" : "scale(1) rotate(0deg)",
        transformOrigin: "center center",
        transition: "transform 0.6s var(--ease-out)",
        width: FRAME_W,
        willChange: "transform",
        zIndex: hovered ? 1 : 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/svgs/photo-frame.svg"
        alt=""
        aria-hidden
        style={{
          display: "block",
          height: FRAME_H,
          pointerEvents: "none",
          width: FRAME_W,
        }}
      />
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            height: PHOTO_H,
            left: PHOTO_X,
            objectFit: "cover",
            position: "absolute",
            top: PHOTO_Y,
            width: PHOTO_W,
          }}
        />
      )}
    </div>
  );
}
