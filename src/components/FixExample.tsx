import type { CSSProperties } from "react";
import { Waveform } from "@/components/Waveform";
import { fixExample } from "@/content/landing";

// Lit stretches before and after fixing. The after set is a subset, so the
// overlay fading out reads as stretches going dark.
const BEFORE: [number, number][] = [
  [0.04, 0.12],
  [0.18, 0.26],
  [0.33, 0.4],
  [0.47, 0.55],
  [0.62, 0.7],
  [0.78, 0.9],
];
const AFTER: [number, number][] = [[0.78, 0.9]];

function Figure({ minutes, videos, counter }: { minutes: number; videos: number; counter?: CSSProperties }) {
  return (
    <p className="mt-2 flex items-baseline gap-2 tabular-nums">
      {counter ? (
        <>
          <span aria-hidden className="fix-count text-5xl font-bold tracking-tight" style={counter} />
          <span className="sr-only">{minutes}</span>
        </>
      ) : (
        <span className="text-5xl font-bold tracking-tight">{minutes}</span>
      )}
      <span className="text-muted">
        min in {videos} public videos
      </span>
    </p>
  );
}

/**
 * Before and after fixing, side by side. As the pair scrolls up, the "after"
 * figure counts down from the before value and the fixed stretches go dark
 * (globals.css, .fix-example). Without scroll timelines it shows the after state.
 */
export function FixExample() {
  const { before, after } = fixExample;
  return (
    <figure className="mt-20">
      <h3 className="text-xl font-bold">{fixExample.heading}</h3>
      <div className="fix-example mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card bg-bg p-5 sm:p-6">
          <p className="text-sm text-muted">{before.label}</p>
          <Figure minutes={before.minutes} videos={before.videos} />
          <Waveform bars={48} seed={13} highlight={BEFORE} className="mt-5 h-14" />
        </div>
        <div className="rounded-card bg-bg p-5 sm:p-6">
          <p className="text-sm text-muted">{after.label}</p>
          <Figure
            minutes={after.minutes}
            videos={after.videos}
            counter={{ "--fix-from": before.minutes, "--fix-min": after.minutes, "--fix-to": after.minutes } as CSSProperties}
          />
          <div className="relative mt-5">
            <Waveform bars={48} seed={13} highlight={AFTER} className="h-14" />
            <Waveform bars={48} seed={13} highlight={BEFORE} className="fix-fade absolute inset-0 h-14 opacity-0" />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 max-w-copy text-sm text-muted">{fixExample.caption}</figcaption>
    </figure>
  );
}
