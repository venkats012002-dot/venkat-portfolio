import type { Metadata } from "next";
import "./globals.css";
import AgentationRoot from "@/components/AgentationRoot";
import GlobalChrome from "@/components/GlobalChrome";

export const metadata: Metadata = {
  title: "Venkat — Portfolio",
  description: "Multi-disciplinary designer, artist and tinkerer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          id="page-translate"
          style={{
            backgroundColor: "var(--color-neutral-light)",
            position: "relative",
            zIndex: 1,
            willChange: "transform",
          }}
        >
          {children}
        </div>
        <GlobalChrome />
        <AgentationRoot />
      </body>
    </html>
  );
}
