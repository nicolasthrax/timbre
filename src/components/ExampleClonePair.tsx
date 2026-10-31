"use client";

import { useState } from "react";
import { ClonePlayer } from "@/components/ClonePlayer";
import { Waveform } from "@/components/Waveform";
import { exampleClone } from "@/content/landing";

// Same seed for both rows: the point of the hero is that a clone follows the real voice.
const SEED = 7;

function StaticRow({ label, lit }: { label: string; lit: boolean }) {
  return (
    <div>
      <p className="text-sm font-bold">{label}</p>
      {/* Each bar has a minimum width, so small screens get fewer bars rather than overflow. */}
      <Waveform bars={32} seed={SEED} className="mt-2 h-14 sm:hidden" highlight={lit ? [[0, 1]] : []} />
      <Waveform bars={72} seed={SEED} className="mt-2 hidden h-20 sm:flex" highlight={lit ? [[0, 1]] : []} />
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
      <StaticRow label={exampleClone.realLabel} lit={false} />
      <StaticRow label={exampleClone.cloneLabel} lit />
    </div>
  );
}
