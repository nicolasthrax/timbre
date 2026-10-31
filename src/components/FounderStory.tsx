import { Waveform, waveformHeights } from "@/components/Waveform";
import { founder } from "@/content/landing";
import { createRng } from "@/lib/random";

const SEED = 41;
const BARS = 40;

/** The founder's voice and a near-identical copy: same envelope, small per-bar drift. */
function copiedLevels(): number[] {
  const rng = createRng(SEED + 1);
  return waveformHeights(BARS, SEED).map((h) => Math.min(1, Math.max(0.08, h * (0.88 + rng() * 0.24))));
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

/**
 * "Why Timbre exists" on the ink band: the quote is the subject, and the two
 * waveforms show why it happened (a public voice and its copy look alike).
 */
export function FounderStory() {
  return (
    <section aria-labelledby="founder-heading" className="bg-ink text-on-ink">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <h2 id="founder-heading" className="text-lg font-bold text-on-ink-muted">
          {founder.heading}
        </h2>

        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <figure className="lg:col-span-7">
            <blockquote className="text-3xl leading-tight text-pretty sm:text-4xl">“{founder.quote}”</blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-on-ink font-bold text-ink"
              >
                {initials(founder.name)}
              </span>
              <span className="text-sm">
                <span className="block font-bold">{founder.name}</span>
                <span className="block text-on-ink-muted">{founder.role}</span>
              </span>
            </figcaption>
          </figure>

          <figure className="self-end lg:col-span-5">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-on-ink-muted">{founder.voices.real}</p>
                <Waveform bars={BARS} seed={SEED} highlight={[[0, 1]]} litClassName="bg-accent-on-ink" className="mt-2 h-14" />
              </div>
              <div>
                <p className="text-sm text-on-ink-muted">{founder.voices.copy}</p>
                <Waveform levels={copiedLevels()} unlitClassName="bg-on-ink-muted" className="mt-2 h-14" />
              </div>
            </div>
            <figcaption className="mt-6 max-w-sm text-sm text-on-ink-muted">{founder.voices.caption}</figcaption>
          </figure>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-12">
          {founder.body.map((p) => (
            <p key={p} className="max-w-copy text-lg leading-relaxed text-on-ink-muted">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
