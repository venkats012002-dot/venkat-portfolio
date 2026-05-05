"use client";

import PlayButton from "./PlayButton";

export type Exploration = {
  id: string;
  name: string;
  year: number;
  media?: { type: "image" | "video"; src: string };
  link?: { href: string; label?: string };
};

export default function ExplorationCard({ name, year, media, link }: Exploration) {
  return (
    <article
      className="exploration-card"
      style={{
        aspectRatio: "1 / 1",
        backgroundColor: "var(--color-neutral-light)",
        border: "1px solid var(--color-neutral-3)",
        boxSizing: "border-box",
        marginBottom: -1,
        marginRight: -1,
        overflow: "clip",
        position: "relative",
      }}
    >
      <div
        className="exploration-card__media"
        style={{
          backgroundColor: media ? "transparent" : "var(--color-neutral-3)",
          backgroundImage:
            media?.type === "image" ? `url(${media.src})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          border: "none",
          boxSizing: "border-box",
          inset: 72,
          outline: "none",
          overflow: "clip",
          position: "absolute",
        }}
      >
        {media?.type === "video" && (
          <video
            src={media.src}
            autoPlay
            muted
            loop
            playsInline
            style={{
              border: "none",
              display: "block",
              height: "100%",
              objectFit: "cover",
              outline: "none",
              width: "100%",
            }}
          />
        )}
      </div>

      {link && (
        <div className="exploration-card__action" style={{ position: "absolute", right: 24, top: 15 }}>
          <PlayButton label={link.label ?? "View Live"} href={link.href} />
        </div>
      )}

      <div
        className="exploration-card__name"
        style={{
          bottom: 14,
          boxSizing: "border-box",
          color: "var(--color-neutral-dark)",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          left: 32,
          lineHeight: "29px",
          position: "absolute",
        }}
      >
        {name}
      </div>

      <div
        className="exploration-card__year"
        style={{
          bottom: 14,
          boxSizing: "border-box",
          color: "var(--color-neutral-7)",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "29px",
          position: "absolute",
          right: 32,
        }}
      >
        {year}
      </div>
    </article>
  );
}
