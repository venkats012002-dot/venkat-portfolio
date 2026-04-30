"use client";

import { useSoundSettings, setMuted, setLevel } from "@/hooks/useSoundSettings";

const LEVELS = 10;
const DARK = "var(--color-neutral-dark)";
const ACTIVE_BG = "var(--color-neutral-light)";
const INACTIVE_BG = "var(--color-neutral-1)";

function UnmutedIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M18.088 5.977V3.577H20.488V5.977H18.088Z" fill={color} />
      <path d="M18.088 13.177V10.777H20.488V13.177H18.088Z" fill={color} />
      <path d="M18.088 20.377V17.977H20.488V20.377H18.088Z" fill={color} />
      <path d="M6.087 5.977H8.487V8.377H6.087V5.977Z" fill={color} />
      <path d="M13.287 8.377V1.177H10.887V3.577H8.487V5.977H10.887V17.977H8.487V20.377H10.887V22.777H13.287V15.577H15.687V8.377H13.287Z" fill={color} />
      <path d="M3.687 13.177V10.777H6.087V8.377H1.287V15.577H3.687H6.087V13.177H3.687Z" fill={color} />
      <path d="M6.087 15.577H8.487V17.977H6.087V15.577Z" fill={color} />
    </svg>
  );
}

function MutedIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M3.715 3.577H6.115V5.977H3.715V3.577Z" fill={color} />
      <path d="M1.315 1.177H3.715V3.577H1.315V1.177Z" fill={color} />
      <path d="M10.902 5.977H6.115V8.377H8.515V10.777H10.915V5.977H10.902Z" fill={color} />
      <path d="M18.115 17.977H20.515V20.377H18.115V17.977Z" fill={color} />
      <path d="M20.515 20.377H22.915V22.777H20.515V20.377Z" fill={color} />
      <path d="M15.702 1.177H13.302V3.577H10.902V5.977H13.302V17.977H10.902V20.377H13.302V22.777H15.702V15.577H18.102V8.377H15.702V1.177Z" fill={color} />
      <path d="M6.102 13.177V8.377H3.702V15.577H8.502V13.177H6.102Z" fill={color} />
      <path d="M8.502 15.577H10.902V17.977H8.502V15.577Z" fill={color} />
    </svg>
  );
}

function LevelBar({
  filled,
  disabled,
  onClick,
  ariaLabel,
}: {
  filled: boolean;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        backgroundColor: filled ? "var(--color-neutral-4)" : "transparent",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        height: 48,
        outline: filled ? `1px solid ${DARK}` : "1px solid var(--color-neutral-7)",
        padding: 0,
        width: 16,
      }}
    />
  );
}

export default function SoundSettings() {
  const { muted, level } = useSoundSettings();

  return (
    <div
      style={{
        alignItems: "stretch",
        boxSizing: "border-box",
        display: "flex",
        fontSynthesis: "none",
        MozOsxFontSmoothing: "grayscale",
        outline: `1px solid ${DARK}`,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        style={{
          borderRight: `1px solid ${DARK}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          type="button"
          onClick={() => setMuted(false)}
          aria-pressed={!muted}
          style={{
            alignItems: "center",
            backgroundColor: !muted ? ACTIVE_BG : INACTIVE_BG,
            border: "none",
            borderBottom: `1px solid ${DARK}`,
            borderRadius: 0,
            boxSizing: "border-box",
            cursor: "pointer",
            display: "flex",
            gap: 17,
            overflow: "clip",
            padding: "18px 17px",
          }}
        >
          <UnmutedIcon color={!muted ? "#333333" : "#CACACA"} />
        </button>
        <button
          type="button"
          onClick={() => setMuted(true)}
          aria-pressed={muted}
          style={{
            alignItems: "center",
            backgroundColor: muted ? ACTIVE_BG : INACTIVE_BG,
            border: "none",
            borderRadius: 0,
            boxSizing: "border-box",
            cursor: "pointer",
            display: "flex",
            gap: 17,
            overflow: "clip",
            padding: "18px 17px 17px 17px",
          }}
        >
          <MutedIcon color={muted ? "#333333" : "#CACACA"} />
        </button>
      </div>

      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: 120,
          justifyContent: "center",
          opacity: muted ? 0.4 : 1,
          overflow: "clip",
          paddingBlock: 16,
          paddingInline: 27,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            alignItems: "start",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              color: DARK,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: "18px",
              width: "fit-content",
            }}
          >
            Haptic Sound Adjuster
          </div>
          <div
            role="slider"
            aria-valuemin={1}
            aria-valuemax={LEVELS}
            aria-valuenow={level}
            aria-disabled={muted}
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              display: "flex",
              gap: 12,
            }}
          >
            {Array.from({ length: LEVELS }, (_, i) => {
              const value = i + 1;
              return (
                <LevelBar
                  key={value}
                  filled={value <= level}
                  disabled={muted}
                  onClick={() => setLevel(value)}
                  ariaLabel={`Level ${value}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
