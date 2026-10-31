"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Plays the waveform intro (globals.css) once when this block is mostly on screen.
 * It only arms itself while still below the fold, so the waveform is never hidden
 * without JS, on reload mid-page, or under reduced motion.
 */
export function PlayOnView({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.armed = "";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.play = "";
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
