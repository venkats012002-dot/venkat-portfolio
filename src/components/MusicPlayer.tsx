"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/here-comes-the-sun.mp3";
const ALBUM_SRC = "/images/abbey-road.png";
const DISPLAY_DURATION = 30;

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }

  const timeText = isPlaying
    ? formatTime(DISPLAY_DURATION - currentTime)
    : formatTime(DISPLAY_DURATION);

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: 120,
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        position: "relative",
        width: 255,
      }}
    >
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      <svg
        width="179"
        height="114"
        viewBox="0 0 179 114"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ left: 42, top: 15, position: "absolute" }}
      >
        <defs>
          <clipPath id="music-album-clip">
            <circle cx="56.5" cy="62.5" r="18" />
          </clipPath>
        </defs>

        <path
          d="M113 1.5L113 113.5M0.5 6.5C0.5 3.739 2.739 1.5 5.5 1.5H173.5C176.261 1.5 178.5 3.739 178.5 6.5V108.5C178.5 111.262 176.261 113.5 173.5 113.5H5.5C2.739 113.5 0.5 111.262 0.5 108.5V6.5Z"
          stroke="#000000"
        />

        <g
          className={isPlaying ? "music-reel music-reel--spinning" : "music-reel"}
        >
          <circle cx="56.5" cy="62.5" r="44" fill="#000000" />
          <circle cx="56.5" cy="62.5" r="26" fill="#EF1D26" />
          <image
            href={ALBUM_SRC}
            x="38.5"
            y="44.5"
            width="36"
            height="36"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#music-album-clip)"
          />
          <circle cx="56.5" cy="62.5" r="5.5" fill="#FFFFFF" stroke="#000000" />
        </g>

        <g
          onClick={handleToggle}
          role="button"
          aria-label={isPlaying ? "Stop" : "Play Here Comes the Sun"}
          aria-pressed={isPlaying}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          className={isPlaying ? "music-knob music-knob--active" : "music-knob"}
        >
          <path d="M140.104 20.603C136.244 26.729 128.148 28.566 122.022 24.705C115.895 20.845 114.059 12.749 117.919 6.623C121.78 0.497 129.876 -1.34 136.002 2.521C142.128 6.381 143.965 14.477 140.104 20.603Z" fill="#FFFFFF" />
          <path d="M122.95 11.114L85.146 10.323L85.233 13.699L122.69 15.348C122.69 15.348 122.418 14.06 122.466 13.23C122.515 12.384 122.95 11.114 122.95 11.114Z" fill="#FFFFFF" />
          <path d="M153.14 12.213H135.416C135.416 12.213 135.602 13.339 135.553 14.061C135.505 14.773 135.176 15.848 135.176 15.848L152.727 16.381L153.14 12.213Z" fill="#FFFFFF" />
          <path d="M152.917 18.715L153.346 10.129L167.64 10.282L167.211 18.867L152.917 18.715Z" fill="#FFFFFF" />
          <path d="M134.558 17.108C132.628 20.171 128.58 21.089 125.517 19.159C122.454 17.229 121.535 13.181 123.465 10.118C125.396 7.055 129.444 6.136 132.507 8.067C135.57 9.997 136.488 14.045 134.558 17.108Z" fill="#FFFFFF" />
          <path d="M85.103 8.635L73.538 8.543L73.522 12.96L79.068 16.455L79.671 14.621L85.13 14.741L85.103 8.635Z" fill="#FFFFFF" />
          <path d="M75.177 21.752L78.672 16.206L65.995 8.217L64.248 10.99L62.5 13.763L75.177 21.752Z" fill="#FFFFFF" />
          <path d="M64.248 10.99L62.5 13.763L75.177 21.752L78.672 16.206L65.995 8.217L64.248 10.99ZM64.248 10.99L70.19 14.735M140.104 20.603C136.244 26.729 128.148 28.566 122.022 24.705C115.895 20.845 114.059 12.749 117.919 6.623C121.78 0.497 129.876 -1.34 136.002 2.521C142.128 6.381 143.965 14.477 140.104 20.603ZM85.146 10.323L122.95 11.114C122.95 11.114 122.515 12.384 122.466 13.23C122.418 14.06 122.69 15.348 122.69 15.348L85.233 13.699L85.146 10.323ZM135.416 12.213H153.14L152.727 16.381L135.176 15.848C135.176 15.848 135.505 14.773 135.553 14.061C135.602 13.339 135.416 12.213 135.416 12.213ZM153.346 10.129L152.917 18.715L167.211 18.867L167.64 10.282L153.346 10.129ZM134.558 17.108C132.628 20.171 128.58 21.089 125.517 19.159C122.454 17.229 121.535 13.181 123.465 10.118C125.396 7.055 129.444 6.136 132.507 8.067C135.57 9.997 136.488 14.045 134.558 17.108ZM73.538 8.543L85.103 8.635L85.13 14.741L79.671 14.621L79.068 16.455L73.522 12.96L73.538 8.543Z" stroke="#000000" />
        </g>

        <g>
          <circle cx="125.611" cy="96.611" r="5.611" fill="#FFFFFF" stroke="#000000" />
          <path d="M129.754 100.754L121.364 92.831" stroke="#000000" />
          <circle cx="125.611" cy="96.611" r="2.556" fill="#FFFFFF" stroke="#000000" />
        </g>

        <path
          d="M158.5 43.5V66M158.5 66H153.5V71H164V70.5M158.5 66H164V67M164 67H167M164 67V70.5M164 70.5H167M163.5 44H167M163.5 47.5H167M163.5 51.5H167M163.5 55.5H167M163.5 59.5H167M163.5 63H167M150.5 40.5C150.5 39.948 150.948 39.5 151.5 39.5H169.5C170.052 39.5 170.5 39.948 170.5 40.5V74.5C170.5 75.052 170.052 75.5 169.5 75.5H151.5C150.948 75.5 150.5 75.052 150.5 74.5V40.5Z"
          stroke="#000000"
        />

        <text
          x="144.727"
          y="100.76"
          fill="#000000"
          fontFamily='"GeistPixel-Square", "Geist Pixel", system-ui, sans-serif'
          fontSize="12"
        >
          {timeText}
        </text>
      </svg>
    </div>
  );
}
