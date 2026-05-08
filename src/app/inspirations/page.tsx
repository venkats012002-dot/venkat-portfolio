import Link from "next/link";
import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import HiddenFooter from "@/components/HiddenFooter";
import PixelBlobField from "@/components/PixelBlobField";

type Inspiration = { name: string; label: string; href?: string };

const INSPIRATIONS: Inspiration[] = [
  { name: "Ryo Lu", label: "Portfolio" },
  { name: "Marijana Pavlinić", label: "Portfolio" },
  { name: "Rachel Chen", label: "Portfolio" },
];

export default function InspirationsPage() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MobileNavWithSidebar />

      <main
        style={{
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          paddingTop: 96,
          paddingBottom: 48,
          paddingInline: "max(24px, calc((100vw - 720px) / 2))",
        }}
      >
        <div
          style={{
            alignItems: "center",
            alignSelf: "stretch",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Link
            href="/"
            aria-label="Back to home"
            style={{ display: "inline-flex", lineHeight: 0 }}
          >
            <PlayArrowIcon />
          </Link>
        </div>

        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            paddingBlock: 48,
          }}
        >
          <PixelBlobField />

          <p
            style={{
              boxSizing: "border-box",
              color: "#000000",
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 500,
              lineHeight: "180%",
              margin: 0,
            }}
          >
            Featuring the best of the best - they not just served as inspirations but as guiding factors.
          </p>

          <DashedSeparator />

          <div
            style={{
              alignItems: "start",
              alignSelf: "stretch",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {INSPIRATIONS.map((item, i) => (
              <InspirationRow
                key={i}
                name={item.name}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <HiddenFooter />
    </div>
  );
}

function InspirationRow({ name, label, href }: Inspiration) {
  const NameTag = href ? "a" : "span";
  return (
    <div
      style={{
        alignItems: "start",
        alignSelf: "stretch",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingBlock: 8,
      }}
    >
      <div
        style={{
          alignItems: "start",
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <NameTag
          {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
          className="inspiration-name"
          style={{
            boxSizing: "border-box",
            color: "#101010",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "180%",
            textDecoration: "none",
          }}
        >
          {name}
        </NameTag>
        <span
          style={{
            boxSizing: "border-box",
            color: "#7A7A7A",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "180%",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ height: 0, alignSelf: "stretch", borderTop: "1px dashed #CACACA" }} />
    </div>
  );
}

function DashedSeparator() {
  return (
    <svg
      width="100%"
      height="4"
      viewBox="0 0 698 4"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ alignSelf: "stretch", flexShrink: 0 }}
    >
      <line y1="2" x2="698" y2="2" stroke="#CACACA" strokeWidth="4" strokeDasharray="4 8" />
    </svg>
  );
}

function PlayArrowIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 7.983H16V10.643H0V7.983Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M2 5.322H4V7.983H2V5.322Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M2 10.643H4V13.304H2V10.643Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4 2.661H6V5.322H4V2.661Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4 13.304H6V15.965H4V13.304Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0H8V2.661H6V0Z" fill="#000000" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 15.965H8V18.626H6V15.965Z" fill="#000000" />
    </svg>
  );
}
