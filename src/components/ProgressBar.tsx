"use client";

import { useEffect, useState } from "react";

type ProgressBarProps = {
  total?: number;
};

export default function ProgressBar({ total = 4 }: ProgressBarProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-index]")
    );
    if (sections.length === 0) return;

    // Find the nearest scrollable ancestor of the first section
    let scrollRoot: Element | null = sections[0].parentElement;
    while (scrollRoot && scrollRoot !== document.body) {
      const style = getComputedStyle(scrollRoot);
      if (style.overflowY === "auto" || style.overflowY === "scroll") break;
      scrollRoot = scrollRoot.parentElement;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-section-index"));
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      {
        root: scrollRoot,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "16px",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        zIndex: 40,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <div
            key={i}
            style={{
              width: "8px",
              height: isActive ? "32px" : "8px",
              backgroundColor: isActive ? "#CACACA" : "#F2F2F2",
              borderColor: isActive ? "#747474" : "#CACACA",
              borderStyle: "solid",
              borderWidth: "0.5px",
              flexShrink: 0,
              overflow: "clip",
              transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
}
