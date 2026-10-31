import type { CSSProperties } from "react";
import { Waveform } from "@/components/Waveform";
import { privacyPromise } from "@/content/landing";

/**
 * A recording flattening into the numbers we keep (globals.css, .voiceprint).
 * Without scroll timelines the numbers sit under the waveform instead of on it.
 */
export function VoiceprintFigure() {
  const { values, caption } = privacyPromise.voiceprint;
  return (
    <figure className="voiceprint mt-12 max-w-xl">
      <div className="relative">
        <Waveform bars={40} seed={19} className="wave-flatten h-16" />
        <ol aria-label="Example voiceprint values" className="voiceprint-values mt-3 flex justify-between tabular-nums text-sm">
          {values.map((v, i) => (
            <li key={i} className="bg-surface px-1" style={{ "--i": i } as CSSProperties}>
              {v}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}
