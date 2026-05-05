"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  image: string;
  tags: string[];
  title: string;
  description: string;
};

export default function ProjectCard({ image, tags, title, description }: Props) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setSupportsHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Keep the cursor parked off-screen until first pointer position arrives,
  // so the blur-in doesn't flash at (0,0).
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.left = "-9999px";
      cursorRef.current.style.top = "-9999px";
    }
  }, [mounted]);

  const trackPointer = (e: React.MouseEvent) => {
    const el = cursorRef.current;
    if (el) {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    }
  };

  return (
    <article
      onMouseEnter={supportsHover ? (e) => {
        trackPointer(e);
        setHovered(true);
      } : undefined}
      onMouseLeave={supportsHover ? () => setHovered(false) : undefined}
      onMouseMove={supportsHover ? trackPointer : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignSelf: "stretch",
        gap: "16px",
        cursor: supportsHover && hovered ? "none" : "default",
        opacity: supportsHover && hovered ? 0.8 : 1,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        role="img"
        aria-label={title}
        style={{
          alignSelf: "stretch",
          height: "400px",
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          flexShrink: 0,
          overflow: "clip",
          border: "1px solid #DDDDDD",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", gap: "8px" }}>
        <div className="project-card-tags" style={{ display: "flex", gap: "16px", justifyContent: "flex-start" }}>
          {tags.map((tag, i) => (
            <div
              key={tag}
              style={{
                color: "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                lineHeight: "180%",
              }}
            >
              [{i + 1}] {tag}
            </div>
          ))}
        </div>
        <div
          style={{
            color: "var(--color-neutral-dark)",
            fontFamily: "var(--font-heading)",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "180%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "var(--color-neutral-7)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            lineHeight: "180%",
          }}
        >
          {description}
        </div>
      </div>

      {mounted &&
        createPortal(
          <div
            ref={cursorRef}
            style={{
              position: "fixed",
              pointerEvents: "none",
              zIndex: 100,
              display: "flex",
              gap: 0,
              transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0.4})`,
              opacity: hovered ? 1 : 0,
              filter: hovered ? "blur(0px)" : "blur(6px)",
              transformOrigin: "center",
              transition: hovered
                ? "opacity 0.2s ease, filter 0.25s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "opacity 0.15s ease, filter 0.15s ease, transform 0.15s ease",
            }}
          >
            <div
              style={{
                backgroundColor: "#E8E8E8",
                border: "1px solid #101010",
                padding: "8px 16px",
                color: "#101010",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                lineHeight: "180%",
                whiteSpace: "nowrap",
              }}
            >
              View Project
            </div>
            <div
              style={{
                backgroundColor: "#E8E8E8",
                border: "1px solid #101010",
                padding: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0, display: "block" }}
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M11.314 0L0 11.314L1.414 12.728L12.728 1.414L11.314 0Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.485 0L7.071 1.414L8.485 2.828L9.899 1.414L8.485 0Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.314 2.828L9.899 4.243L11.314 5.657L12.728 4.243L11.314 2.828Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M5.657 0L4.243 1.414L5.657 2.828L7.071 1.414L5.657 0Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.314 5.657L9.899 7.071L11.314 8.485L12.728 7.071L11.314 5.657Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M2.828 0L1.414 1.414L2.828 2.828L4.243 1.414L2.828 0Z" fill="#101010" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.314 8.485L9.899 9.899L11.314 11.314L12.728 9.899L11.314 8.485Z" fill="#101010" />
              </svg>
            </div>
          </div>,
          document.body
        )}
    </article>
  );
}
