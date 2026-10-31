import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { type CSSProperties, Suspense } from "react";
import { ButtonLink } from "@/components/Button";
import { DeletedNotice } from "@/components/DeletedNotice";
import { PageTransition } from "@/components/PageTransition";
import { PointerLift } from "@/components/PointerLift";
import { PricingCards } from "@/components/PricingCards";
import { Waveform } from "@/components/Waveform";
import { faq } from "@/content/faq";
import {
  exampleScan,
  finalCta,
  founder,
  hero,
  platformsSection,
  pricingSection,
  privacyPromise,
  steps,
} from "@/content/landing";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  openGraph: { title: site.title, description: site.description },
};

function Section({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-border ${className ?? ""}`}>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">{children}</div>
    </section>
  );
}

function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return (
    <div className="max-w-copy">
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{children}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** The scan line that crosses the hero waveform once on load. */
function Playhead() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="wave-playhead" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <PageTransition>
      <Suspense fallback={null}>
        <DeletedNotice />
      </Suspense>

      {/* Hero: the waveform is the subject (DESIGN.md, direction C). The load sequence is in DESIGN.md, Motion. */}
      <section className="pb-20 pt-14 lg:pt-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:items-end">
          <h1 className="rise max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-display lg:col-span-3">
            {hero.headline}
          </h1>
          <p className="rise max-w-copy-narrow text-lg leading-relaxed text-muted lg:col-span-2"
            style={delay(120)}>
            {hero.subline}
          </p>
        </div>

        <figure className="mt-14" style={{ "--wave-start": "300ms" } as CSSProperties} aria-labelledby="example-caption">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ol className="relative hidden h-28 md:block" aria-label="Where the voice in this example was found">
              {exampleScan.found.map((f) => (
                <li
                  key={f.where}
                  className="note-drop absolute top-0 flex flex-col"
                  style={{ left: `${f.range[0] * 100}%`, "--at": f.range[0] } as CSSProperties}
                >
                  <span className="rounded-field border border-border bg-surface px-3 py-2 text-sm">
                    <span className="block font-bold">{f.where}</span>
                    <span className="block text-muted">{f.detail}</span>
                  </span>
                  <span aria-hidden data-connector className="ml-4 h-10 w-px bg-bar" />
                </li>
              ))}
            </ol>
            <div className="relative md:hidden">
              <Waveform bars={48} seed={7} intro className="h-28" highlight={exampleScan.found.map((f) => f.range)} />
              <Playhead />
            </div>
            <PointerLift className="relative hidden md:block">
              <Waveform
                bars={96}
                seed={7}
                intro
                className="h-40"
                highlight={exampleScan.found.map((f) => f.range)}
                label="A voice waveform with three highlighted stretches where the voice was found online"
              />
              <Playhead />
            </PointerLift>
            <ul className="mt-6 space-y-2 md:hidden">
              {exampleScan.found.map((f) => (
                <li key={f.where} className="note-drop text-sm" style={{ "--at": f.range[0] } as CSSProperties}>
                  <span className="font-bold">{f.where}</span> <span className="text-muted">{f.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption
            id="example-caption"
            className="rise mx-auto mt-4 max-w-6xl px-4 text-sm text-muted sm:px-6"
            style={delay(1600)}
          >
            Example scan. {exampleScan.line}
          </figcaption>
        </figure>

        <div
          className="rise mx-auto mt-12 flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-6"
          style={delay(400)}
        >
          <ButtonLink href="/signin" size="lg">
            {hero.cta}
          </ButtonLink>
          <p className="text-sm text-muted">{hero.reassurance}</p>
        </div>
      </section>

      <Section id="how-it-works">
        <SectionHeading>{steps.heading}</SectionHeading>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.items.map((step, i) => (
            <li key={step.title} className="border-t-2 border-text pt-5">
              <p className="text-sm font-bold text-muted">Step {i + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading>{founder.heading}</SectionHeading>
          </div>
          <figure className="max-w-copy lg:col-span-3">
            <blockquote className="text-2xl leading-snug text-pretty">“{founder.quote}”</blockquote>
            {founder.body.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <figcaption className="mt-6 text-sm">
              <span className="font-bold">{founder.name}</span>, <span className="text-muted">{founder.role}</span>
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section>
        <SectionHeading intro={platformsSection.intro}>{platformsSection.heading}</SectionHeading>
        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          {platformsSection.platforms.map((p) => (
            <div key={p.title}>
              <dt className="text-xl font-bold">{p.title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 max-w-copy text-muted">{platformsSection.note}</p>
      </Section>

      <Section id="privacy">
        <SectionHeading>{privacyPromise.heading}</SectionHeading>
        <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {privacyPromise.points.map((p) => (
            <div key={p.title} className="max-w-copy">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pricing">
        <SectionHeading intro={pricingSection.intro}>{pricingSection.heading}</SectionHeading>
        <div className="mt-12 max-w-4xl">
          <PricingCards />
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading>Questions</SectionHeading>
        <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.q} className="disclosure group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown aria-hidden className="size-5 shrink-0 text-muted transition-transform duration-250 ease-out group-open:rotate-180" />
              </summary>
              <p className="max-w-copy pb-6 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="max-w-copy text-3xl font-bold tracking-tight text-balance sm:text-4xl">{finalCta.heading}</h2>
        <p className="mt-4 max-w-copy text-lg text-muted">{finalCta.body}</p>
        <ButtonLink href="/signin" size="lg" className="mt-8">
          {hero.cta}
        </ButtonLink>
      </Section>
    </PageTransition>
  );
}
