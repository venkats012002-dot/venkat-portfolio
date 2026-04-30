"use client";

export default function Scribbles({ progress }: { progress: number }) {
  return (
    <div
      aria-hidden
      style={{
        backgroundColor: "var(--color-accent-main)",
        bottom: 0,
        left: 0,
        maskImage: "url('/about/scribbles.png')",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",
        opacity: progress,
        pointerEvents: "none",
        position: "absolute",
        right: 0,
        top: 72,
        WebkitMaskImage: "url('/about/scribbles.png')",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        zIndex: 2,
      }}
    />
  );
}
