"use client";

import { useEffect, useState } from "react";

const CHENNAI = { lat: 13.0827, lon: 80.2707 };
const GEOLOCATION_TIMEOUT_MS = 5000;

const WMO_CONDITIONS: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Drizzle",
  57: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  66: "Rain",
  67: "Rain",
  71: "Snow",
  73: "Snow",
  75: "Snow",
  77: "Snow",
  80: "Showers",
  81: "Showers",
  82: "Showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

type WeatherData = {
  tempC: number;
  highC: number;
  lowC: number;
  condition: string;
};

type Status = "loading" | "ok" | "error";

async function getCoords(): Promise<{ lat: number; lon: number }> {
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

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  const json = await res.json();
  const code = json.current?.weather_code ?? 0;
  return {
    tempC: Math.round(json.current?.temperature_2m ?? 0),
    highC: Math.round(json.daily?.temperature_2m_max?.[0] ?? 0),
    lowC: Math.round(json.daily?.temperature_2m_min?.[0] ?? 0),
    condition: WMO_CONDITIONS[code] ?? "—",
  };
}

export default function Weather() {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { lat, lon } = await getCoords();
        const w = await fetchWeather(lat, lon);
        if (!cancelled) {
          setData(w);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tempText = status === "ok" && data ? `${data.tempC}°` : "—°";
  const conditionText =
    status === "loading" ? "Loading…" : status === "error" ? "Unavailable" : data!.condition;
  const rangeText =
    status === "ok" && data ? `H:${data.highC}° L:${data.lowC}°` : "";

  return (
    <div
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontSynthesis: "none",
        gap: 24,
        MozOsxFontSmoothing: "grayscale",
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        paddingBlock: 24,
        paddingInline: 58,
        WebkitFontSmoothing: "antialiased",
        width: "fit-content",
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 14,
        }}
      >
        <div
          suppressHydrationWarning
          style={{
            boxSizing: "border-box",
            color: "var(--color-neutral-8)",
            fontFamily: "var(--font-body)",
            fontSize: 60,
            lineHeight: "72px",
          }}
        >
          {tempText}
        </div>
        <div
          style={{
            alignItems: "start",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            suppressHydrationWarning
            style={{
              boxSizing: "border-box",
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: "18px",
              width: "fit-content",
            }}
          >
            {conditionText}
          </div>
          <div
            suppressHydrationWarning
            style={{
              boxSizing: "border-box",
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: "18px",
              minHeight: 18,
              width: "fit-content",
            }}
          >
            {rangeText}
          </div>
        </div>
      </div>
    </div>
  );
}
