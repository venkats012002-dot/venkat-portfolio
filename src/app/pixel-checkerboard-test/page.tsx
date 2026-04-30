import PixelCheckerboard from "@/components/PixelCheckerboard";

export default function PixelCheckerboardTestPage() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--color-neutral-light)",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <PixelCheckerboard />
    </div>
  );
}
