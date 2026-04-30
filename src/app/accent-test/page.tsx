import ColorSwatcher from "@/components/ColorSwatcher";
import AccentBridge from "@/components/AccentBridge";
import AccentShortcuts from "@/components/AccentShortcuts";

export default function AccentTestPage() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--color-neutral-light)",
        display: "flex",
        flexDirection: "column",
        gap: 48,
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            position: "absolute",
            left: -5,
            top: 0,
            width: 136,
            height: 60,
            backgroundColor: "var(--color-accent-light)",
            transition: "background-color 0.25s ease",
          }}
        />
        <div
          style={{
            color: "var(--color-accent-main)",
            fontFamily: "var(--font-heading)",
            fontSize: 40,
            fontWeight: 500,
            lineHeight: "150%",
            position: "relative",
            textAlign: "center",
            width: 126,
            transition: "color 0.25s ease",
          }}
        >
          Venkat
        </div>
      </div>

      <ColorSwatcher />
      <AccentBridge />
      <AccentShortcuts />
    </div>
  );
}
