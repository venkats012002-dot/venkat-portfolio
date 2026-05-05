"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [hovered, setHovered] = useState(false);
  const [hiddenForFooter, setHiddenForFooter] = useState(false);
  const [reachedThreshold, setReachedThreshold] = useState(false);

  useEffect(() => {
    const scrollEl = document.querySelector<HTMLElement>("[data-scroll-container]");
    if (!scrollEl) return;

    const compute = () => {
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const progress = maxScroll > 0 ? scrollEl.scrollTop / maxScroll : 0;
      setReachedThreshold(progress >= 0.3);

      const hiddenEl = document.querySelector<HTMLElement>("[data-hidden-footer]");
      if (!hiddenEl) return;
      const revealStart = maxScroll - hiddenEl.offsetHeight;
      setHiddenForFooter(scrollEl.scrollTop > revealStart - 40);
    };

    compute();
    scrollEl.addEventListener("scroll", compute, { passive: true });
    return () => scrollEl.removeEventListener("scroll", compute);
  }, []);

  const visible = reachedThreshold && !hiddenForFooter;

  const scrollToTop = () => {
    const scrollEl = document.querySelector<HTMLElement>("[data-scroll-container]");
    if (!scrollEl) return;
    scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      style={{
        position: "fixed",
        left: "48px",
        bottom: "48px",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/back-to-top.svg"
        alt=""
        width={24}
        height={12}
        style={{ display: "block" }}
      />
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          lineHeight: "150%",
          color: "#CACACA",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        Back to Top
      </div>
    </button>
  );
}
