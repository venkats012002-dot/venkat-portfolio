import HeroHeading from "./HeroHeading";
import HeroStatus from "./HeroStatus";
import HeroContact from "./HeroContact";

export default function Hero() {
  return (
    <section
      data-section-index={0}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        minHeight: "calc(100dvh - 96px)",
        paddingTop: "96px",
      }}
    >
      <HeroHeading />
      <div style={{ height: "48px" }} />
      <HeroStatus />
      <div style={{ height: "72px" }} />
      <HeroContact />
    </section>
  );
}
