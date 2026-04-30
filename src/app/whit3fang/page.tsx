"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STRIP_STATES = [
  "Idle", "Idle2", "Dance", "Excited", "Eating", "Sleep", "Sleepy",
  "Cry", "Sad", "LayDown", "Waiting", "Surprised",
  "Box1", "Box2", "Box3", "DeadCat", "catsick1", "catsick2",
];

const FRAME_SIZE = 32;
const DISPLAY_SIZE = 320;

type SpriteState = {
  img: HTMLImageElement;
  frames: number;
  frameW: number;
  frameH: number;
  type: "strip" | "grid";
  row?: number;
};

type SwitchOpts = { force?: boolean; skipInactivity?: boolean };

export default function Whit3fangPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const statesRef = useRef<Record<string, SpriteState>>({});
  const currentStateRef = useRef("Idle");
  const currentFrameRef = useRef(0);
  const isDeadRef = useRef(false);
  const isVibingRef = useRef(false);
  const isMutedRef = useRef(false);
  const poisonStageRef = useRef(0);

  const switchStateRef = useRef<(name: string, opts?: SwitchOpts) => void>(() => {});

  const [poisonLabel, setPoisonLabel] = useState("Not for Feeding");
  const [poisonIcon, setPoisonIcon] = useState("/whit3fang/Poison.svg");
  const [showMute, setShowMute] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = DISPLAY_SIZE;
    canvas.height = DISPLAY_SIZE;
    ctx.imageSmoothingEnabled = false;

    let rafId: number | null = null;
    let lastFrameTime = 0;
    const frameInterval = 120;
    let loadedCount = 0;
    const totalToLoad = STRIP_STATES.length + 1;

    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      const state = statesRef.current[currentStateRef.current];
      if (!state) return;
      ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);

      if (state.type === "grid") {
        const sx = currentFrameRef.current * state.frameW;
        const sy = (state.row ?? 0) * state.frameH;
        ctx.drawImage(state.img, sx, sy, state.frameW, state.frameH, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
      } else {
        ctx.drawImage(state.img, currentFrameRef.current * state.frameW, 0, state.frameW, state.frameH, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
      }
      currentFrameRef.current = (currentFrameRef.current + 1) % state.frames;
    };

    const onLoaded = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) rafId = requestAnimationFrame(animate);
    };

    STRIP_STATES.forEach((name) => {
      const img = new Image();
      img.onload = () => {
        statesRef.current[name] = {
          img, frames: img.width / FRAME_SIZE, frameW: FRAME_SIZE, frameH: FRAME_SIZE, type: "strip",
        };
        onLoaded();
      };
      img.src = `/whit3fang/${name}.png`;
    });

    const bathImg = new Image();
    bathImg.onload = () => {
      statesRef.current["Bathtub"] = {
        img: bathImg, frames: 7, frameW: 64, frameH: 64, type: "grid", row: 0,
      };
      onLoaded();
    };
    bathImg.src = "/whit3fang/Bathtub.png";

    let inactiveTimer1: ReturnType<typeof setTimeout> | null = null;
    let inactiveTimer2: ReturnType<typeof setTimeout> | null = null;

    const stopMusic = () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
      isVibingRef.current = false;
      setShowMute(false);
    };

    const resetInactivity = () => {
      if (inactiveTimer1) clearTimeout(inactiveTimer1);
      if (inactiveTimer2) clearTimeout(inactiveTimer2);
      if (isDeadRef.current) return;
      inactiveTimer1 = setTimeout(() => {
        if (isDeadRef.current) return;
        stopMusic();
        currentStateRef.current = "Sleepy";
        currentFrameRef.current = 0;
        inactiveTimer2 = setTimeout(() => {
          if (!isDeadRef.current && currentStateRef.current === "Sleepy") {
            currentStateRef.current = "Sleep";
            currentFrameRef.current = 0;
          }
        }, 7000);
      }, 5000);
    };

    const switchState = (name: string, opts: SwitchOpts = {}) => {
      if (isDeadRef.current && name !== "Idle" && !opts.force) return;
      if (currentStateRef.current === "Dance" && name !== "Dance") stopMusic();
      if (name === "Dance") setShowMute(true);
      currentStateRef.current = name;
      currentFrameRef.current = 0;
      if (!opts.skipInactivity) resetInactivity();
    };
    switchStateRef.current = switchState;

    let faceClickCount = 0;
    let faceClickTimer: ReturnType<typeof setTimeout> | null = null;

    const onCanvasClick = (e: MouseEvent) => {
      if (isDeadRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (x > 0.2 && x < 0.8 && y > 0.1 && y < 0.6) {
        faceClickCount++;
        if (faceClickTimer) clearTimeout(faceClickTimer);
        if (faceClickCount >= 5) {
          switchState("Cry");
          faceClickCount = 0;
        } else if (faceClickCount >= 3) {
          switchState("Sad");
          faceClickTimer = setTimeout(() => { faceClickCount = 0; }, 2000);
          return;
        }
        faceClickTimer = setTimeout(() => { faceClickCount = 0; }, 2000);
      }
    };
    canvas.addEventListener("click", onCanvasClick);

    let lastAngle: number | null = null;
    let totalRotation = 0;
    let spinTimeout: ReturnType<typeof setTimeout> | null = null;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDeadRef.current) {
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        if (lastAngle !== null) {
          let delta = angle - lastAngle;
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          totalRotation += delta;
          if (Math.abs(totalRotation) > 6 * Math.PI) {
            switchState("Excited");
            totalRotation = 0;
            lastAngle = null;
            return;
          }
        }
        lastAngle = angle;
        if (spinTimeout) clearTimeout(spinTimeout);
        spinTimeout = setTimeout(() => { totalRotation = 0; lastAngle = null; }, 1000);
      }

      if (currentStateRef.current === "Sleepy" || currentStateRef.current === "Sleep") {
        currentStateRef.current = "Idle";
        currentFrameRef.current = 0;
      }
      resetInactivity();
    };
    document.addEventListener("mousemove", onMouseMove);

    const onDocClick = () => resetInactivity();
    document.addEventListener("click", onDocClick);

    resetInactivity();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (inactiveTimer1) clearTimeout(inactiveTimer1);
      if (inactiveTimer2) clearTimeout(inactiveTimer2);
      if (faceClickTimer) clearTimeout(faceClickTimer);
      if (spinTimeout) clearTimeout(spinTimeout);
      canvas.removeEventListener("click", onCanvasClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  const handleFeed = () => switchStateRef.current("Eating");
  const handleBox = () => {
    const boxes = ["Box1", "Box2", "Box3"];
    switchStateRef.current(boxes[Math.floor(Math.random() * 3)]);
  };
  const handleBath = () => switchStateRef.current("Bathtub");
  const handleVibe = () => {
    isVibingRef.current = true;
    switchStateRef.current("Dance");
    const a = audioRef.current;
    if (a && !isMutedRef.current) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  };
  const handlePoison = () => {
    const stage = poisonStageRef.current;
    if (stage === 0) {
      poisonStageRef.current = 1;
      setPoisonLabel("You Sure????");
      setPoisonIcon("/whit3fang/Arrow-right.svg");
    } else if (stage === 1) {
      poisonStageRef.current = 2;
      isDeadRef.current = true;
      switchStateRef.current("catsick2", { force: true, skipInactivity: true });
      setTimeout(() => {
        switchStateRef.current("catsick1", { force: true, skipInactivity: true });
        setTimeout(() => {
          switchStateRef.current("DeadCat", { force: true, skipInactivity: true });
          poisonStageRef.current = 3;
          setPoisonLabel("Revive");
          setPoisonIcon("/whit3fang/Bottle.svg");
        }, 3000);
      }, 3000);
    } else if (stage === 3) {
      isDeadRef.current = false;
      poisonStageRef.current = 0;
      setPoisonLabel("Not for Feeding");
      setPoisonIcon("/whit3fang/Poison.svg");
      switchStateRef.current("Idle");
    }
  };

  const toggleMute = () => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    const a = audioRef.current;
    if (!a) return;
    if (next) a.pause();
    else if (isVibingRef.current && currentStateRef.current === "Dance") a.play().catch(() => {});
  };

  return (
    <div style={{ minHeight: "100vh", padding: 48, position: "relative", background: "#FFFFFF" }}>
      <Link
        href="/"
        aria-label="Back"
        style={{ position: "absolute", top: 48, left: 48, width: 16, height: 19, display: "inline-block", cursor: "pointer" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/whit3fang/Arrow-Left.svg" alt="Back" width={16} height={19} />
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 128, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "#7A7A7A", marginBottom: 24 }}>Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ActionBtn text="Feed Him" icon="/whit3fang/Feed.svg" onClick={handleFeed} />
            <ActionBtn text="Box" icon="/whit3fang/Box.svg" onClick={handleBox} />
            <ActionBtn text={poisonLabel} icon={poisonIcon} onClick={handlePoison} />
            <ActionBtn text="Vibe" icon="/whit3fang/Vibe.svg" onClick={handleVibe} />
            <ActionBtn text="Bath" icon="/whit3fang/Bath.svg" onClick={handleBath} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, paddingTop: 48 }}>
          <canvas ref={canvasRef} style={{ imageRendering: "pixelated", cursor: "pointer" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "#7A7A7A", marginBottom: 24, textAlign: "right" }}>Interactive</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <HintBtn text="Sleepy" hint="Inactive 5s + 5s" />
            <HintBtn text="Sad" hint="Click on face - 3x" />
            <HintBtn text="Cry" hint="Click on face - 5x" />
            <HintBtn text="Excited" hint="spin cursor - 3x" />
          </div>
        </div>
      </div>

      <audio ref={audioRef} src="/whit3fang/gasolina.mp3" preload="auto" />

      {showMute && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          style={{
            position: "fixed", bottom: 48, left: "50%", transform: "translateX(-50%)",
            background: "#F2F2F2", border: "1px solid #E8E8E8",
            width: 48, height: 48, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E8E8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#F2F2F2"; }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L5 7H2V13H5L10 18V2Z" fill="#333" />
            {isMuted ? (
              <>
                <line x1="14" y1="7" x2="18" y2="13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="7" x2="14" y2="13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <path d="M14 7C14 7 16 8.5 16 10C16 11.5 14 13 14 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}

function ActionBtn({ text, icon, onClick }: { text: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 240, height: 60, background: "#F2F2F2", border: "1px solid #E8E8E8", borderRadius: 0,
        cursor: "pointer", display: "flex", alignItems: "center", padding: "0 24px 0 16px",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E8E8"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#F2F2F2"; }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#333333", flex: 1, textAlign: "left" }}>{text}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={20} height={20} style={{ flexShrink: 0 }} />
    </button>
  );
}

function HintBtn({ text, hint }: { text: string; hint: string }) {
  return (
    <div
      style={{
        width: 240, height: 60, background: "#F2F2F2", border: "1px solid #E8E8E8", borderRadius: 0,
        cursor: "default", display: "flex", alignItems: "center", padding: "0 24px 0 16px",
      }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#333333", flex: 1, textAlign: "left" }}>{text}</span>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 11, color: "#AAAAAA", marginLeft: "auto" }}>{hint}</span>
    </div>
  );
}
