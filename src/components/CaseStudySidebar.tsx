"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type SidebarItem = { id: string; label: string };

/**
 * Sticky left-rail TOC for case study pages.
 * Hover/active behavior modeled on willphan.com/components/tabs:
 *   - A single frosted-glass pill (backdrop-filter: blur) morphs between items via layoutId.
 *   - The pill rests at the currently active (scroll-spy) item when nothing is hovered,
 *     and slides to the hovered item on mouseover.
 *   - Wherever the pill is, the item shows a 12px pixel square indicator + dark text fill.
 */
export default function CaseStudySidebar({
  items,
  activeId,
}: {
  items: SidebarItem[];
  activeId: string | null;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setHide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (!mounted || hide) return null;

  const highlightedId = hoveredId ?? activeId;

  // Portal to document.body so position:fixed escapes the #page-translate
  // ancestor's `willChange: transform`, which would otherwise turn fixed into
  // absolute relative to that wrapper and scroll the sidebar with the page.
  return createPortal(
    <aside
      onMouseLeave={() => setHoveredId(null)}
      style={{
        position: "fixed",
        top: 96,
        left: 0,
        paddingLeft: 48,
        paddingRight: 24,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <Link
        href="/"
        aria-label="Back to home"
        style={{
          display: "inline-flex",
          lineHeight: 0,
          color: "var(--color-neutral-dark)",
          textDecoration: "none",
        }}
      >
        <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M0 7.983H16V10.643H0V7.983Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M2 5.322H4V7.983H2V5.322Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M2 10.643H4V13.304H2V10.643Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M4 2.661H6V5.322H4V2.661Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M4 13.304H6V15.965H4V13.304Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6 0H8V2.661H6V0Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6 15.965H8V18.626H6V15.965Z" fill="currentColor" />
        </svg>
      </Link>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-start",
          marginLeft: -16,
        }}
      >
        {items.map((item) => {
          const isHighlighted = item.id === highlightedId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onClick={(e) => {
                const el = document.getElementById(item.id);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${item.id}`);
              }}
              style={{
                position: "relative",
                display: "block",
                paddingBlock: 6,
                paddingLeft: 24,
                paddingRight: 12,
                color: isHighlighted
                  ? "var(--color-neutral-dark)"
                  : "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: "180%",
                textDecoration: "none",
                transition: "color 0.18s ease",
              }}
            >
              {isHighlighted && (
                <motion.span
                  layoutId="case-study-sidebar-square"
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    marginTop: -4,
                    backgroundColor: "var(--color-neutral-dark)",
                    width: 8,
                    height: 8,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                />
              )}
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>,
    document.body,
  );
}
