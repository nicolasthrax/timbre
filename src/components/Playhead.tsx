/**
 * The scan line that crosses a waveform once (globals.css, .wave-playhead).
 * Place it inside a relatively positioned box that wraps the waveform.
 */
export function Playhead() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="wave-playhead" />
    </div>
  );
}
