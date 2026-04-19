"use client";

import { useState } from "react";
import RubiksCube from "./RubiksCube";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Explorations", href: "/explorations" },
  { label: "Sides", href: "/sides" },
  { label: "About", href: "/about" },
];

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [cubeHovered, setCubeHovered] = useState(false);

  return (
    <nav
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "space-between",
        paddingInline: "32px",
        paddingTop: "24px",
      }}
    >
      {/* Hamburger — cube sidebar trigger (static for now) */}
      <button
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          flexShrink: 0,
        }}
        aria-label="Open sidebar"
        onClick={onToggleSidebar}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.8 4.8H9.6V8H12.8V4.8Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M17.6 9.6H14.4V12.8H17.6V9.6Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M17.6 14.4H14.4V22.4H17.6V14.4Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M22.4 4.8H19.2V8H22.4V4.8Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M12.8 24H9.6V27.2H12.8V24Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M8 9.6H4.8V12.8H8V9.6Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M25.6 6.4H22.4V9.6H25.6V6.4Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M27.2 9.6H24V12.8H27.2V9.6Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M9.6 22.4H6.4V25.6H9.6V22.4Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M8 19.2H4.8V22.4H8V19.2Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M25.6 22.4H22.4V25.6H25.6V22.4Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M22.4 24H19.2V27.2H22.4V24Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M27.2 19.2H24V22.4H27.2V19.2Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6.4 12.8H3.2V19.2H6.4V12.8Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M28.8 12.8H25.6V19.2H28.8V12.8Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M19.2 25.6H12.8V28.8H19.2V25.6Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M19.2 3.2H12.8V6.4H19.2V3.2Z" fill="#333333" />
          <path fillRule="evenodd" clipRule="evenodd" d="M9.6 6.4H6.4V9.6H9.6V6.4Z" fill="#333333" />
        </svg>
      </button>

      {/* Center nav links with Rubik's cube logo */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "72px",
          justifyContent: "center",
        }}
      >
        {NAV_LINKS.slice(0, 2).map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: "#101010",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "20px",
              textDecoration: "none",
            }}
          >
            {link.label}
          </a>
        ))}

        {/* Rubik's cube logo — V default, animates on hover */}
        <a
          href="/"
          onMouseEnter={() => setCubeHovered(true)}
          onMouseLeave={() => setCubeHovered(false)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <RubiksCube size={48} animate={cubeHovered} />
        </a>

        {NAV_LINKS.slice(2).map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: "#101010",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "20px",
              textDecoration: "none",
              ...(link.label === "Sides" ? { flexShrink: 0, width: "40px" } : {}),
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Control Centre icon (static for now) */}
      <button
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          flexShrink: 0,
        }}
        aria-label="Open control centre"
      >
        <svg width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2.331" y1="1.613" x2="2.331" y2="20.795" stroke="#333333" strokeWidth="1.613" />
          <line x1="5.557" y1="4.841" x2="5.557" y2="17.659" stroke="#333333" strokeWidth="1.613" />
          <line x1="24.739" y1="4.841" x2="24.739" y2="17.659" stroke="#333333" strokeWidth="1.613" />
          <line x1="0.807" y1="25.636" x2="0.807" y2="32.09" stroke="#333333" strokeWidth="1.613" />
          <line x1="5.557" y1="22.409" x2="5.557" y2="24.022" stroke="#333333" strokeWidth="1.613" />
          <line x1="12.011" y1="7.978" x2="12.011" y2="9.591" stroke="#333333" strokeWidth="1.613" />
          <line x1="18.375" y1="7.978" x2="18.375" y2="9.591" stroke="#333333" strokeWidth="1.613" />
          <line x1="18.375" y1="11.204" x2="18.375" y2="12.818" stroke="#333333" strokeWidth="1.613" />
          <line x1="11.921" y1="11.204" x2="11.921" y2="12.818" stroke="#333333" strokeWidth="1.613" />
          <line x1="24.739" y1="22.409" x2="24.739" y2="24.022" stroke="#333333" strokeWidth="1.613" />
          <line x1="5.557" y1="27.249" x2="5.557" y2="30.386" stroke="#333333" strokeWidth="1.613" />
          <line x1="7.17" y1="27.249" x2="7.17" y2="30.386" stroke="#333333" strokeWidth="1.613" />
          <line x1="29.49" y1="25.636" x2="29.49" y2="32.09" stroke="#333333" strokeWidth="1.613" />
          <line x1="3.137" y1="0.807" x2="27.159" y2="0.807" stroke="#333333" strokeWidth="1.613" />
          <line x1="3.137" y1="21.602" x2="27.159" y2="21.602" stroke="#333333" strokeWidth="1.613" />
          <line x1="17.479" y1="28.056" x2="25.546" y2="28.056" stroke="#333333" strokeWidth="1.613" />
          <line x1="12.728" y1="13.624" x2="17.569" y2="13.624" stroke="#333333" strokeWidth="1.613" />
          <line x1="4.751" y1="18.465" x2="25.546" y2="18.465" stroke="#333333" strokeWidth="1.613" />
          <line x1="4.751" y1="4.034" x2="25.546" y2="4.034" stroke="#333333" strokeWidth="1.613" />
          <line y1="24.829" x2="30.297" y2="24.829" stroke="#333333" strokeWidth="1.613" />
          <line y1="32.807" x2="30.297" y2="32.807" stroke="#333333" strokeWidth="1.613" />
          <line x1="27.966" y1="1.613" x2="27.966" y2="20.795" stroke="#333333" strokeWidth="1.613" />
        </svg>
      </button>
    </nav>
  );
}
