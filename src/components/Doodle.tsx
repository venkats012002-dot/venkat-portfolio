import type { CSSProperties } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  rotate?: number;
  showOnMobile?: boolean;
  style?: CSSProperties;
};

/**
 * A scribble pinned to a specific anchor element. Anchor element must
 * have `position: relative`. The doodle is rendered as a CSS mask over a
 * solid `var(--color-accent-main)` fill, so it tints with the Control
 * Center accent color (the SVGs themselves are monochrome line art).
 * Hidden on mobile by default.
 */
export default function Doodle({
  src,
  width,
  height,
  alt = "",
  rotate,
  showOnMobile = false,
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
        pointerEvents: "none",
        position: "absolute",
        transition: "background-color 0.25s ease",
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
