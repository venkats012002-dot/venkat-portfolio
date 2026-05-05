import Link from "next/link";

const wavyStyle: React.CSSProperties = {
  textDecorationLine: "underline",
  textDecorationStyle: "wavy",
  textDecorationThickness: "0.5px",
  textUnderlineOffset: "2px",
};

const mutedStyle: React.CSSProperties = {
  color: "var(--color-neutral-7)",
};

const items: { color: string; content: React.ReactNode }[] = [
  {
    color: "#3654A3",
    content: (
      <>Currently at <span style={wavyStyle}>QuillAudits</span>, designing for Web, Product &amp; Marketing</>
    ),
  },
  {
    color: "#F01D25",
    content: (
      <>Founding brand designer for <span style={wavyStyle}>Bluethroat Labs</span></>
    ),
  },
  {
    color: "#6BBD40",
    content: (
      <>Into Art, Technology, Psychology &amp; Building <span style={mutedStyle}>personal softwares with AI</span></>
    ),
  },
  {
    color: "#F7ED12",
    content: (
      <>Check out my thoughts / rants / quirks on everything - <Link href="/personal-archive" style={{ ...wavyStyle, color: "inherit" }}>Personal Archive</Link></>
    ),
  },
];

export default function HeroStatus() {
  return (
    <div className="hero-status-list" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {items.map(({ color, content }, i) => (
        <div key={i} className="hero-status-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: color,
              width: "8px",
              height: "8px",
              flexShrink: 0,
            }}
          />
          <div
            className="hero-status-row"
            style={{
              color: "var(--color-neutral-12)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: "180%",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
}
