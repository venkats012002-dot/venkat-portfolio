"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import KeyProjects, { type KeyProject } from "@/components/KeyProjects";
import Sides from "@/components/Sides";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import HiddenFooter from "@/components/HiddenFooter";
import LoadingScreen from "@/components/LoadingScreen";
import StickyWhit3fang from "@/components/StickyWhit3fang";
import ProgressBar from "@/components/ProgressBar";
import BackToTop from "@/components/BackToTop";
import ProgressiveBlur from "@/components/ProgressiveBlur";

// Module-scope flag: persists across client-side navigations within the same tab,
// reset on hard reload (loader reruns). No sessionStorage — we *want* reload to show it.
let hasShownLoader = false;

export default function HomeClient({ projects }: { projects: KeyProject[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(() => !hasShownLoader);

  return (
    <div
      style={{
        backgroundImage: "url(/images/forest-bg.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          perspective: "1500px",
          height: "100vh",
          width: "100vw",
          display: "flex",
        }}
      >
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div
          data-scroll-container
          className="home-cube-tilt"
          style={{
            flex: 1,
            height: "100vh",
            background: "#FFFFFF",
            transformOrigin: "left center",
            transform: sidebarOpen ? "perspective(1500px) rotateY(30deg)" : "none",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ProgressiveBlur position="top" />
          <ProgressiveBlur position="bottom" />
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <Hero />
          <KeyProjects projects={projects} />
          <Sides />
          <Testimonials />
          <Footer />
          <BackToTop />
          <HiddenFooter />
          <ProgressBar />
        </div>
      </div>
      <StickyWhit3fang />
      {showLoader && (
        <LoadingScreen
          onDone={() => {
            hasShownLoader = true;
            setShowLoader(false);
          }}
        />
      )}
    </div>
  );
}
