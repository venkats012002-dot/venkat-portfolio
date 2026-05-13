"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "./Footer";
import Separator from "./Separator";
import CaseStudySidebar, { type SidebarItem } from "./CaseStudySidebar";
import MediaLightbox, { type LightboxMedia } from "./MediaLightbox";
import type { WorkBlock, WorkDetail, WorkSummary } from "@/lib/notion";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
}

type Section = {
  id: string;
  title: string;
  body: WorkBlock[];
  // 'heading' renders a visible SectionWrapper (12px square + title + separator).
  // 'callout' renders an invisible scroll anchor only — the title appears in the sidebar.
  source: "heading" | "callout";
};

function groupSections(blocks: WorkBlock[]): { intro: WorkBlock[]; sections: Section[] } {
  const intro: WorkBlock[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const b of blocks) {
    const isHeader = b.type === "heading_1" || b.type === "callout";
    if (isHeader) {
      const title = b.type === "callout" ? b.text : b.text;
      current = {
        id: slugify(title),
        title,
        body: [],
        source: b.type === "callout" ? "callout" : "heading",
      };
      sections.push(current);
      if (b.type === "callout" && b.children.length) {
        current.body.push(...b.children);
      }
    } else if (current) {
      current.body.push(b);
    } else {
      intro.push(b);
    }
  }
  return { intro, sections };
}

export default function CaseStudyContent({
  data,
  others,
}: {
  data: WorkDetail;
  others: WorkSummary[];
}) {
  const { intro, sections } = useMemo(() => groupSections(data.body), [data.body]);
  const sidebarItems: SidebarItem[] = sections.map((s) => ({ id: s.id, label: s.title }));
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null);
  const openMedia = useCallback(
    (src: string, type: "image" | "video") => setLightbox({ src, type }),
    [],
  );
  const closeMedia = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (sections.length === 0) return;
    const offset = 120;
    const handle = () => {
      let next = sections[0]!.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) next = s.id;
      }
      setActiveId(next);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [sections]);

  return (
    <div
      style={{
        backgroundColor: "var(--color-neutral-light)",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <CaseStudySidebar items={sidebarItems} activeId={activeId} />

      <main
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 48,
          paddingBlock: "96px 48px",
          paddingInline: "360px",
          flex: 1,
          fontSynthesis: "none",
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Hero data={data} />

        {intro.map((b, i) => (
          <BlockRender key={`intro-${i}`} block={b} onOpenMedia={openMedia} />
        ))}

        {sections.map((section) =>
          section.source === "callout" ? (
            <section
              key={section.id}
              id={section.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                scrollMarginTop: 120,
              }}
            >
              {section.body.map((b, i) => (
                <BlockRender key={i} block={b} onOpenMedia={openMedia} />
              ))}
            </section>
          ) : (
            <SectionWrapper key={section.id} id={section.id} title={section.title}>
              {section.body.map((b, i) => (
                <BlockRender key={i} block={b} onOpenMedia={openMedia} />
              ))}
            </SectionWrapper>
          ),
        )}

        {others.length > 0 && <NextProjects items={others} />}
      </main>

      <Footer />
      <MediaLightbox media={lightbox} onClose={closeMedia} />
    </div>
  );
}

function Hero({ data }: { data: WorkDetail }) {
  const tags = data.tags;
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 32, scrollMarginTop: 120 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h1
          style={{
            color: "var(--color-neutral-dark)",
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            fontWeight: 500,
            lineHeight: "180%",
            margin: 0,
          }}
        >
          {data.title}
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(data.role || data.timeline) && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {data.role && <span style={metaStyle}>Role: {data.role}</span>}
              {data.timeline && <span style={metaStyle}>Timeline: {data.timeline}</span>}
            </div>
          )}
          {(data.stats || data.team) && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {data.stats && <span style={metaStyle}>Stats: {data.stats}</span>}
              {data.team && <span style={metaStyle}>Team: {data.team}</span>}
            </div>
          )}
        </div>
      </div>

      {data.cover && (
        <div
          role="img"
          aria-label={data.title}
          style={{
            alignSelf: "stretch",
            width: "100%",
            aspectRatio: "1440 / 800",
            backgroundImage: `url(${data.cover})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            flexShrink: 0,
            overflow: "clip",
          }}
        />
      )}

      {tags.length > 0 && (
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-start", flexWrap: "wrap" }}>
          {tags.map((t, i) => (
            <span key={t} style={metaStyle}>
              [{i + 1}] {t}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

const metaStyle = {
  color: "var(--color-neutral-7)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  lineHeight: "180%",
} as const;

function SectionWrapper({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{ display: "flex", flexDirection: "column", gap: 16, scrollMarginTop: 120 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 8 }}>
          <div
            style={{
              backgroundColor: "var(--color-neutral-dark)",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "180%",
            }}
          >
            {title}
          </div>
        </div>
        <Separator variant="primary" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
        {children}
      </div>
    </section>
  );
}

type OpenMedia = (src: string, type: "image" | "video") => void;

function BlockRender({ block, onOpenMedia }: { block: WorkBlock; onOpenMedia: OpenMedia }) {
  switch (block.type) {
    case "heading_2":
      return <SubHeading size={20}>{block.text}</SubHeading>;
    case "heading_3":
      return <SubHeading size={16}>{block.text}</SubHeading>;
    case "heading_4":
      return <SubHeading size={14}>{block.text}</SubHeading>;
    case "paragraph":
      return <Body>{block.text}</Body>;
    case "image":
      return <ImageBlock src={block.src} caption={block.caption} onOpen={onOpenMedia} />;
    case "video":
      return <VideoBlock src={block.src} onOpen={onOpenMedia} />;
    case "divider":
      return (
        <div style={{ paddingBlock: 16 }}>
          <Separator variant="primary" />
        </div>
      );
    case "quote":
      return <QuoteBlock>{block.text}</QuoteBlock>;
    case "bullet":
      return <Body>• {block.text}</Body>;
    case "number":
      return <Body>{block.text}</Body>;
    case "spacer":
      return <div style={{ height: 8 }} />;
    case "callout":
      return (
        <>
          {block.children.map((b, i) => (
            <BlockRender key={i} block={b} onOpenMedia={onOpenMedia} />
          ))}
        </>
      );
    case "heading_1":
      return <SubHeading size={18}>{block.text}</SubHeading>;
    default:
      return null;
  }
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "var(--color-neutral-7)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        lineHeight: "180%",
      }}
    >
      {children}
    </div>
  );
}

function SubHeading({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "var(--color-neutral-dark)",
        fontFamily: "var(--font-heading)",
        fontSize: size,
        fontWeight: 500,
        lineHeight: "180%",
      }}
    >
      {children}
    </div>
  );
}

function ImageBlock({
  src,
  caption,
  onOpen,
}: {
  src: string;
  caption: string;
  onOpen: OpenMedia;
}) {
  return (
    <figure style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption || ""}
        onClick={() => onOpen(src, "image")}
        style={{ width: "100%", height: "auto", display: "block", cursor: "pointer" }}
        loading="lazy"
      />
      {caption && (
        <figcaption
          style={{
            color: "var(--color-neutral-7)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            lineHeight: "180%",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ src, onOpen }: { src: string; onOpen: OpenMedia }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      onClick={() => onOpen(src, "video")}
      style={{ width: "100%", height: "auto", display: "block", cursor: "pointer" }}
    />
  );
}

function NextProjects({ items }: { items: WorkSummary[] }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <Separator variant="primary" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => (
          <NextProjectLink key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function NextProjectLink({ item }: { item: WorkSummary }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/work/${item.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingLeft: 8,
        color: hovered ? "var(--color-neutral-dark)" : "var(--color-neutral-7)",
        fontFamily: "var(--font-body)",
        fontSize: 16,
        lineHeight: "150%",
        textDecoration: "none",
        transition: "color 0.18s ease",
        width: "fit-content",
      }}
    >
      <ArrowIcon />
      {item.title}
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M16 6H0V8H16V6Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 4H12V6H14V4Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 8H12V10H14V8Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2H10V4H12V2Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 10H10V12H12V10Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10 0H8V2H10V0Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10 12H8V14H10V12Z" fill="currentColor" />
    </svg>
  );
}

function QuoteBlock({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        margin: 0,
        paddingLeft: 16,
        borderLeft: "2px solid var(--color-neutral-4)",
        color: "var(--color-neutral-dark)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        lineHeight: "180%",
      }}
    >
      {children}
    </blockquote>
  );
}
