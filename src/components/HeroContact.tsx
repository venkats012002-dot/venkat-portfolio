"use client";

import { useState } from "react";
import PlayButton from "./PlayButton";

const EMAIL = "venkat.s012002@gmail.com";

export default function HeroContact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older/insecure contexts — ignore silently
    }
  };

  return (
    <div className="hero-contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--hero-contact-gap)" }}>
      {/* Copy Mail Id */}
      <button
        className="hero-contact-mail"
        onClick={copyEmail}
        aria-label={copied ? "Email copied" : "Copy email address"}
        style={{
          position: "relative",
          width: "fit-content",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          lineHeight: "150%",
          color: "var(--color-neutral-7)",
          textAlign: "left",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "block",
            filter: copied ? "blur(6px)" : "blur(0px)",
            opacity: copied ? 0.35 : 1,
            transition: "filter 0.25s ease, opacity 0.25s ease",
          }}
        >
          Copy Mail Id
        </span>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            color: "var(--color-neutral-dark)",
            opacity: copied ? 1 : 0,
            transform: copied ? "scale(1)" : "scale(0.4)",
            transformOrigin: "left center",
            transition: copied
              ? "opacity 0.2s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "opacity 0.15s ease, transform 0.15s ease",
            pointerEvents: "none",
          }}
        >
          Copied!
        </span>
      </button>

      {/* Socials */}
      <div className="hero-contact-socials" style={{ display: "flex", alignItems: "flex-start", gap: "var(--hero-contact-socials-gap)" }}>
        <a href="https://www.linkedin.com/in/venkat-subramanian-g/" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ display: "inline-flex", lineHeight: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <defs>
              <clipPath id="contact-linkedin-clip">
                <rect width="20" height="20" fill="#fff" />
              </clipPath>
            </defs>
            <g clipPath="url(#contact-linkedin-clip)">
              <path d="M19.33 0.71V0H0.685V0.735H0V19.28H0.71V20H19.28V19.29H20.02V0.71H19.33ZM19.26 18.515H18.565V19.255H1.42V18.48H0.71V1.39H1.42V0.725H18.525V1.355H19.26V18.515Z" fill="#555555" />
              <path d="M7.06 7.825H4.815V15.83H7.135V7.825H7.06Z" fill="#555555" />
              <path d="M7.06 4.155H4.84V4.865H4.205V6.355H4.815V7.065H7.06V6.355H7.69V4.865H7.06V4.155Z" fill="#555555" />
              <path d="M15.78 10.02V9.335H15.07V8.575H14.385V7.84H11.43V8.54H10.695V7.825H8.525V15.83H10.695V10.68H11.455V9.97H12.92V10.68H13.63V15.83H15.85V10.02H15.78Z" fill="#555555" />
            </g>
          </svg>
        </a>
        <a href="https://x.com/Venkat13568344" target="_blank" rel="noreferrer" aria-label="X" style={{ display: "inline-flex", lineHeight: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M18.752 1.2H14.314V2.339H13.254V3.454H12.118V4.502H11.026V5.57H10.442V6.753H9.436V5.57H8.908V4.506H7.837V3.45H6.753V2.327H5.605V1.2H1.208V3.474H2.329V4.537H3.473V6.738H4.576V7.809H5.598V8.905H6.749V11.047H5.621V12.114H4.587V13.282H3.48V15.427H2.318V16.498H1.21V17.57H0.242V18.721H5.602V17.593H6.742V16.501H7.83V15.448H8.912V14.337H11.026V15.425H12.106V16.492H13.254V17.603H14.317V18.72H19.821V17.569H18.746V16.498H17.586V15.426H16.494V13.28H15.391V12.117H14.316V11.034H13.241V8.906H14.32V7.803H15.377V5.573H16.528V4.52H17.595V3.475H18.754L18.752 1.2ZM3.472 4.514V3.45H5.602V4.53H6.754V5.59H7.829V6.73H8.917V7.79H9.445V8.897H11.019V6.738H12.094V5.602H13.23V4.502H14.314V3.454H15.39V4.553H14.341V6.738H13.238V7.801L12.102 7.809V8.897H11.018V11.036H12.106V12.119H13.246V13.286H14.318V14.342H15.389V15.418H16.496V16.506H14.314V15.418H13.215V14.338H12.097V13.217H11.022V12.114H9.965V11.026H8.902V8.894H7.818V7.799H6.743V6.739H5.592V5.603H4.566V4.515L3.472 4.514Z" fill="#555555" />
          </svg>
        </a>
        <a href="https://t.me/Whit3fang" target="_blank" rel="noreferrer" aria-label="Telegram" style={{ display: "inline-flex", lineHeight: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M19.709 8.05H18.726V11.896H17.731V16.746H16.734V18.697H14.806V17.738H12.891V16.746H11.863V15.791H9.973V16.757H9.054V17.73H7.094V16.764H6.078V13.862H5.162V11.889H3.195V10.941H1.251V9.985H0.347V9.019H1.244V8.057H3.206V7.066H5.169V6.11H7.128V5.111H9.087V4.113H11.859V3.198H13.838V2.199H15.768V1.2H19.709V8.05ZM10.873 8.038H9.954V8.978H9.046V9.941H7.09V10.896H6.077V13.847H7.09V15.774H8.066V11.884H9.017V10.908H9.914V9.974H10.869V9.019H11.866V8.064H12.825V7.065H10.873V8.038ZM12.832 7.033H13.808V6.067H12.832V7.033ZM13.816 6.053H14.792V5.098H13.816V6.053ZM14.8 4.128V5.09H15.73V4.128H14.8Z" fill="#555555" />
          </svg>
        </a>
      </div>

      {/* Resume */}
      <div className="hero-contact-resume" style={{ paddingLeft: "8px" }}>
        <PlayButton label="Resume" />
      </div>
    </div>
  );
}
