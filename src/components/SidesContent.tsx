"use client";

import Link from "next/link";
import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import HiddenFooter from "@/components/HiddenFooter";
import SidesList from "@/components/SidesList";
import type { Side } from "@/components/SideItem";

// Visible in `next dev` so we can keep iterating on the real list locally;
// replaced with a "Coming Soon" placeholder on every Vercel build until the
// content is ready.
const SIDES_PUBLISHED = process.env.NODE_ENV === "development";

export default function SidesContent({ items }: { items: Side[] }) {
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
      <MobileNavWithSidebar />

      <main
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          fontSynthesis: "none",
          gap: 48,
          MozOsxFontSmoothing: "grayscale",
          paddingBlock: "144px 48px",
          paddingInline: 48,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 720,
            width: "100%",
            marginInline: "auto",
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
            Sides
          </div>
          <div
            style={{
              alignItems: "start",
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                color: "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: "21px",
              }}
            >
              I&rsquo;m currently figuring out how code, shipping out 0-1 works.
              Also experimenting and exploring around new AI tools.
            </div>
            <div
              style={{
                alignSelf: "stretch",
                color: "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: "21px",
              }}
            >
              This page contains all my writing, side projects, AI tool
              explorations and everything in-between. Feel free to reach me via
              email / Telegram or see more of my work on X(Twittter).
            </div>
          </div>
        </div>

        <div
          style={{
            alignSelf: "stretch",
            maxWidth: 720,
            width: "100%",
            marginInline: "auto",
          }}
        >
          {SIDES_PUBLISHED ? (
            <SidesList items={items} />
          ) : (
            <div
              style={{
                alignSelf: "stretch",
                color: "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: "21px",
                paddingBlock: 32,
              }}
            >
              Coming Soon... Take a walk through{" "}
              <Link
                href="/personal-archive"
                style={{
                  color: "var(--color-neutral-dark)",
                  textDecoration: "underline",
                }}
              >
                Personal Archive
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <HiddenFooter />
    </div>
  );
}
