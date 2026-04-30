"use client";

import { useRef, useState } from "react";
import { GemSmoke } from "@paper-design/shaders-react";

const textStyle: React.CSSProperties = {
  color: "var(--color-neutral-dark)",
  fontFamily: "var(--font-heading)",
  fontSize: "40px",
  fontWeight: 500,
  lineHeight: "150%",
  textAlign: "center",
};

const DISCIPLINES: { label: string; left: number; top: number }[] = [
  { label: "Creative Coding", left: -56, top: -41 },
  { label: "Systems Thinking", left: 209, top: -41 },
  { label: "Motion", left: -39, top: 62 },
  { label: "Visual Design", left: 142, top: 70 },
];

export default function HeroHeading() {
  const [showShader, setShowShader] = useState(false);
  const [disciplineHover, setDisciplineHover] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDisciplineHover(true);
  };

  const handleLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setDisciplineHover(false);
    }, 150);
  };

  const siblingStyle: React.CSSProperties = {
    opacity: disciplineHover ? 0.3 : 1,
    transition: "opacity 0.3s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ ...textStyle, ...siblingStyle }}>Hi! I&rsquo;m</div>

        <div
          onClick={() => setShowShader((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowShader((v) => !v);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={showShader ? "Show name" : "Show shader"}
          aria-pressed={showShader}
          style={{
            position: "relative",
            height: 60,
            cursor: "pointer",
            outline: "none",
            display: showShader ? "flex" : "block",
            alignItems: "center",
            justifyContent: "center",
            overflow: showShader ? "clip" : "visible",
            width: showShader ? 167 : 136,
            ...siblingStyle,
          }}
        >
          {showShader ? (
            <GemSmoke
              speed={0.74}
              size={0.87}
              outerDistortion={0.7}
              innerDistortion={0.76}
              outerGlow={0.36}
              innerGlow={1}
              offset={-0.63}
              scale={0.75}
              angle={0}
              shape="diamond"
              image="/shaders/venkat-name.svg"
              colorInner="#FFFFFF"
              frame={83081.13200006193}
              colors={["#621616", "#F90000", "#FFFFFF"]}
              colorBack="#00000000"
              style={{ flexShrink: 0, width: "167px", height: "97px", display: "block" }}
            />
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  left: -5,
                  top: 0,
                  width: "136px",
                  height: "60px",
                  backgroundColor: "var(--color-accent-light)",
                  transition: "background-color 0.25s ease",
                }}
              />
              <div
                style={{
                  ...textStyle,
                  color: "var(--color-accent-main)",
                  position: "relative",
                  width: "126px",
                  transition: "color 0.25s ease",
                }}
              >
                Venkat
              </div>
            </>
          )}
        </div>

        <div style={{ ...textStyle, ...siblingStyle }}>, an</div>

        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{
            ...textStyle,
            position: "relative",
            zIndex: 10,
            color: disciplineHover ? "var(--color-neutral-dark)" : "var(--color-neutral-7)",
            textDecorationLine: "underline",
            textDecorationStyle: "wavy",
            textDecorationThickness: "2px",
            textUnderlineOffset: "12px",
            textDecorationColor: disciplineHover ? "var(--color-neutral-dark)" : "var(--color-neutral-7)",
            transition: "color 0.25s ease, text-decoration-color 0.25s ease",
          }}
        >
          inter-disciplinary
          {DISCIPLINES.map(({ label, left, top }) => (
            <DisciplineTag
              key={label}
              label={label}
              left={left}
              top={top}
              visible={disciplineHover}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>
      </div>

      <div style={{ ...textStyle, ...siblingStyle, width: "fit-content" }}>
        designer, artist and tinkerer.
      </div>
    </div>
  );
}

function DisciplineTag({
  label,
  left,
  top,
  visible,
  onEnter,
  onLeave,
}: {
  label: string;
  left: number;
  top: number;
  visible: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        left,
        top,
        backgroundColor: "#E8E8E8",
        border: "1px solid #101010",
        padding: "8px 16px",
        color: "var(--color-neutral-dark)",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        lineHeight: "180%",
        whiteSpace: "nowrap",
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(6px)",
        transform: visible ? "scale(1)" : "scale(0.4)",
        transformOrigin: "center",
        pointerEvents: visible ? "auto" : "none",
        transition: visible
          ? "opacity 0.2s ease, filter 0.25s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "opacity 0.15s ease, filter 0.15s ease, transform 0.15s ease",
      }}
    >
      {label}
    </div>
  );
}
