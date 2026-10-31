import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { createRng } from "@/lib/random";

/** Deterministic speech-like envelope, so server and client render the same bars. */
export function waveformHeights(count: number, seed: number): number[] {
  const rng = createRng(seed);
  const raw = Array.from({ length: count }, (_, i) => {
    const phrase = 0.55 + 0.45 * Math.sin((i / count) * Math.PI * 5 + seed);
    return Math.max(0.08, phrase * (0.35 + rng() * 0.65));
  });
  return raw.map((v, i) => {
    const prev = raw[i - 1] ?? v;
    const next = raw[i + 1] ?? v;
    return Math.min(1, (prev + v * 2 + next) / 4 + 0.05);
  });
}

export interface WaveformProps {
  bars?: number;
  seed?: number;
  /** Live levels 0–1; overrides the generated envelope. */
  levels?: number[];
  /** Ranges (0–1 fractions) where the voice was found, drawn in the lit colour. */
  highlight?: [number, number][];
  /** Playback progress 0–1; bars before it are drawn in accent. */
  progress?: number;
  animated?: boolean;
  className?: string;
  /** Bar colours; default to accent (found) and bar (other audio). */
  litClassName?: string;
  unlitClassName?: string;
  /** Accessible description. Without it the waveform is decorative. */
  label?: string;
}

export function Waveform({
  bars = 64,
  seed = 7,
  levels,
  highlight = [],
  progress,
  animated = false,
  className,
  litClassName = "bg-accent",
  unlitClassName = "bg-bar",
  label,
}: WaveformProps) {
  const heights = levels && levels.length > 0 ? levels : waveformHeights(bars, seed);
  const count = heights.length;
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("flex h-24 w-full items-center gap-[3px]", className)}
    >
      {heights.map((h, i) => {
        const at = (i + 0.5) / count;
        const lit =
          highlight.some(([start, end]) => at >= start && at <= end) ||
          (progress !== undefined && at <= progress);
        return (
          <span
            key={i}
            className={cn(
              "min-w-[2px] flex-1 origin-center rounded-full transition-[height,background-color] duration-150",
              lit ? litClassName : unlitClassName,
              animated && "animate-wave",
            )}
            style={
              {
                height: `${Math.max(6, h * 100)}%`,
                animationDelay: animated ? `${(i % 16) * -0.1}s` : undefined,
                // Position and height for scroll-linked effects in globals.css (.wave-flatten).
                "--at": at.toFixed(3),
                "--h": Math.max(0.06, h).toFixed(3),
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
