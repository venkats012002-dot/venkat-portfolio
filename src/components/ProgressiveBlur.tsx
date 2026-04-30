type Props = {
  position: "top" | "bottom";
  height?: string;
  blur?: number;
};

export default function ProgressiveBlur({
  position,
  height = "24px",
  blur = 12,
}: Props) {
  const direction = position === "top" ? "to bottom" : "to top";
  const gradient = `linear-gradient(${direction}, rgba(0,0,0,1), rgba(0,0,0,0))`;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        [position]: 0,
        height,
        pointerEvents: "none",
        zIndex: 15,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        maskImage: gradient,
        WebkitMaskImage: gradient,
      }}
    />
  );
}
