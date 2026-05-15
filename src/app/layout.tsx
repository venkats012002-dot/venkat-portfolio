import type { Metadata, Viewport } from "next";
import "./globals.css";
import AgentationRoot from "@/components/AgentationRoot";
import GlobalChrome from "@/components/GlobalChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heyvenk.at"),
  title: "Venkat - Portfolio",
  description: "Multi-disciplinary designer, artist and tinkerer",
  openGraph: {
    title: "Venkat - Portfolio",
    description: "Multi-disciplinary designer, artist and tinkerer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venkat - Portfolio",
    description: "Multi-disciplinary designer, artist and tinkerer",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
