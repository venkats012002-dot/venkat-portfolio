"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "./Footer";
import PlayButton from "./PlayButton";
import Separator from "./Separator";
import CaseStudySidebar, { type SidebarItem } from "./CaseStudySidebar";
import MediaLightbox, { type LightboxMedia } from "./MediaLightbox";
import type { WorkBlock, WorkDetail, WorkSummary } from "@/lib/notion";

const CAROUSEL_EMOJI = "🎠";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
}

function isCarouselCallout(b: WorkBlock): boolean {
  return b.type === "callout" && b.emoji === CAROUSEL_EMOJI;
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
    const isHeader =
      b.type === "heading_1" || (b.type === "callout" && !isCarouselCallout(b));
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
          alignItems: "center",
          paddingBlock: "96px 48px",
          paddingInline: 24,
          flex: 1,
          fontSynthesis: "none",
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 48,
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
                {renderBlocks(section.body, openMedia)}
              </section>
            ) : (
              <SectionWrapper key={section.id} id={section.id} title={section.title}>
                {renderBlocks(section.body, openMedia)}
              </SectionWrapper>
            ),
          )}

          {others.length > 0 && <NextProjects items={others} />}
        </div>
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

// Walks the section body and injects an 8px spacer between a paragraph and a
// following image/video so media has a visual breath after text.
function renderBlocks(blocks: WorkBlock[], onOpenMedia: OpenMedia) {
  return blocks.map((b, i) => {
    const prev = i > 0 ? blocks[i - 1] : undefined;
    const needsSpacer =
      prev?.type === "paragraph" && (b.type === "image" || b.type === "video");
    return (
      <Fragment key={i}>
        {needsSpacer && <div style={{ height: 8 }} />}
        <BlockRender block={b} onOpenMedia={onOpenMedia} />
      </Fragment>
    );
  });
}

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
      if (block.emoji === CAROUSEL_EMOJI) {
        return <Carousel items={block.children} onOpenMedia={onOpenMedia} />;
      }
      return <>{renderBlocks(block.children, onOpenMedia)}</>;
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
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            color: "var(--color-neutral-7)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "180%",
          }}
        >
          If you like this, you&rsquo;ll also like:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((item) => (
            <NextProjectLink key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NextProjectLink({ item }: { item: WorkSummary }) {
  return (
    <div style={{ paddingLeft: 8 }}>
      <PlayButton label={item.title} href={`/work/${item.slug}`} />
    </div>
  );
}

type CarouselSlide = Extract<WorkBlock, { type: "image" } | { type: "video" }>;

function Carousel({
  items,
  onOpenMedia,
}: {
  items: WorkBlock[];
  onOpenMedia: OpenMedia;
}) {
  const slides = useMemo(
    () => items.filter((b): b is CarouselSlide => b.type === "image" || b.type === "video"),
    [items],
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx > slides.length - 1) setIdx(0);
  }, [slides.length, idx]);

  if (slides.length === 0) return null;
  const current = slides[idx]!;
  const canPrev = idx > 0;
  const canNext = idx < slides.length - 1;

  return (
    <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
        <CarouselArrow
          side="left"
          active={canPrev}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        />
        <div
          onClick={() => onOpenMedia(current.src, current.type)}
          style={{
            aspectRatio: "16 / 9",
            backgroundColor: "var(--color-neutral-3)",
            cursor: "pointer",
            flex: 1,
            overflow: "clip",
            position: "relative",
          }}
        >
          {current.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.src}
              src={current.src}
              alt={current.caption || ""}
              loading="lazy"
              style={{
                display: "block",
                height: "100%",
                objectFit: "cover",
                width: "100%",
              }}
            />
          ) : (
            <video
              key={current.src}
              src={current.src}
              autoPlay
              loop
              muted
              playsInline
              style={{
                display: "block",
                height: "100%",
                objectFit: "cover",
                width: "100%",
              }}
            />
          )}
        </div>
        <CarouselArrow
          side="right"
          active={canNext}
          onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
        />
      </div>
      {slides.length > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx}
              onClick={() => setIdx(i)}
              style={{
                background:
                  i === idx ? "var(--color-neutral-dark)" : "var(--color-neutral-4)",
                border: "none",
                cursor: "pointer",
                height: 8,
                padding: 0,
                transition: "background-color 0.2s ease",
                width: 8,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({
  side,
  active,
  onClick,
}: {
  side: "left" | "right";
  active: boolean;
  onClick: () => void;
}) {
  const src = side === "left" ? "/icons/sides-left.svg" : "/icons/sides-right.svg";
  return (
    <button
      type="button"
      onClick={active ? onClick : undefined}
      disabled={!active}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      style={{
        background: "none",
        border: "none",
        cursor: active ? "pointer" : "default",
        flexShrink: 0,
        opacity: active ? 1 : 0.4,
        padding: 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={12}
        height={24}
        style={{ display: "block", imageRendering: "pixelated" }}
      />
    </button>
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
