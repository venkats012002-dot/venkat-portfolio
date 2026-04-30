"use client";

export type Side = {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
};

export default function SideItem({ title, description, image, href }: Side) {
  const body = (
    <div
      style={{
        alignItems: "start",
        alignSelf: "stretch",
        boxSizing: "border-box",
        display: "flex",
        gap: 48,
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          boxSizing: "border-box",
          flexShrink: 0,
          height: 140,
          overflow: "clip",
          width: 250,
        }}
      />
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 8,
          minWidth: 0,
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            color: "#000000",
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontWeight: 500,
            lineHeight: "44px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            boxSizing: "border-box",
            color: "var(--color-neutral-7)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "21px",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ alignSelf: "stretch", color: "inherit", textDecoration: "none" }}
      >
        {body}
      </a>
    );
  }
  return body;
}
