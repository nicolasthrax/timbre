import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/Button";
import { DeletedNotice } from "@/components/DeletedNotice";
import { FixExample } from "@/components/FixExample";
import { FounderStory } from "@/components/FounderStory";
import { PlatformTour } from "@/components/PlatformTour";
import { PricingCards } from "@/components/PricingCards";
import { RevealList } from "@/components/RevealList";
import { VoiceprintFigure } from "@/components/VoiceprintFigure";
import { Waveform } from "@/components/Waveform";
import { faq } from "@/content/faq";
import {
  exampleScan,
  finalCta,
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

/**
 * Sections are told apart by tone and space, not rules: the page alternates the
 * pale page colour and white, and the founder story sits on the ink band.
 */
function Section({
  id,
  children,
  tone = "page",
}: {
  id?: string;
  children: React.ReactNode;
  tone?: "page" | "surface";
}) {
  return (
    <section id={id} className={`scroll-mt-16 ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">{children}</div>
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

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DeletedNotice />
      </Suspense>

      {/* Hero: the waveform is the subject (DESIGN.md, direction C). */}
      <section className="pb-20 pt-14 lg:pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-display">
            {hero.headline}
          </h1>
        </div>

        <figure className="mt-14" aria-labelledby="example-caption">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ol className="relative hidden h-28 md:block" aria-label="Where the voice in this example was found">
              {exampleScan.found.map((f) => (
                <li key={f.where} className="absolute top-0 flex flex-col" style={{ left: `${f.range[0] * 100}%` }}>
                  <span className="rounded-field border border-border bg-surface px-3 py-2 text-sm">
                    <span className="block font-bold">{f.where}</span>
                    <span className="block text-muted">{f.detail}</span>
                  </span>
                  <span aria-hidden className="ml-4 h-10 w-px bg-bar" />
                </li>
              ))}
            </ol>
            <Waveform bars={48} seed={7} className="h-28 md:hidden" highlight={exampleScan.found.map((f) => f.range)} />
            <Waveform
              bars={96}
              seed={7}
              className="hidden h-40 md:flex"
              highlight={exampleScan.found.map((f) => f.range)}
              label="A voice waveform with three highlighted stretches where the voice was found online"
            />
            <ul className="mt-6 space-y-2 md:hidden">
              {exampleScan.found.map((f) => (
                <li key={f.where} className="text-sm">
                  <span className="font-bold">{f.where}</span> <span className="text-muted">{f.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption id="example-caption" className="mx-auto mt-4 max-w-6xl px-4 text-sm text-muted sm:px-6">
            Example scan. {exampleScan.line}
          </figcaption>
        </figure>

        <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-6">
          <ButtonLink href="/signin" size="lg">
            {hero.cta}
          </ButtonLink>
          <p className="text-sm text-muted">{hero.reassurance}</p>
        </div>
      </section>

      <Section id="how-it-works" tone="surface">
        <SectionHeading>{steps.heading}</SectionHeading>
        <RevealList className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.items.map((step, i) => (
            <li key={step.title} className="border-t-2 border-text pt-5">
              <p className="text-sm font-bold text-muted">Step {i + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </RevealList>
        <FixExample />
      </Section>

      <FounderStory />

      <Section>
        <SectionHeading intro={platformsSection.intro}>{platformsSection.heading}</SectionHeading>
        <PlatformTour
          stops={platformsSection.platforms.map((p, i) => ({ ...p, example: exampleScan.found[i] }))}
        />
        <p className="mt-10 max-w-copy text-muted">{platformsSection.note}</p>
      </Section>

      <Section id="privacy" tone="surface">
        <SectionHeading>{privacyPromise.heading}</SectionHeading>
        <VoiceprintFigure />
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

      <Section id="faq" tone="surface">
        <SectionHeading>Questions</SectionHeading>
        <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown aria-hidden className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
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
    </>
  );
}
