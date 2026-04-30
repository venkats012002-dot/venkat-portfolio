"use client";

import { useEffect } from "react";
import Clock from "./Clock";
import Weather from "./Weather";
import Location from "./Location";
import DiscoButton from "./DiscoButton";
import PixelCheckerboard from "./PixelCheckerboard";
import SoundSettings from "./SoundSettings";
import MusicPlayer from "./MusicPlayer";
import Whit3fangCard from "./Whit3fangCard";
import ClickInteractionToggle from "./ClickInteractionToggle";
import ColorSwatcher from "./ColorSwatcher";
import QuoteDispenser from "./QuoteDispenser";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

export default function ControlCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          backdropFilter: open ? "blur(12px)" : "blur(0px)",
          backgroundColor: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0)",
          inset: 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          position: "fixed",
          transition: `backdrop-filter 0.3s ease, background-color 0.3s ease, opacity 0.25s ease`,
          zIndex: 1500,
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Control Center"
        style={{
          backgroundColor: "#EDEDED",
          boxSizing: "border-box",
          fontSynthesis: "none",
          height: 429,
          left: "50%",
          MozOsxFontSmoothing: "grayscale",
          opacity: open ? 1 : 0,
          outline: "1px solid #7A7A7A",
          pointerEvents: open ? "auto" : "none",
          position: "fixed",
          scale: open ? "1" : "0.96",
          top: "50%",
          transition: `opacity 0.25s ease, scale 0.3s ${EASE_OUT}`,
          translate: "-50% -50%",
          WebkitFontSmoothing: "antialiased",
          width: 781,
          zIndex: 1501,
        }}
      >
        <Header onClose={onClose} />

        <div
          style={{
            backgroundColor: "#FFFFFF",
            boxSizing: "border-box",
            height: 365,
            left: 8,
            outline: "1px solid #101010",
            position: "absolute",
            top: 56,
            width: 765,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Clock />
          </div>
          <div style={{ position: "absolute", left: 121, top: 0 }}>
            <Weather />
          </div>
          <div style={{ position: "absolute", left: 427, top: 0 }}>
            <Location />
          </div>
          <div style={{ position: "absolute", left: 707, top: 0 }}>
            <DiscoButton />
          </div>

          <div style={{ position: "absolute", left: 0, top: 121 }}>
            <PixelCheckerboard />
          </div>
          <div style={{ position: "absolute", left: 121, top: 121 }}>
            <SoundSettings />
          </div>
          <div style={{ position: "absolute", left: 510, top: 121 }}>
            <MusicPlayer />
          </div>

          <div style={{ position: "absolute", left: 0, top: 242 }}>
            <Whit3fangCard />
          </div>
          <div style={{ position: "absolute", left: 151, top: 242 }}>
            <ClickInteractionToggle />
          </div>
          <div style={{ position: "absolute", left: 151, top: 287 }}>
            <ColorSwatcher />
          </div>
          <div style={{ position: "absolute", left: 292, top: 242 }}>
            <QuoteDispenser width={473} height={123} />
          </div>
        </div>
      </div>
    </>
  );
}

function LineStack({ width }: { width: number }) {
  return (
    <div
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            boxSizing: "border-box",
            flexShrink: 0,
            height: 0,
            outline: "1px solid #101010",
            width,
          }}
        />
      ))}
    </div>
  );
}

function SettingsIcon() {
  return (
    <div
      aria-hidden
      style={{
        boxSizing: "border-box",
        flexShrink: 0,
        height: 40,
        outline: "1px solid #101010",
        position: "relative",
        width: 40,
      }}
    >
      <svg
        width="31"
        height="34"
        viewBox="0 0 31 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ left: 9, top: 8, width: 22, height: "auto", position: "absolute" }}
      >
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
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      style={{
        background: "none",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        flexShrink: 0,
        height: 40,
        outline: "1px solid #101010",
        padding: 0,
        position: "relative",
        width: 40,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ left: 12, top: 12, width: 16, height: "auto", position: "absolute" }}
      >
        <path d="M3.2 9.587H6.4V12.787H3.2V9.587Z" fill="#000000" />
        <path d="M0 12.8H3.2V16H0V12.8Z" fill="#000000" />
        <path d="M3.2 3.2H6.4V6.4H3.2V3.2Z" fill="#000000" />
        <path d="M0 0H3.2V3.2H0V0Z" fill="#000000" />
        <path d="M6.4 6.387H9.6V9.587H6.4V6.387Z" fill="#000000" />
        <path d="M9.606 9.594H12.806V12.794H9.606V9.594Z" fill="#000000" />
        <path d="M12.8 12.8H16V16H12.8V12.8Z" fill="#000000" />
        <path d="M9.6 3.187H12.8V6.387H9.6V3.187Z" fill="#000000" />
        <path d="M12.8 0H16V3.2H12.8V0Z" fill="#000000" />
      </svg>
    </button>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: 17,
        left: "50%",
        position: "absolute",
        top: 8,
        translate: "-50%",
      }}
    >
      <div style={{ alignItems: "center", boxSizing: "border-box", display: "flex", gap: 1 }}>
        <LineStack width={40} />
        <SettingsIcon />
        <LineStack width={227} />
      </div>

      <div
        style={{
          boxSizing: "border-box",
          color: "#101010",
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: "22px",
          whiteSpace: "nowrap",
        }}
      >
        Control Center
      </div>

      <div style={{ alignItems: "center", boxSizing: "border-box", display: "flex", gap: 2 }}>
        <LineStack width={227} />
        <CloseButton onClose={onClose} />
        <LineStack width={40} />
      </div>
    </div>
  );
}
