"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const CHENNAI = { lat: 13.0843, lon: 80.2705, name: "Chennai" };
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const GEOLOCATION_TIMEOUT_MS = 5000;

function formatCoord(lat: number, lon: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

type Coords = { lat: number; lon: number; name?: string };

async function getCoords(): Promise<Coords> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return CHENNAI;
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(CHENNAI),
      { timeout: GEOLOCATION_TIMEOUT_MS, maximumAge: 10 * 60 * 1000 }
    );
  });
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || null;
  } catch {
    return null;
  }
}

export default function Location() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [city, setCity] = useState("");
  const [coord, setCoord] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const loc = await getCoords();
      if (cancelled) return;

      let cityName = loc.name ?? null;
      if (!cityName) {
        cityName = await reverseGeocode(loc.lat, loc.lon);
      }
      if (cancelled) return;

      setCity(cityName || "—");
      setCoord(formatCoord(loc.lat, loc.lon));

      if (!containerRef.current) return;

      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [loc.lon, loc.lat],
        zoom: 11,
        interactive: false,
        attributionControl: false,
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        boxSizing: "border-box",
        fontSynthesis: "none",
        height: 120,
        MozOsxFontSmoothing: "grayscale",
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        width: 280,
      }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          alignItems: "start",
          backgroundColor: "var(--color-neutral-light)",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          left: 0,
          outline: "1px solid var(--color-neutral-dark)",
          overflow: "clip",
          paddingBlock: 7,
          paddingInline: 8,
          position: "absolute",
          right: 0,
          top: 88,
        }}
      >
        <div
          suppressHydrationWarning
          style={{
            boxSizing: "border-box",
            color: "var(--color-neutral-dark)",
            flexShrink: 0,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          {city || "—"}
        </div>
        <div
          suppressHydrationWarning
          style={{
            boxSizing: "border-box",
            color: "var(--color-neutral-dark)",
            flexShrink: 0,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          {coord || "—"}
        </div>
      </div>
    </div>
  );
}
