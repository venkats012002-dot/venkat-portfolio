"use client";

import { useState } from "react";
import PlayButton from "./PlayButton";
import Separator from "./Separator";

const BASE_ITEMS: { color: string; title: string; date: string }[] = [
  {
    color: "#F01D25",
    title: "Building a custom image tool for the Bluethroat Labs Team",
    date: "Apr 20, 2026",
  },
  {
    color: "#F7941C",
    title: "Building a pdf report generator for the Bluethroat Labs Team",
    date: "Apr 20, 2026",
  },
  {
    color: "#F7ED12",
    title: "Custom Animations using Math",
    date: "Apr 20, 2026",
  },
  {
    color: "#6BBD40",
    title: "How I used Claude to animate SVG\u2019s using native animations",
    date: "Apr 20, 2026",
  },
];

const SIDE_ITEMS = [...BASE_ITEMS, ...BASE_ITEMS];
const ITEMS_PER_PAGE = 4;

export default function Sides() {
  const [page, setPage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const totalPages = Math.ceil(SIDE_ITEMS.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibleItems = SIDE_ITEMS.slice(start, start + ITEMS_PER_PAGE);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goTo = (newPage: number) => {
    if (transitioning || newPage === page) return;
    setTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      setTransitioning(false);
    }, 200);
  };

  return (
    <section
      data-section-index={2}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        marginTop: "96px",
      }}
    >
      {/* Heading + primary separator (720px wide) */}
      <div
        style={{
          width: "720px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
            <div
              style={{
                backgroundColor: "var(--color-neutral-dark)",
                width: "12px",
                height: "12px",
                flexShrink: 0,
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
              Sides
            </div>
          </div>
          <div style={{ paddingLeft: "8px" }}>
            <PlayButton label="View all" href="/sides" />
          </div>
        </div>
        <Separator variant="primary" />
      </div>

      {/* Items row: arrow + 720 list + arrow, all in-flow */}
      <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
        <ArrowButton side="left" active={canPrev} onClick={() => goTo(page - 1)} />

        <div
          style={{
            width: "720px",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "32px",
            filter: transitioning ? "blur(6px)" : "blur(0px)",
            opacity: transitioning ? 0.3 : 1,
            transition: "filter 0.2s ease, opacity 0.2s ease",
          }}
        >
          {visibleItems.map((item, i) => (
            <div
              key={`${page}-${i}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "4px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "84px",
                  alignSelf: "stretch",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: "18px",
                      height: "18px",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      color: "var(--color-neutral-dark)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "18px",
                      fontWeight: 500,
                      lineHeight: "180%",
                    }}
                  >
                    {item.title}
                  </div>
                </div>
                <div
                  style={{
                    color: "var(--color-neutral-7)",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: "180%",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.date}
                </div>
              </div>
              <Separator variant="secondary" />
            </div>
          ))}
        </div>

        <ArrowButton side="right" active={canNext} onClick={() => goTo(page + 1)} />
      </div>
    </section>
  );
}

function ArrowButton({
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
      onClick={active ? onClick : undefined}
      disabled={!active}
      aria-label={side === "left" ? "Previous sides" : "Next sides"}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: active ? "pointer" : "default",
        opacity: active ? 1 : 0.4,
        transition: "opacity 0.2s ease",
        flexShrink: 0,
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
