"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RubiksCube from "./RubiksCube";
import { openControlCenter } from "@/hooks/useControlCenter";
import { useHoverLift } from "@/hooks/useHoverLift";

const NAV_LINKS = [
  { label: "Work", href: "/#keyprojects" },
  { label: "Explorations", href: "/explorations" },
  { label: "Sides", href: "/sides" },
  { label: "About", href: "/about" },
];

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [cubeHovered, setCubeHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Close menu when leaving mobile
  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  // ESC closes the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleRightButtonClick = () => {
    if (isMobile) {
      setMenuOpen((v) => !v);
    } else {
      openControlCenter();
    }
  };

  return (
    <nav
      className="site-nav"
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "space-between",
        paddingInline: "var(--nav-padding-x)",
        paddingTop: "var(--nav-padding-top)",
        position: "relative",
        zIndex: 60,
      }}
    >
      {/* Hamburger — Site Info sidebar trigger. Visible on both mobile and desktop. */}
      {onToggleSidebar ? (
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
      ) : (
        <div aria-hidden style={{ width: 32, height: 32, flexShrink: 0 }} />
      )}

      {/* Center nav links with Rubik's cube logo */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "var(--nav-center-gap)",
          justifyContent: "center",
        }}
      >
        <span className="is-desktop-only" style={{ display: "contents" }}>
          {NAV_LINKS.slice(0, 2).map((link) => (
            <NavLink key={link.label} href={link.href} label={link.label} />
          ))}
        </span>

        {/* Rubik's cube logo — animates on hover; on home, click replays the animation without navigating */}
        <a
          href={onToggleSidebar ? undefined : "/"}
          onClick={onToggleSidebar ? (e) => {
            e.preventDefault();
            setCubeHovered(true);
            setTimeout(() => setCubeHovered(false), 800);
          } : undefined}
          onMouseEnter={() => setCubeHovered(true)}
          onMouseLeave={() => setCubeHovered(false)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <RubiksCube size={48} animate={cubeHovered} />
        </a>

        <span className="is-desktop-only" style={{ display: "contents" }}>
          {NAV_LINKS.slice(2).map((link) => (
            <NavLink key={link.label} href={link.href} label={link.label} />
          ))}
        </span>
      </div>

      {/* Right slot: Control Centre on desktop, mobile menu trigger on mobile */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
          }}
          aria-label={isMobile ? (menuOpen ? "Close menu" : "Open menu") : "Open control centre"}
          aria-expanded={isMobile ? menuOpen : undefined}
          onClick={handleRightButtonClick}
        >
          {/* Desktop: Control Center icon */}
          <svg className="is-desktop-only" width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          {/* Mobile: crossfade between sidebar icon and X with a small rotation */}
          <span className="is-mobile-only" style={{ position: "relative", display: "inline-block", width: 24, height: 24 }}>
            <AnimatePresence initial={false} mode="wait">
              {menuOpen ? (
                <motion.svg
                  key="x"
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <path d="M3.20001 9.5871H6.40003V12.7871H3.20001V9.5871Z" fill="#101010" />
                  <path d="M0 12.8H3.20002V16H0V12.8Z" fill="#101010" />
                  <path d="M3.20001 3.20001H6.40003V6.40002H3.20001V3.20001Z" fill="#101010" />
                  <path d="M0 0H3.20002V3.20001H0V0Z" fill="#101010" />
                  <path d="M6.40002 6.38721H9.60004V9.58722H6.40002V6.38721Z" fill="#101010" />
                  <path d="M9.60645 9.59357H12.8065V12.7936H9.60645V9.59357Z" fill="#101010" />
                  <path d="M12.8001 12.8H16.0001V16H12.8001V12.8Z" fill="#101010" />
                  <path d="M9.60004 3.18701H12.8001V6.38702H9.60004V3.18701Z" fill="#101010" />
                  <path d="M12.8001 0H16.0001V3.20001H12.8001V0Z" fill="#101010" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="bars"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <path d="M8.72724 19.6369H6.54538H4.36359H2.18186H0L0 21.8186H2.18186H4.36359H6.54538H8.72724H10.909V19.6369H8.72724Z" fill="#333333"/>
                  <path d="M10.9092 24.0002V21.8184H13.091V24.0002H10.9092Z" fill="#333333"/>
                  <path d="M15.2726 21.8186H17.4544H19.6362H21.8181H23.9999V19.6369H21.8181H19.6362H17.4544H15.2726H13.0908V21.8186H15.2726Z" fill="#333333"/>
                  <path d="M10.9092 19.6365V17.4546H13.091V19.6365H10.9092Z" fill="#333333"/>
                  <path d="M2.18186 10.9092H0L0 13.091H2.18186H4.36359V10.9092H2.18186Z" fill="#333333"/>
                  <path d="M4.36328 15.2732V13.0913H6.54507V15.2732H4.36328Z" fill="#333333"/>
                  <path d="M8.72678 13.091H10.9086H13.0904H15.2722H17.454H19.6358L21.8177 13.091H23.9995V10.9092H21.8177H19.6358H17.454H15.2722H13.0904H10.9086H8.72678H6.54492V13.091H8.72678Z" fill="#333333"/>
                  <path d="M4.36328 10.9094V8.72761H6.54507V10.9094H4.36328Z" fill="#333333"/>
                  <path d="M15.2727 2.18213H13.0909H10.909L8.72724 2.18213H6.54538H4.36359L2.18186 2.18213H0L0 4.36399H2.18186H4.36359H6.54538L8.72724 4.36399H10.909H13.0909H15.2727H17.4545V2.18213H15.2727Z" fill="#333333"/>
                  <path d="M17.4541 6.54563V4.36391H19.6359V6.54563H17.4541Z" fill="#333333"/>
                  <path d="M21.8187 4.36399H24.0004V2.18213L21.8187 2.18213H19.6367V4.36399H21.8187Z" fill="#333333"/>
                  <path d="M17.4551 2.18186V-4.76837e-07H19.6369V2.18186H17.4551Z" fill="#333333"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
        </button>

        {/* Mobile dropdown menu — appears below the X */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div
              key="menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open:   { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
                zIndex: 2,
                transformOrigin: "top right",
                pointerEvents: "auto",
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  variants={{
                    open:   { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
                    closed: { opacity: 0, y: -6, scale: 0.96, filter: "blur(4px)" },
                  }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    backgroundColor: "#E8E8E8",
                    border: "1px solid #101010",
                    color: "#101010",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: "180%",
                    padding: "8px 16px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transformOrigin: "top right",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile dim overlay — fades the rest of the page to ~30% visibility */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            key="dim"
            aria-hidden
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const lift = useHoverLift();
  return (
    <a
      href={href}
      onMouseEnter={lift.onMouseEnter}
      onMouseLeave={lift.onMouseLeave}
      style={{
        color: "#101010",
        fontFamily: "var(--font-heading)",
        fontSize: "16px",
        fontWeight: 500,
        lineHeight: "20px",
        textDecoration: "none",
        ...lift.style,
        ...(label === "Sides" ? { flexShrink: 0, width: "40px" } : {}),
      }}
    >
      {label}
    </a>
  );
}
