"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type LightboxMedia = { src: string; type: "image" | "video" };

/**
 * Full-viewport lightbox for case-study images/videos.
 * Portaled to document.body so position:fixed + backdrop-filter escape the
 * `#page-translate` willChange ancestor. Backdrop matches Control Center
 * (blur(12px) + rgba(255,255,255,0.2), 0.3s/0.25s easing). Click backdrop or
 * press ESC to close. Media is constrained to 80vh tall and 90vw wide.
 */
export default function MediaLightbox({
  media,
  onClose,
}: {
  media: LightboxMedia | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media, onClose]);

  if (!mounted) return null;

  const open = media !== null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backdropFilter: open ? "blur(12px)" : "blur(0px)",
        WebkitBackdropFilter: open ? "blur(12px)" : "blur(0px)",
        backgroundColor: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition:
          "backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, background-color 0.3s ease, opacity 0.25s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      {media && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.src}
              alt=""
              style={{
                maxHeight: "80vh",
                maxWidth: "90vw",
                width: "auto",
                height: "auto",
                display: "block",
              }}
            />
          ) : (
            <video
              src={media.src}
              autoPlay
              loop
              controls
              playsInline
              style={{
                maxHeight: "80vh",
                maxWidth: "90vw",
                width: "auto",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
