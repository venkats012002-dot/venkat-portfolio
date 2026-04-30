"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExplorationsViewToggle, {
  type ExplorationsView,
} from "@/components/ExplorationsViewToggle";
import ExplorationsGrid from "@/components/ExplorationsGrid";
import ExplorationsGallery from "@/components/ExplorationsGallery";
import type { Exploration } from "@/components/ExplorationCard";

export default function ExplorationsContent({ items }: { items: Exploration[] }) {
  const [view, setView] = useState<ExplorationsView>("grid");

  return (
    <div
      style={{
        backgroundColor: "var(--color-neutral-light)",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main
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
        <ExplorationsViewToggle view={view} onChange={setView} />

        {items.length === 0 ? (
          <EmptyState message="No explorations yet — add a row in Notion to see it here." />
        ) : view === "grid" ? (
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
