"use client";

import {
  useAccentColor,
  setAccentColor,
  ACCENT_COLORS,
  type AccentColor,
} from "@/hooks/useAccentColor";

const CHECKMARK_COLOR: Record<AccentColor, string> = {
  red: "#FFFFFF",
  orange: "#FFFFFF",
  yellow: "#101010",
  green: "#FFFFFF",
  blue: "#FFFFFF",
  neutral: "#101010",
};

function Checkmark({ color }: { color: string }) {
  return (
    <svg
      width="9"
      height="7"
      viewBox="0 0 9 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ left: 4, top: 5, position: "absolute" }}
    >
      <path d="M0 2.25H2.25V4.5H0V2.25Z" fill={color} />
      <path d="M2.25 4.5H4.5V6.75H2.25V4.5Z" fill={color} />
      <path d="M4.5 2.25H6.75V4.5H4.5V2.25Z" fill={color} />
      <path d="M6.75 0H9V2.25H6.75V0Z" fill={color} />
    </svg>
  );
}

function NeutralDiagonal() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ left: 0, top: 0, width: 16, height: "auto", position: "absolute" }}
    >
      <path d="M17 0L0 17H17V0Z" fill="#FFFFFF" />
    </svg>
  );
}

function Swatch({
  color,
  selected,
  onClick,
}: {
  color: AccentColor;
  selected: boolean;
  onClick: () => void;
}) {
  const isNeutral = color === "neutral";
  const bg = ACCENT_COLORS[color].main;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={color}
      style={{
        backgroundColor: bg,
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        flexShrink: 0,
        height: 16,
        outline: isNeutral ? "1px solid #000000" : "none",
        overflow: "clip",
        padding: 0,
        position: "relative",
        width: 16,
      }}
    >
      {isNeutral && <NeutralDiagonal />}
      {selected && <Checkmark color={CHECKMARK_COLOR[color]} />}
    </button>
  );
}

export default function ColorSwatcher() {
  const accent = useAccentColor();

  const rows: AccentColor[][] = [
    ["red", "orange", "yellow"],
    ["green", "blue", "neutral"],
  ];

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: 78,
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        position: "relative",
        width: 140,
      }}
    >
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          left: 34,
          position: "absolute",
          top: 17,
        }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              display: "flex",
              gap: 12,
            }}
          >
            {row.map((c) => (
              <Swatch
                key={c}
                color={c}
                selected={accent === c}
                onClick={() => setAccentColor(c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
