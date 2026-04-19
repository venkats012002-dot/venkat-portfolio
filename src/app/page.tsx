"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Scene — perspective container with sidebar + main page as flex siblings */}
      <div
        style={{
          perspective: "1500px",
          height: "100vh",
          width: "100vw",
          display: "flex",
        }}
      >
        {/* Sidebar — flex child, width transitions from 0 to 280px */}
        <Sidebar open={sidebarOpen} />

        {/* Main page — cube face that rotates */}
        <div
          style={{
            flex: 1,
            height: "100vh",
            background: "#FFFFFF",
            transformOrigin: "left center",
            transform: sidebarOpen ? "perspective(1500px) rotateY(30deg)" : "none",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
          }}
        >
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </div>
    </div>
  );
}
