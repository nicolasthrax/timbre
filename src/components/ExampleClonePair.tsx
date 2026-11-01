"use client";

import { type CSSProperties, useState } from "react";
import { ClonePlayer } from "@/components/ClonePlayer";
import { Playhead } from "@/components/Playhead";
import { PointerLift } from "@/components/PointerLift";
import { Waveform } from "@/components/Waveform";
import { exampleClone } from "@/content/landing";

// Same seed for both rows: the point of the hero is that a clone follows the real voice.
const SEED = 7;

/**
 * One static row. On load a scan line crosses it and the bars rise behind it
 * (globals.css, .wave-intro); the clone row starts later so it reads as following
 * the real voice. On wide screens the bars also lift near the mouse pointer.
 */
function StaticRow({ label, lit, startMs }: { label: string; lit: boolean; startMs: number }) {
  return (
    <div style={{ "--wave-start": `${startMs}ms` } as CSSProperties}>
      <p className="text-sm font-bold">{label}</p>
      {/* Each bar has a minimum width, so small screens get fewer bars rather than overflow. */}
      <div className="relative mt-2 sm:hidden">
        <Waveform bars={32} seed={SEED} intro className="h-14" highlight={lit ? [[0, 1]] : []} />
        <Playhead />
      </div>
      <PointerLift className="relative mt-2 hidden sm:block">
        <Waveform bars={72} seed={SEED} intro className="h-20" highlight={lit ? [[0, 1]] : []} />
        <Playhead />
      </PointerLift>
    </div>
  );
}

/** The landing hero's real/clone pair. Plays audio only once example recordings exist. */
export function ExampleClonePair() {
  const [active, setActive] = useState<"real" | "clone" | null>(null);
  const { realSrc, cloneSrc } = exampleClone;

  if (realSrc && cloneSrc) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <ClonePlayer label={exampleClone.realLabel} src={realSrc} seed={SEED} active={active === "real"} onPlay={() => setActive("real")} />
        <ClonePlayer
          label={exampleClone.cloneLabel}
          src={cloneSrc}
          seed={SEED}
          watermarked
          active={active === "clone"}
          onPlay={() => setActive("clone")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3" role="img" aria-label="Two matching voice waveforms: a real recording and its AI clone">
      <StaticRow label={exampleClone.realLabel} lit={false} startMs={300} />
      <StaticRow label={exampleClone.cloneLabel} lit startMs={700} />
    </div>
  );
}
