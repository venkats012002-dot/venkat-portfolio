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
 * have `position: relative`. Doodle renders absolute on top, ignores
 * pointer events, and is hidden on mobile by default (the /about
 * mobile layout has different proportions; turn back on per-doodle
 * once those placements are designed).
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
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden
      width={width}
      height={height}
      className={showOnMobile ? "doodle" : "doodle doodle-desktop-only"}
      style={{
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: 1,
        ...(rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : null),
        ...style,
      }}
    />
  );
}
