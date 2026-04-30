import PlayButton from "./PlayButton";

export default function Whit3fangCard() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        fontSynthesis: "none",
        height: 123,
        MozOsxFontSmoothing: "grayscale",
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        width: 150,
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          justifyContent: "center",
          left: 46,
          position: "absolute",
          top: 15,
        }}
      >
        <PlayButton label="Play" href="/whit3fang" />
        <div
          aria-hidden
          style={{
            backgroundImage: "url(/images/whit3fang-sidebar.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            boxSizing: "border-box",
            flexShrink: 0,
            height: 62,
            width: 48,
          }}
        />
      </div>
    </div>
  );
}
