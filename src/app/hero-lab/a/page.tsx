import "@fontsource-variable/public-sans";
import type { Metadata } from "next";
import { HeroLabNav } from "@/components/HeroLabNav";
import { Waveform } from "@/components/Waveform";
import { heroLab } from "@/content/heroLab";
import "../hero-lab.css";

export const metadata: Metadata = { title: "Hero A: Start the scan", robots: { index: false } };

export default function HeroA() {
  return (
    <div className="hero-a min-h-dvh bg-hero-bg font-hero text-hero-ink">
      <HeroLabNav />
      <main id="main">
        <section data-hero className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
          <div>
            <h1 className="max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-hero-display">
              {heroLab.headline}
            </h1>
            <p className="mt-6 max-w-copy text-lg leading-relaxed text-hero-muted">{heroLab.subline}</p>

            <form action="/signin" className="mt-10 max-w-xl rounded-hero-card border border-hero-line bg-hero-surface p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="platform" className="mb-1.5 block text-sm font-medium">
                    Platform
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    className="h-12 w-full rounded-hero-field border border-hero-line bg-hero-surface px-3 text-hero-ink"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="handle" className="mb-1.5 block text-sm font-medium">
                    Your handle
                  </label>
                  <input
                    id="handle"
                    name="handle"
                    placeholder="@yourname"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-12 w-full rounded-hero-field border border-hero-line bg-hero-surface px-3 text-hero-ink placeholder:text-hero-muted"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 h-12 w-full rounded-hero-field bg-hero-action px-6 font-semibold text-hero-on-action hover:opacity-90"
              >
                {heroLab.cta}
              </button>
            </form>
            <p className="mt-3 text-sm text-hero-muted">{heroLab.reassurance}</p>
          </div>

          <aside aria-labelledby="example-heading" className="rounded-hero-card border border-hero-line bg-hero-surface p-6">
            <h2 id="example-heading" className="text-sm font-semibold text-hero-muted">
              Example report
            </h2>
            <p className="mt-2 text-xl font-semibold leading-snug">{heroLab.exampleLine}</p>
            <Waveform
              bars={56}
              seed={11}
              className="mt-6 h-16"
              litClassName="bg-hero-action"
              unlitClassName="bg-hero-line"
              highlight={[
                [0.06, 0.2],
                [0.42, 0.5],
                [0.66, 0.86],
              ]}
              label="Waveform with three highlighted stretches where your voice was found"
            />
            <ul className="mt-6 divide-y divide-hero-line border-t border-hero-line">
              {heroLab.exampleSources.map((s) => (
                <li key={s.where} className="flex items-baseline justify-between gap-4 py-3.5">
                  <span>
                    <span className="block font-medium">{s.where}</span>
                    <span className="block text-sm text-hero-muted">{s.who}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{s.seconds}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}
