"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only on devices that have a true hover (mouse / trackpad).
 * Touch devices fire phantom `:hover` on tap that sticks until tap-elsewhere
 * — gate hover-only effects (scale lifts, magnetic pulls) behind this.
 */
export function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    /** Syncs component state with the current hover-capable media query. */
    const update = () => setCanHover(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => {
      mediaQuery.removeEventListener?.("change", update);
    };
  }, []);

  return canHover;
}
