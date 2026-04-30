"use client";

import AccentBridge from "./AccentBridge";
import AccentShortcuts from "./AccentShortcuts";
import DiscoMode from "./DiscoMode";
import ClickBurst from "./ClickBurst";
import ControlCenter from "./ControlCenter";
import TopCloud from "./TopCloud";
import { useControlCenter, closeControlCenter } from "@/hooks/useControlCenter";

export default function GlobalChrome() {
  const open = useControlCenter();
  return (
    <>
      <AccentBridge />
      <AccentShortcuts />
      <DiscoMode />
      <ClickBurst />
      <TopCloud />
      <ControlCenter open={open} onClose={closeControlCenter} />
    </>
  );
}
