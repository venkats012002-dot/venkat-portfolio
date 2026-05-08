import type { CSSProperties } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  rotate?: number;
  showOnMobile?: boolean;
  revealed?: boolean;
  style?: CSSProperties;
};

/**
 * A scribble pinned to a specific anchor element. Anchor element must
 * have `position: relative`. The doodle is rendered as a CSS mask over a
 * solid `var(--color-accent-main)` fill, so it tints with the Control
 * Center accent color (the SVGs themselves are monochrome line art).
 * Hidden on mobile by default. `revealed` (default true) controls opacity
 * with a transition so doodles can fade in based on external state.
 */
export default function Doodle({
  src,
  width,
  height,
  alt = "",
  rotate,
  showOnMobile = false,
  revealed = true,
  style,
}: Props) {
  const maskUrl = `url(${src})`;
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={showOnMobile ? "doodle" : "doodle doodle-desktop-only"}
      style={{
        backgroundColor: "var(--color-accent-main)",
        height,
        maskImage: maskUrl,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",
        opacity: revealed ? 1 : 0,
        pointerEvents: "none",
        position: "absolute",
        transition: "background-color 0.25s ease, opacity 0.4s ease",
        userSelect: "none",
        WebkitMaskImage: maskUrl,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        WebkitUserSelect: "none",
        width,
        zIndex: 1,
        ...(rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : null),
        ...style,
      }}
    />
  );
}
