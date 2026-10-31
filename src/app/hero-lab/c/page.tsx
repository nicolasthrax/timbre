import "@fontsource-variable/atkinson-hyperlegible-next";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroLabNav } from "@/components/HeroLabNav";
import { Waveform } from "@/components/Waveform";
import { heroLab } from "@/content/heroLab";
import "../hero-lab.css";

export const metadata: Metadata = { title: "Hero C: Where it was found", robots: { index: false } };

/** Lit stretches of the waveform, each paired with one example source. */
const FOUND: { range: [number, number]; index: number }[] = [
  { range: [0.08, 0.2], index: 0 },
  { range: [0.44, 0.5], index: 1 },
  { range: [0.7, 0.9], index: 2 },
];

export default function HeroC() {
  return (
    <div className="hero-c min-h-dvh bg-hero-bg font-hero text-hero-ink">
      <HeroLabNav />
      <main id="main">
        <section data-hero className="pb-20 pt-16 lg:pt-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-5 lg:items-end">
            <h1 className="max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-hero-display lg:col-span-3">
              {heroLab.headline}
            </h1>
            <p className="max-w-copy-narrow lg:col-span-2 text-lg leading-relaxed text-hero-muted">{heroLab.subline}</p>
          </div>

          <figure className="mt-16" aria-labelledby="scan-caption">
            <div className="mx-auto max-w-6xl px-6">
              <ol className="relative hidden h-28 md:block" aria-label="Where the voice in this example was found">
                {FOUND.map(({ range, index }) => {
                  const source = heroLab.exampleSources[index];
                  return (
                    <li
                      key={source.where}
                      className="absolute top-0 flex flex-col"
                      style={{ left: `${range[0] * 100}%` }}
                    >
                      <span className="rounded-hero-card border border-hero-line bg-hero-surface px-3 py-2 text-sm">
                        <span className="block font-bold">{source.where}</span>
                        <span className="block text-hero-muted">
                          {source.who}, {source.seconds}
                        </span>
                      </span>
                      <span aria-hidden className="ml-4 h-10 w-px bg-hero-line" />
                    </li>
                  );
                })}
              </ol>
              <Waveform
                bars={48}
                seed={7}
                className="h-28 md:hidden"
                litClassName="bg-hero-action"
                unlitClassName="bg-hero-line"
                highlight={FOUND.map((f) => f.range)}
              />
              <Waveform
                bars={96}
                seed={7}
                className="hidden h-40 md:flex"
                litClassName="bg-hero-action"
                unlitClassName="bg-hero-line"
                highlight={FOUND.map((f) => f.range)}
                label="A long voice waveform with three highlighted stretches where the voice was found online"
              />
              <ul className="mt-6 space-y-2 md:hidden">
                {heroLab.exampleSources.map((s) => (
                  <li key={s.where} className="text-sm">
                    <span className="font-bold">{s.where}</span>{" "}
                    <span className="text-hero-muted">
                      {s.who}, {s.seconds}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption id="scan-caption" className="mx-auto mt-4 max-w-6xl px-6 text-sm text-hero-muted">
              Example scan. {heroLab.exampleLine}
            </figcaption>
          </figure>

          <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6">
            <Link
              href="/signin"
              className="inline-flex h-12 items-center rounded-hero-field bg-hero-action px-6 font-bold text-hero-on-action hover:opacity-90"
            >
              {heroLab.cta}
            </Link>
            <p className="text-sm text-hero-muted">{heroLab.reassurance}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
