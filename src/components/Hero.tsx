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
        minHeight: "calc(100dvh - var(--hero-padding-top))",
        paddingTop: "var(--hero-padding-top)",
        paddingInline: "max(16px, var(--nav-padding-x))",
      }}
    >
      <HeroHeading />
      <div style={{ height: "var(--hero-gap-1)" }} />
      <HeroStatus />
      <div style={{ height: "var(--hero-gap-2)" }} />
      <HeroContact />
    </section>
  );
}
