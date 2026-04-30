"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STROKE_CONFIG = [
  { id: "fsig-1", duration: 0.6, delay: 0 },
  { id: "fsig-2", duration: 0.55, delay: 0.55 },
  { id: "fsig-3", duration: 0.5, delay: 1.05 },
  { id: "fsig-4", duration: 0.6, delay: 1.5 },
  { id: "fsig-5", duration: 0.9, delay: 2.05 },
  { id: "fsig-6", duration: 0.4, delay: 2.9 },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function penEasing(t: number) {
  if (t < 0.1) return t * t * 100 * 0.1;
  return easeOutCubic((t - 0.1) / 0.9) * 0.9 + 0.1;
}

export default function FooterSignature() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);

  // Initial state: paths fully hidden via stroke-dashoffset
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    STROKE_CONFIG.forEach(({ id }) => {
      const path = svg.querySelector<SVGPathElement>(`#${id}`);
      if (!path) return;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }, []);

  const animate = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    timeoutsRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timeoutsRef.current = [];
    rafsRef.current = [];

    STROKE_CONFIG.forEach(({ id, duration, delay }) => {
      const path = svg.querySelector<SVGPathElement>(`#${id}`);
      if (!path) return;

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const durMs = duration * 1000;
      const delayMs = delay * 1000;

      const t = setTimeout(() => {
        let start: number | null = null;
        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / durMs, 1);
          const eased = penEasing(progress);
          path.style.strokeDashoffset = `${length * (1 - eased)}`;
          if (progress < 1) {
            const raf = requestAnimationFrame(step);
            rafsRef.current.push(raf);
          }
        };
        const raf = requestAnimationFrame(step);
        rafsRef.current.push(raf);
      }, delayMs);
      timeoutsRef.current.push(t);
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || hasPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasPlayed(true);
            animate();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [animate, hasPlayed]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      rafsRef.current.forEach(cancelAnimationFrame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="230"
      height="135"
      viewBox="0 0 230 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ width: "81px", height: "48px", flexShrink: 0 }}
    >
      <g>
        <path id="fsig-1" d="M69.001 76.016C69.334 71.683 69.501 66.015 69.001 62.516M69.001 62.516C68.746 60.731 72.001 47.515 76.001 48.016C77.789 48.24 80.807 53.917 80.501 58.516C80.001 66.015 80.501 66.516 80.501 68.016C80.501 72.015 85.001 73.016 86.501 73.516M69.001 62.516C67.834 58.516 64.9 49.516 62.501 49.516" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
        <path id="fsig-2" d="M3 32.015C5 35.182 9.1 42.515 9.5 46.515C10.001 51.515 19 78.015 19.5 81.015C19.901 83.415 21.5 91.5 22 90.515C27.334 71.849 37.401 32.815 35.001 26.015" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
        <path id="fsig-3" d="M54.001 79.515C53.334 82.682 51.3 88.915 48.501 88.515C45.001 88.015 37.501 82.015 37.501 78.515C37.501 76.663 37.921 72.15 38.909 68.015M38.909 68.015C39.788 64.336 41.117 60.956 43.001 60.015C47.001 58.015 48.001 53.515 52.001 55.015C56.001 56.515 57.001 60.015 57.001 63.015C57.001 66.015 54.001 75.515 49.501 75.515C45.901 75.515 40.939 70.515 38.909 68.015Z" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
        <path id="fsig-4" d="M92.001 74.515C92.334 74.348 93.1 73.715 93.501 72.515C93.732 71.82 94.286 60.074 94.217 47.515M81.001 24.015C82.001 21.015 85.201 15.315 90.001 16.515C93.221 17.32 94.137 32.963 94.217 47.515M94.217 47.515C97.478 42.682 104.7 33.215 107.5 34.015C110.3 34.815 111.667 37.349 112 38.515C111.273 42.182 108.255 50.115 102 52.515M102 52.515C99.645 54.015 94.79 56.815 94.217 56.015M102 52.515C104.334 55.015 108.5 62.015 106.5 70.015C106.5 70.515 106.9 71.515 108.5 71.515" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
        <path id="fsig-5" d="M141.501 47.515C138.667 54.348 131.401 64.315 125.001 49.515C124.834 44.015 126.701 32.315 135.501 29.515C138.667 30.848 144.301 36.315 141.501 47.515ZM141.501 47.515C142.667 50.848 145.6 57.115 148 55.515C151 53.515 156.5 47.515 158 37.515C159.5 27.515 160 10.515 154 5.515C148 0.515 138 3.015 136.5 4.015C135 5.015 127 7.515 124 20.515C121 33.515 119.5 44.015 119.5 52.015C119.5 60.015 118 69.015 121 75.515C124 82.015 133 91.015 138.5 91.015C144 91.015 156.5 79.515 161 71.015C164.6 64.215 166 53.333 166 51" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
        <path id="fsig-6" d="M2.5 132.015C30.167 114.015 93.3 75.915 124.5 67.515C155.7 59.115 206.167 44.015 227.5 37.515" stroke="#999999" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
