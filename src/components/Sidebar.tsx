"use client";

import { useEffect, useRef, useCallback } from "react";
import PlayButton from "./PlayButton";

// Signature trace animation config
const STROKE_CONFIG = [
  { id: "sig-1", duration: 0.6, delay: 0 },
  { id: "sig-2", duration: 0.55, delay: 0.55 },
  { id: "sig-3", duration: 0.5, delay: 1.05 },
  { id: "sig-4", duration: 0.6, delay: 1.5 },
  { id: "sig-5", duration: 0.9, delay: 2.05 },
  { id: "sig-6", duration: 0.4, delay: 2.9 },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function penEasing(t: number) {
  if (t < 0.1) return t * t * 100 * 0.1;
  return easeOutCubic((t - 0.1) / 0.9) * 0.9 + 0.1;
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);

  const animateSignature = useCallback(() => {
    if (!svgRef.current) return;

    // Clear previous
    timeoutsRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timeoutsRef.current = [];
    rafsRef.current = [];

    STROKE_CONFIG.forEach(({ id, duration, delay }) => {
      const path = svgRef.current?.querySelector(`#${id}`) as SVGPathElement | null;
      if (!path) return;

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const actualDuration = duration * 1000;
      const actualDelay = delay * 1000;

      const t = setTimeout(() => {
        let start: number | null = null;
        function step(timestamp: number) {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / actualDuration, 1);
          const easedProgress = penEasing(progress);
          path!.style.strokeDashoffset = `${length * (1 - easedProgress)}`;
          if (progress < 1) {
            const raf = requestAnimationFrame(step);
            rafsRef.current.push(raf);
          }
        }
        const raf = requestAnimationFrame(step);
        rafsRef.current.push(raf);
      }, actualDelay);
      timeoutsRef.current.push(t);
    });
  }, []);

  useEffect(() => {
    if (open) {
      // Delay animation to start after sidebar slides in
      const t = setTimeout(animateSignature, 400);
      timeoutsRef.current.push(t);
    }
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      rafsRef.current.forEach(cancelAnimationFrame);
    };
  }, [open, animateSignature]);

  return (
    <div
      className={`sidebar-drawer ${open ? "sidebar-drawer-open" : "sidebar-drawer-closed"}`}
      style={{
        alignItems: "start",
        backgroundColor: "#F2F2F2",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        overflow: "hidden",
        paddingBlock: 32,
        paddingInline: "24px",
        width: open ? "296px" : "0px",
        minWidth: open ? "296px" : "0px",
        padding: open ? "32px 32px" : "32px 0px",
        height: "100vh",
        overflowY: "auto",
        transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {onClose && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="sidebar-close is-mobile-only"
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            lineHeight: 0,
            zIndex: 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.20001 9.5871H6.40003V12.7871H3.20001V9.5871Z" fill="black"/>
            <path d="M0 12.8H3.20002V16H0V12.8Z" fill="black"/>
            <path d="M3.20001 3.20001H6.40003V6.40002H3.20001V3.20001Z" fill="black"/>
            <path d="M0 0H3.20002V3.20001H0V0Z" fill="black"/>
            <path d="M6.40002 6.38721H9.60004V9.58722H6.40002V6.38721Z" fill="black"/>
            <path d="M9.60645 9.59357H12.8065V12.7936H9.60645V9.59357Z" fill="black"/>
            <path d="M12.8001 12.8H16.0001V16H12.8001V12.8Z" fill="black"/>
            <path d="M9.60004 3.18701H12.8001V6.38702H9.60004V3.18701Z" fill="black"/>
            <path d="M12.8001 0H16.0001V3.20001H12.8001V0Z" fill="black"/>
          </svg>
        </button>
      )}
      {/* Header */}
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: 4, whiteSpace: "nowrap" }}>
        <div style={{ color: "#555555", fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 500, lineHeight: "150%" }}>
          Site Info
        </div>
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%" }}>
          Work in Progress (Always)
        </div>
      </div>

      {/* About */}
      <SidebarSection title="About">
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", width: "232px" }}>
          Built out of curiosity and my love for design. Trying to capture my individual indentity on the wide web. I wanted this page to have a plain, calm vibe on the outside but with plenty of easter eggs inside. Form + Function = Hell Yeah!
        </div>
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", width: "232px" }}>
          Play around with the site settings on Control Center at the top right
        </div>
      </SidebarSection>

      {/* Alter Ego */}
      <SidebarSection title="Alter Ego">
        <div style={{ display: "flex", alignItems: "end", gap: "24px" }}>
          <div
            style={{
              backgroundImage: "url(/images/whit3fang-sidebar.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              flexShrink: 0,
              height: "62px",
              width: "48px",
              imageRendering: "pixelated",
            }}
          />
          <PlayButton href="/whit3fang" />
        </div>
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", width: "232px" }}>
          Whit3Fang is who I think I am inside my head. Go have some fun poking him XD
        </div>
      </SidebarSection>

      {/* Visual System */}
      <SidebarSection title="Visual System">
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", width: "232px" }}>
          This page boasts a more pixelated vibe which always felt like home to me.
        </div>
        <div style={{ display: "flex", gap: "6px", whiteSpace: "nowrap" }}>
          <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", flexShrink: 0 }}>
            Fonts: Geist Pixel
          </div>
          <div style={{ color: "#7A7A7A", fontFamily: "var(--font-heading)", fontSize: "13px", fontWeight: 500, lineHeight: "150%" }}>
            & Alpha Lyrae
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", flexShrink: 0 }}>
            Palette
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["#101010", "#F2F2F2", "#F01C26", "#F7ED12", "#F7941C", "#6BBD40", "#3654A3"].map((color) => (
              <div
                key={color}
                style={{
                  backgroundColor: color,
                  flexShrink: 0,
                  height: "8px",
                  width: "8px",
                  border: color === "#F2F2F2" ? "0.5px solid #E8E8E8" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </SidebarSection>

      {/* Build */}
      <SidebarSection title="Build">
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", whiteSpace: "pre-wrap", width: "232px" }}>
          {"Designed in Figma, Built with Next.js using Claude Code & yours truly.  Hosted in Vercel."}
        </div>
      </SidebarSection>

      {/* Inspirations */}
      <SidebarSection title="Inspirations">
        <div style={{ color: "#7A7A7A", fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: "150%", width: "232px" }}>
          This portfolio was made with a lot of inspirations and references from people who I always look up to. Inspired to get to that level soon. Do check out their works here!
        </div>
        <PlayButton label="Inspirations" href="/inspirations" />
      </SidebarSection>

      {/* Footer */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: "24px" }}>
        {/* Social icons */}
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="https://www.linkedin.com/in/venkat-subramanian-g/" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ display: "inline-flex", lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.33 0.71V0H0.685V0.735H0V19.28H0.71V20H19.28V19.29H20.02V0.71H19.33ZM19.26 18.515H18.565V19.255H1.42V18.48H0.71V1.39H1.42V0.725H18.525V1.355H19.26V18.515Z" fill="#555555" />
              <path d="M7.06 7.825H4.815V15.83H7.135V7.825H7.06Z" fill="#555555" />
              <path d="M7.06 4.155H4.84V4.865H4.205V6.355H4.815V7.065H7.06V6.355H7.69V4.865H7.06V4.155Z" fill="#555555" />
              <path d="M15.78 10.02V9.335H15.07V8.575H14.385V7.84H11.43V8.54H10.695V7.825H8.525V15.83H10.695V10.68H11.455V9.97H12.92V10.68H13.63V15.83H15.85V10.02H15.78Z" fill="#555555" />
            </svg>
          </a>
          <a href="https://x.com/Venkat13568344" target="_blank" rel="noreferrer" aria-label="X" style={{ display: "inline-flex", lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.752 1.2H14.314V2.339H13.254V3.454H12.118V4.502H11.026V5.57H10.442V6.753H9.436V5.57H8.908V4.506H7.837V3.45H6.753V2.327H5.605V1.2H1.208V3.474H2.329V4.537H3.473V6.738H4.576V7.809H5.598V8.905H6.749V11.047H5.621V12.114H4.587V13.282H3.48V15.427H2.318V16.498H1.21V17.57H0.242V18.721H5.602V17.593H6.742V16.501H7.83V15.448H8.912V14.337H11.026V15.425H12.106V16.492H13.254V17.603H14.317V18.72H19.821V17.569H18.746V16.498H17.586V15.426H16.494V13.28H15.391V12.117H14.316V11.034H13.241V8.906H14.32V7.803H15.377V5.573H16.528V4.52H17.595V3.475H18.754L18.752 1.2ZM3.472 4.514V3.45H5.602V4.53H6.754V5.59H7.829V6.73H8.917V7.79H9.445V8.897H11.019V6.738H12.094V5.602H13.23V4.502H14.314V3.454H15.39V4.553H14.341V6.738H13.238V7.801L12.102 7.809V8.897H11.018V11.036H12.106V12.119H13.246V13.286H14.318V14.342H15.389V15.418H16.496V16.506H14.314V15.418H13.215V14.338H12.097V13.217H11.022V12.114H9.965V11.026H8.902V8.894H7.818V7.799H6.743V6.739H5.592V5.603H4.566V4.515L3.472 4.514Z" fill="#555555" />
            </svg>
          </a>
          <a href="https://t.me/Whit3fang" target="_blank" rel="noreferrer" aria-label="Telegram" style={{ display: "inline-flex", lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.709 8.05H18.726V11.896H17.731V16.746H16.734V18.697H14.806V17.738H12.891V16.746H11.863V15.791H9.973V16.757H9.054V17.73H7.094V16.764H6.078V13.862H5.162V11.889H3.195V10.941H1.251V9.985H0.347V9.019H1.244V8.057H3.206V7.066H5.169V6.11H7.128V5.111H9.087V4.113H11.859V3.198H13.838V2.199H15.768V1.2H19.709V8.05ZM10.873 8.038H9.954V8.978H9.046V9.941H7.09V10.896H6.077V13.847H7.09V15.774H8.066V11.884H9.017V10.908H9.914V9.974H10.869V9.019H11.866V8.064H12.825V7.065H10.873V8.038ZM12.832 7.033H13.808V6.067H12.832V7.033ZM13.816 6.053H14.792V5.098H13.816V6.053ZM14.8 4.128V5.09H15.73V4.128H14.8Z" fill="#555555" />
            </svg>
          </a>
          <a href="https://github.com/venkats012002-dot" target="_blank" rel="noreferrer" aria-label="GitHub" style={{ display: "inline-flex", lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m251.3 98.78v-15.49h-5.64v-11.77h-4.09v-9.89h-4.87v-4.87h-5.55v-10.28h-6.45v-7.82h-6.45v-7.24h-8.22v-5.76h-11.38v-5.65h-5.25v-4.49h-8.22v-4.1h-16.29v-5.25h-10.69v-5.17h-60.44v4.77h-10.29v5.25h-16.29v4.5h-9.89v5.26h-5.25v4.88h-10.29v6.45h-6.45v6.95h-6.45v6.45h-9.08v5.65h-5.26v10.07h-4.87v10.69h-4.49v11.37h-4.17v15.29h-5v60.64h5.25v16.29h4.87v10.69h4.1v9.68h8.21v10.29h5.26v7.24h7.24v7.24h4.88v7.44h6.85v5.65h14.25v6.05h10.29v8.22h10.98v4.9l15.2-0.1v-26.02h-25.78v-6.84h-5.26v-8.62h-6.85v-6.06h-7.24v-6.45h-6.46v-6.05h-6.45v-2.41h-4.48v-9.89h11.37v5.65h4.77v6.05h6.85v7.45h7.82v5.65h5.65v5.65h26.08v-10.29h6.05v-4.87h-11.08v-5.65h-10.69v-5.25h-9.89v-5.65h-5.25v-4.87h-5.65v-14.71h-5.65v-4.5h-9.03v-10.69h-5.65v-29.98h5.65v-10.69h4.5v-5.65h6.05v-30.98h4.87v-10.28h9.48v4.87h11.37v5.64h10.29v5.26h25.38v-5.26h20.11v5.26h25.38v-5.26h10.29v-5.64h10.28v-4.87h9.88v10.28h4.87v30.98h4.88v5.65h5.25v10.69h5.65v29.58h-5.25v14.29h-5.65v9.08h-5.26v5.65h-8.21v6.45h-6.05v6.05h-11.78v4.87h-8.68v7.24h-5.65v2.01h-5.25v1.61h5.65v51.52h15.29v-6.05h11.08v-6.05h10.29v-4.1h9.48v-6.05h6.05v-7.82h6.85v-7.65h7.44v-8.22h6.45v-6.45h5.26v-6.07h4.49v-8.68h5.26v-10.69h4.87v-15.69h4.56v-60.51h-4.66z" fill="#555555" />
            </svg>
          </a>
        </div>

        {/* Signature with trace animation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <svg
            ref={svgRef}
            width="230"
            height="135"
            viewBox="0 0 230 135"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: "48px", width: "auto", flexShrink: 0 }}
          >
            <path id="sig-1" d="M3 32.015C5 35.182 9.1 42.515 9.5 46.515C10.001 51.515 19 78.015 19.5 81.015C19.901 83.415 21.5 91.5 22 90.515C27.334 71.849 37.401 32.815 35.001 26.015" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
            <path id="sig-2" d="M54.001 79.515C53.334 82.682 51.3 88.915 48.501 88.515C45.001 88.015 37.501 82.015 37.501 78.515C37.501 76.663 37.921 72.15 38.909 68.015M38.909 68.015C39.788 64.336 41.117 60.956 43.001 60.015C47.001 58.015 48.001 53.515 52.001 55.015C56.001 56.515 57.001 60.015 57.001 63.015C57.001 66.015 54.001 75.515 49.501 75.515C45.901 75.515 40.939 70.515 38.909 68.015Z" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
            <path id="sig-3" d="M69.001 76.016C69.334 71.683 69.501 66.015 69.001 62.516M69.001 62.516C68.746 60.731 72.001 47.515 76.001 48.016C77.789 48.24 80.807 53.917 80.501 58.516C80.001 66.015 80.501 66.516 80.501 68.016C80.501 72.015 85.001 73.016 86.501 73.516M69.001 62.516C67.834 58.516 64.9 49.516 62.501 49.516" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
            <path id="sig-4" d="M92.001 74.515C92.334 74.348 93.1 73.715 93.501 72.515C93.732 71.82 94.286 60.074 94.217 47.515M81.001 24.015C82.001 21.015 85.201 15.315 90.001 16.515C93.221 17.32 94.137 32.963 94.217 47.515M94.217 47.515C97.478 42.682 104.7 33.215 107.5 34.015C110.3 34.815 111.667 37.349 112 38.515C111.273 42.182 108.255 50.115 102 52.515M102 52.515C99.645 54.015 94.79 56.815 94.217 56.015M102 52.515C104.334 55.015 108.5 62.015 106.5 70.015C106.5 70.515 106.9 71.515 108.5 71.515" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
            <path id="sig-5" d="M141.501 47.515C138.667 54.348 131.401 64.315 125.001 49.515C124.834 44.015 126.701 32.315 135.501 29.515C138.667 30.848 144.301 36.315 141.501 47.515ZM141.501 47.515C142.667 50.848 145.6 57.115 148 55.515C151 53.515 156.5 47.515 158 37.515C159.5 27.515 160 10.515 154 5.515C148 0.515 138 3.015 136.5 4.015C135 5.015 127 7.515 124 20.515C121 33.515 119.5 44.015 119.5 52.015C119.5 60.015 118 69.015 121 75.515C124 82.015 133 91.015 138.5 91.015C144 91.015 156.5 79.515 161 71.015C164.6 64.215 166 53.333 166 51" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
            <path id="sig-6" d="M2.5 132.015C30.167 114.015 93.3 75.915 124.5 67.515C155.7 59.115 206.167 44.015 227.5 37.515" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 1.926C10.021 1.926 11.495 2.453 12.671 3.418C13.847 4.383 14.652 5.725 14.948 7.217C15.245 8.709 15.015 10.257 14.299 11.599C13.582 12.94 12.422 13.992 11.017 14.574C9.612 15.156 8.048 15.233 6.592 14.791C5.137 14.35 3.88 13.417 3.034 12.153C2.189 10.888 1.809 9.37 1.958 7.856C2.107 6.342 2.776 4.927 3.852 3.852C4.461 3.239 5.185 2.754 5.983 2.423C6.781 2.093 7.636 1.924 8.5 1.926ZM8.5 0C3.805 0 0 3.806 0 8.5C0 13.194 3.805 17 8.5 17C13.195 17 17 13.194 17 8.5C17 3.806 13.194 0 8.5 0Z" fill="#454545" />
              <path d="M10.721 9.928C10.416 10.372 9.977 10.707 9.468 10.884C8.959 11.06 8.407 11.07 7.893 10.91C7.378 10.751 6.928 10.431 6.608 9.997C6.289 9.563 6.116 9.039 6.116 8.5C6.116 7.961 6.289 7.437 6.608 7.003C6.928 6.569 7.378 6.249 7.893 6.09C8.407 5.93 8.959 5.94 9.468 6.116C9.977 6.293 10.416 6.628 10.721 7.072L12.308 5.983C12.153 5.756 11.977 5.544 11.782 5.35C10.045 3.613 7.22 3.613 5.483 5.35C3.746 7.087 3.746 9.912 5.483 11.649C5.946 12.112 6.505 12.466 7.12 12.688C7.736 12.911 8.393 12.994 9.044 12.934C9.696 12.874 10.326 12.671 10.89 12.339C11.454 12.008 11.939 11.556 12.309 11.017L10.721 9.928Z" fill="#454545" />
            </svg>
            <div style={{ color: "#555555", fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: "150%", whiteSpace: "nowrap" }}>
              Venkat Subramanian
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <div style={{ backgroundColor: "#101010", flexShrink: 0, height: "12px", width: "12px" }} />
          <div style={{ color: "#101010", fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 500, lineHeight: "180%" }}>
            {title}
          </div>
        </div>
        <svg className="is-desktop-only" width="248" height="4" viewBox="0 0 248 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <line y1="2" x2="248" y2="2" stroke="#CACACA" strokeWidth="4" strokeDasharray="4 8" />
        </svg>
        <div className="is-mobile-only sidebar-section-sep" aria-hidden />
      </div>
      {children}
    </div>
  );
}
