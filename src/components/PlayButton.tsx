"use client";

import Link from "next/link";
import { useState } from "react";

export default function PlayButton({ label = "Play", href }: { label?: string; href?: string }) {
  const [hovered, setHovered] = useState(false);

  const sharedStyle = {
    alignItems: "center",
    display: "flex",
    gap: 8,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
  } as const;

  const inner = (
    <>
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          animation: hovered ? "arrowBounce 1.2s linear infinite" : "none",
        }}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M16 6H0V8H16V6Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M14 4H12V6H14V4Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M14 8H12V10H14V8Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2H10V4H12V2Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 10H10V12H12V10Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M10 0H8V2H10V0Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
        <path fillRule="evenodd" clipRule="evenodd" d="M10 12H8V14H10V12Z" fill={hovered ? "#101010" : "#7A7A7A"} style={{ transition: "fill 0.2s ease" }} />
      </svg>
      <div
        style={{
          color: hovered ? "#101010" : "#7A7A7A",
          transition: "color 0.2s ease",
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          lineHeight: "150%",
        }}
      >
        {label}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes arrowBounce {
          0%    { transform: translateX(0); }
          12.5% { transform: translateX(2.83px); }
          25%   { transform: translateX(4px); }
          37.5% { transform: translateX(2.83px); }
          50%   { transform: translateX(0); }
          62.5% { transform: translateX(-2.83px); }
          75%   { transform: translateX(-4px); }
          87.5% { transform: translateX(-2.83px); }
          100%  { transform: translateX(0); }
        }
      `}</style>
      {href ? (
        <Link
          href={href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={sharedStyle}
        >
          {inner}
        </Link>
      ) : (
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={sharedStyle}
        >
          {inner}
        </button>
      )}
    </>
  );
}
