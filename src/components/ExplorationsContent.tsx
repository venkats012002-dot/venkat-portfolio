"use client";

import { useEffect, useState } from "react";
import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import ExplorationsViewToggle, {
  type ExplorationsView,
} from "@/components/ExplorationsViewToggle";
import ExplorationsGrid from "@/components/ExplorationsGrid";
import ExplorationsGallery from "@/components/ExplorationsGallery";
import type { Exploration } from "@/components/ExplorationCard";

export default function ExplorationsContent({ items }: { items: Exploration[] }) {
  const [view, setView] = useState<ExplorationsView>("grid");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveView: ExplorationsView = isMobile ? "grid" : view;

  return (
    <div
      data-scroll-container
      style={{
        backgroundColor: "var(--color-neutral-light)",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MobileNavWithSidebar />

      <main
        className="explorations-main"
        style={{
          alignItems: "start",
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          fontSynthesis: "none",
          gap: 48,
          MozOsxFontSmoothing: "grayscale",
          paddingBlock: 48,
          paddingInline: 48,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <span className="is-desktop-only" style={{ display: "contents" }}>
          <ExplorationsViewToggle view={view} onChange={setView} />
        </span>

        {items.length === 0 ? (
          <EmptyState message="No explorations yet — add a row in Notion to see it here." />
        ) : effectiveView === "grid" ? (
          <ExplorationsGrid items={items} />
        ) : (
          <ExplorationsGallery items={items} />
        )}
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      style={{
        alignSelf: "stretch",
        color: "var(--color-neutral-7)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        lineHeight: "26px",
      }}
    >
      {message}
    </div>
  );
}
