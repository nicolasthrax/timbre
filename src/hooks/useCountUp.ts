"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts from 0 to `target` with an ease-out curve, one state update per frame.
 * Returns the target straight away on the server and under reduced motion.
 */
export function useCountUp(target: number, { decimals = 0, durationMs = 1100 } = {}): string {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(target * (1 - (1 - t) ** 4));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value.toFixed(decimals);
}
