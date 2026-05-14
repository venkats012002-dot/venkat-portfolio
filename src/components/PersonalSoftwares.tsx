import Separator from "./Separator";

type Tool = {
  icon: string;
  label: string;
  href: string;
};

const ROWS: Tool[][] = [
  [
    {
      icon: "/images/personal-softwares/icon-report-webgl.png",
      label: "Vuln. Report Generator",
      href: "https://bluethroat-report-builder-newwww.vercel.app/",
    },
    {
      icon: "/images/personal-softwares/icon-report-webgl.png",
      label: "WebGL Image generator",
      href: "https://bluethroat-style-gen.vercel.app/",
    },
    {
      icon: "/images/personal-softwares/icon-slideshow-pcb.png",
      label: "Image to Slideshow",
      href: "https://slideshow-video-tool.vercel.app/",
    },
  ],
  [
    {
      icon: "/images/personal-softwares/icon-monked.png",
      label: "Get Monké-d",
      href: "https://get-monked.vercel.app/",
    },
    {
      icon: "/images/personal-softwares/icon-gaussian.png",
      label: "3D Guassain Image Splatter",
      href: "https://github.com/venkats012002-dot/3d-gaussian-image-splatter-using-sharp-model",
    },
    {
      icon: "/images/personal-softwares/icon-slideshow-pcb.png",
      label: "PCB Stylizer",
      href: "https://pcb-stylizer.vercel.app/",
    },
  ],
];

export default function PersonalSoftwares() {
  return (
    <section
      id="personal-softwares"
      style={{
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "96px",
        maxWidth: "100%",
        scrollMarginTop: 96,
        width: "720px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
          <div
            style={{
              backgroundColor: "var(--color-neutral-dark)",
              flexShrink: 0,
              height: "12px",
              width: "12px",
            }}
          />
          <div
            style={{
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "180%",
            }}
          >
            Personal Softwares
          </div>
        </div>
        <Separator variant="primary" />
      </div>

      <div
        style={{
          alignItems: "stretch",
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              alignItems: "center",
              alignSelf: "stretch",
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              paddingBlock: 16,
              paddingInline: 16,
            }}
          >
            {row.map((tool) => (
              <a
                key={tool.label}
                className="psoftw-item"
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignItems: "center",
                  boxSizing: "border-box",
                  color: "#101010",
                  display: "flex",
                  gap: 16,
                  paddingRight: 8,
                  textDecoration: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.icon}
                  alt=""
                  aria-hidden
                  width={32}
                  height={32}
                  style={{
                    display: "block",
                    flexShrink: 0,
                    height: 32,
                    objectFit: "cover",
                    width: 32,
                  }}
                />
                <span
                  style={{
                    color: "#101010",
                    fontFamily: "var(--font-heading)",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "180%",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tool.label}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
