"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Lifts waveform bars near a mouse pointer (CSS in globals.css, .wave-react).
 * Writes one custom property per frame; touch and pen input are ignored so
 * scrolling on phones never triggers it.
 */
export function PointerLift({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function setPosition(px: number) {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => ref.current?.style.setProperty("--px", px.toFixed(3)));
  }

  return (
    <div
      ref={ref}
      className={cn("wave-react", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        setPosition((e.clientX - box.left) / box.width);
      }}
      onPointerLeave={() => setPosition(-1)}
    >
      {children}
    </div>
  );
}
