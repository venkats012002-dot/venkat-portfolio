import { Fragment } from "react";
import SideItem, { type Side } from "./SideItem";
import Separator from "./Separator";

export default function SidesList({ items }: { items: Side[] }) {
  if (items.length === 0) {
    return (
      <div
        aria-live="polite"
        style={{
          alignSelf: "stretch",
          color: "var(--color-neutral-7)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: "21px",
        }}
      >
        No sides yet — placeholder list will populate once the Notion DB is wired in.
      </div>
    );
  }

  return (
    <div
      style={{
        alignItems: "stretch",
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {items.map((item, i) => (
        <Fragment key={item.id}>
          {i > 0 && <Separator variant="primary" />}
          <SideItem {...item} />
        </Fragment>
      ))}
    </div>
  );
}
