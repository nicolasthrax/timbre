import { Waveform } from "@/components/Waveform";
import { privacyPromise } from "@/content/landing";

/**
 * The clone-test recording flattening to a line as it scrolls: used once, then
 * deleted (globals.css, .recording-figure). Without scroll timelines, or with
 * reduced motion, it shows the waveform as it is.
 */
export function RecordingFigure() {
  return (
    <figure className="recording-figure mt-12 max-w-xl">
      <Waveform bars={40} seed={19} className="wave-flatten h-16" />
      <figcaption className="mt-3 text-sm text-muted">{privacyPromise.figure.caption}</figcaption>
    </figure>
  );
}
