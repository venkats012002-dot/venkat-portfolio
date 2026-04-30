"use client";

import { useEffect, useState } from "react";

const EVENT_NAME = "control-center:change";

let currentOpen = false;

function broadcast(next: boolean) {
  currentOpen = next;
  window.dispatchEvent(new CustomEvent<boolean>(EVENT_NAME, { detail: next }));
}

export function openControlCenter() {
  if (!currentOpen) broadcast(true);
}

export function closeControlCenter() {
  if (currentOpen) broadcast(false);
}

export function useControlCenter(): boolean {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(currentOpen);

    function onChange(e: Event) {
      setOpen((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  return open;
}
