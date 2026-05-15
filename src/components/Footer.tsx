"use client";

import { useState } from "react";
import FooterSignature from "./FooterSignature";
import LetterWaveText from "./LetterWaveText";
import { useHoverLift } from "@/hooks/useHoverLift";

const EMAIL = "venkat.s012002@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op on failure
    }
  };

  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "center",
        gap: "60px",
        marginTop: "96px",
        paddingTop: "72px",
        paddingBottom: "32px",
        overflow: "clip",
      }}
    >
      {/* Top block: signature + credentials + quote */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <FooterSignature />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CopyrightIcon />
            <div
              style={{
                color: "#454545",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                lineHeight: "150%",
              }}
            >
              Venkat Subramanian
            </div>
          </div>
        </div>
        <div
          style={{
            color: "var(--color-neutral-7)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            lineHeight: "180%",
            textAlign: "center",
          }}
        >
          {"\u201C He who has a why to live can bear almost any how \u201D"}
        </div>
      </div>

      {/* Bottom nav row */}
      <div
        className="footer-bottom-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "72px",
          justifyContent: "space-between",
        }}
      >
        <FooterLink href="/work">Work</FooterLink>
        <FooterLink href="/explorations">Explorations</FooterLink>
        <FooterLink href="/sides">Sides</FooterLink>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
          <SocialLink href="https://www.linkedin.com/in/venkat-subramanian-g/" label="LinkedIn">
            <LinkedInSvg />
          </SocialLink>
          <SocialLink href="https://x.com/Venkat13568344" label="X">
            <XSvg />
          </SocialLink>
          <SocialLink href="https://t.me/Whit3fang" label="Telegram">
            <TelegramSvg />
          </SocialLink>
          <SocialLink href="https://github.com/venkats012002-dot" label="GitHub">
            <GitHubSvg />
          </SocialLink>
        </div>

        <FooterLink href="/about">About</FooterLink>

        <button
          onClick={copyEmail}
          aria-label={copied ? "Email copied" : "Copy email address"}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            color: "var(--color-neutral-dark)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            lineHeight: "150%",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "inline-block",
              filter: copied ? "blur(6px)" : "blur(0px)",
              opacity: copied ? 0.35 : 1,
              transition: "filter 0.25s ease, opacity 0.25s ease",
            }}
          >
            <LetterWaveText text="Copy Mail Id" />
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-neutral-dark)",
              opacity: copied ? 1 : 0,
              transform: copied ? "scale(1)" : "scale(0.4)",
              transformOrigin: "center",
              transition: copied
                ? "opacity 0.2s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "opacity 0.15s ease, transform 0.15s ease",
              pointerEvents: "none",
            }}
          >
            Copied!
          </span>
        </button>

        <FooterLink href="/resume.pdf" target="_blank" rel="noopener">Resume</FooterLink>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  target,
  rel,
}: {
  href: string;
  children: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={{
        color: "var(--color-neutral-dark)",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        lineHeight: "150%",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <LetterWaveText text={children} />
    </a>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const lift = useHoverLift();
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => {
        lift.onMouseEnter();
        setHovered(true);
      }}
      onMouseLeave={() => {
        lift.onMouseLeave();
        setHovered(false);
      }}
      style={{
        display: "inline-flex",
        lineHeight: 0,
        color: hovered ? "#101010" : "#555555",
        transition: "color 0.18s ease",
        ...lift.style,
      }}
    >
      {children}
    </a>
  );
}

function CopyrightIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M8.5 1.926C10.021 1.926 11.495 2.453 12.671 3.418C13.847 4.383 14.652 5.725 14.948 7.217C15.245 8.709 15.015 10.257 14.299 11.599C13.582 12.94 12.422 13.992 11.017 14.574C9.612 15.156 8.048 15.233 6.592 14.791C5.137 14.35 3.88 13.417 3.034 12.153C2.189 10.888 1.809 9.37 1.958 7.856C2.107 6.342 2.776 4.927 3.852 3.852C4.461 3.239 5.185 2.754 5.983 2.423C6.781 2.093 7.636 1.924 8.5 1.926ZM8.5 0C3.805 0 0 3.806 0 8.5C0 13.194 3.805 17 8.5 17C13.195 17 17 13.194 17 8.5C17 3.806 13.194 0 8.5 0Z" fill="#454545" />
      <path d="M10.721 9.928C10.416 10.372 9.977 10.707 9.468 10.884C8.959 11.06 8.407 11.07 7.893 10.91C7.378 10.751 6.928 10.431 6.608 9.997C6.289 9.563 6.116 9.039 6.116 8.5C6.116 7.961 6.289 7.437 6.608 7.003C6.928 6.569 7.378 6.249 7.893 6.09C8.407 5.93 8.959 5.94 9.468 6.116C9.977 6.293 10.416 6.628 10.721 7.072L12.308 5.983C12.153 5.756 11.977 5.544 11.782 5.35C10.045 3.613 7.22 3.613 5.483 5.35C3.746 7.087 3.746 9.912 5.483 11.649C5.946 12.112 6.505 12.466 7.12 12.688C7.736 12.911 8.393 12.994 9.044 12.934C9.696 12.874 10.326 12.671 10.89 12.339C11.454 12.008 11.939 11.556 12.309 11.017L10.721 9.928Z" fill="#454545" />
    </svg>
  );
}

function LinkedInSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M19.33 0.71V0H0.685V0.735H0V19.28H0.71V20H19.28V19.29H20.02V0.71H19.33ZM19.26 18.515H18.565V19.255H1.42V18.48H0.71V1.39H1.42V0.725H18.525V1.355H19.26V18.515Z" fill="currentColor" />
      <path d="M7.06 7.825H4.815V15.83H7.135V7.825H7.06Z" fill="currentColor" />
      <path d="M7.06 4.155H4.84V4.865H4.205V6.355H4.815V7.065H7.06V6.355H7.69V4.865H7.06V4.155Z" fill="currentColor" />
      <path d="M15.78 10.02V9.335H15.07V8.575H14.385V7.84H11.43V8.54H10.695V7.825H8.525V15.83H10.695V10.68H11.455V9.97H12.92V10.68H13.63V15.83H15.85V10.02H15.78Z" fill="currentColor" />
    </svg>
  );
}

function XSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M18.752 1.2H14.314V2.339H13.254V3.454H12.118V4.502H11.026V5.57H10.442V6.753H9.436V5.57H8.908V4.506H7.837V3.45H6.753V2.327H5.605V1.2H1.208V3.474H2.329V4.537H3.473V6.738H4.576V7.809H5.598V8.905H6.749V11.047H5.621V12.114H4.587V13.282H3.48V15.427H2.318V16.498H1.21V17.57H0.242V18.721H5.602V17.593H6.742V16.501H7.83V15.448H8.912V14.337H11.026V15.425H12.106V16.492H13.254V17.603H14.317V18.72H19.821V17.569H18.746V16.498H17.586V15.426H16.494V13.28H15.391V12.117H14.316V11.034H13.241V8.906H14.32V7.803H15.377V5.573H16.528V4.52H17.595V3.475H18.754L18.752 1.2ZM3.472 4.514V3.45H5.602V4.53H6.754V5.59H7.829V6.73H8.917V7.79H9.445V8.897H11.019V6.738H12.094V5.602H13.23V4.502H14.314V3.454H15.39V4.553H14.341V6.738H13.238V7.801L12.102 7.809V8.897H11.018V11.036H12.106V12.119H13.246V13.286H14.318V14.342H15.389V15.418H16.496V16.506H14.314V15.418H13.215V14.338H12.097V13.217H11.022V12.114H9.965V11.026H8.902V8.894H7.818V7.799H6.743V6.739H5.592V5.603H4.566V4.515L3.472 4.514Z" fill="currentColor" />
    </svg>
  );
}

function TelegramSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M19.709 8.05H18.726V11.896H17.731V16.746H16.734V18.697H14.806V17.738H12.891V16.746H11.863V15.791H9.973V16.757H9.054V17.73H7.094V16.764H6.078V13.862H5.162V11.889H3.195V10.941H1.251V9.985H0.347V9.019H1.244V8.057H3.206V7.066H5.169V6.11H7.128V5.111H9.087V4.113H11.859V3.198H13.838V2.199H15.768V1.2H19.709V8.05ZM10.873 8.038H9.954V8.978H9.046V9.941H7.09V10.896H6.077V13.847H7.09V15.774H8.066V11.884H9.017V10.908H9.914V9.974H10.869V9.019H11.866V8.064H12.825V7.065H10.873V8.038ZM12.832 7.033H13.808V6.067H12.832V7.033ZM13.816 6.053H14.792V5.098H13.816V6.053ZM14.8 4.128V5.09H15.73V4.128H14.8Z" fill="currentColor" />
    </svg>
  );
}

function GitHubSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="m251.3 98.78v-15.49h-5.64v-11.77h-4.09v-9.89h-4.87v-4.87h-5.55v-10.28h-6.45v-7.82h-6.45v-7.24h-8.22v-5.76h-11.38v-5.65h-5.25v-4.49h-8.22v-4.1h-16.29v-5.25h-10.69v-5.17h-60.44v4.77h-10.29v5.25h-16.29v4.5h-9.89v5.26h-5.25v4.88h-10.29v6.45h-6.45v6.95h-6.45v6.45h-9.08v5.65h-5.26v10.07h-4.87v10.69h-4.49v11.37h-4.17v15.29h-5v60.64h5.25v16.29h4.87v10.69h4.1v9.68h8.21v10.29h5.26v7.24h7.24v7.24h4.88v7.44h6.85v5.65h14.25v6.05h10.29v8.22h10.98v4.9l15.2-0.1v-26.02h-25.78v-6.84h-5.26v-8.62h-6.85v-6.06h-7.24v-6.45h-6.46v-6.05h-6.45v-2.41h-4.48v-9.89h11.37v5.65h4.77v6.05h6.85v7.45h7.82v5.65h5.65v5.65h26.08v-10.29h6.05v-4.87h-11.08v-5.65h-10.69v-5.25h-9.89v-5.65h-5.25v-4.87h-5.65v-14.71h-5.65v-4.5h-9.03v-10.69h-5.65v-29.98h5.65v-10.69h4.5v-5.65h6.05v-30.98h4.87v-10.28h9.48v4.87h11.37v5.64h10.29v5.26h25.38v-5.26h20.11v5.26h25.38v-5.26h10.29v-5.64h10.28v-4.87h9.88v10.28h4.87v30.98h4.88v5.65h5.25v10.69h5.65v29.58h-5.25v14.29h-5.65v9.08h-5.26v5.65h-8.21v6.45h-6.05v6.05h-11.78v4.87h-8.68v7.24h-5.65v2.01h-5.25v1.61h5.65v51.52h15.29v-6.05h11.08v-6.05h10.29v-4.1h9.48v-6.05h6.05v-7.82h6.85v-7.65h7.44v-8.22h6.45v-6.45h5.26v-6.07h4.49v-8.68h5.26v-10.69h4.87v-15.69h4.56v-60.51h-4.66z" fill="currentColor" />
    </svg>
  );
}
