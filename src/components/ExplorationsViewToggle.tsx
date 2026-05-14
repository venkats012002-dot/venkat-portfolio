"use client";

export type ExplorationsView = "grid" | "gallery" | "canvas";

export default function ExplorationsViewToggle({
  view,
  onChange,
}: {
  view: ExplorationsView;
  onChange: (view: ExplorationsView) => void;
}) {
  return (
    <div
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        gap: 32,
      }}
    >
      <Option label="Grid" active={view === "grid"} onClick={() => onChange("grid")} />
      <Option label="Gallery" active={view === "gallery"} onClick={() => onChange("gallery")} />
      <Option
        label="Infinity Canvas"
        active={view === "canvas"}
        onClick={() => onChange("canvas")}
      />
    </div>
  );
}

function Option({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        alignItems: "center",
        background: "none",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        gap: 8,
        outline: "none",
        padding: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          backgroundColor: "var(--color-neutral-dark)",
          boxSizing: "border-box",
          flexShrink: 0,
          height: 12,
          opacity: active ? 1 : 0,
          transition: "opacity 0.2s ease",
          width: 12,
        }}
      />
      <span
        style={{
          boxSizing: "border-box",
          color: active ? "var(--color-neutral-dark)" : "var(--color-neutral-7)",
          fontFamily: "var(--font-heading)",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: "29px",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}
