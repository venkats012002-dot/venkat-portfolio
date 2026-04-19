import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
