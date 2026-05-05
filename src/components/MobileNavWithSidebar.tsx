"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Drop-in replacement for <Navbar /> on non-home pages.
 * On mobile (<=640px) it mounts the Sidebar as a fullscreen drawer
 * and wires the Navbar's hamburger button to toggle it. On desktop
 * it renders just the Navbar (no hamburger), matching the existing
 * behavior for pages that don't have the home cube tilt.
 */
export default function MobileNavWithSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      {isMobile && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Navbar
        onToggleSidebar={
          isMobile ? () => setSidebarOpen((v) => !v) : undefined
        }
      />
    </>
  );
}
