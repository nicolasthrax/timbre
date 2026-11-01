import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/Button";
import { DeletedNotice } from "@/components/DeletedNotice";
import { ExampleClonePair } from "@/components/ExampleClonePair";
import { FixExample } from "@/components/FixExample";
import { FounderStory } from "@/components/FounderStory";
import { RecordingFigure } from "@/components/RecordingFigure";
import { RevealList } from "@/components/RevealList";
import { ScrollTour } from "@/components/ScrollTour";
import { faq } from "@/content/faq";
import { exampleClone, familySection, finalCta, hero, privacyPromise, steps } from "@/content/landing";
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

      {/* Hero: the real/clone pair is the subject (DESIGN.md, direction D). */}
      <section className="pb-20 pt-14 lg:pt-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:items-end">
          <h1 className="max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-display lg:col-span-3">
            {hero.headline}
          </h1>
          <div className="max-w-copy-narrow lg:col-span-2">
            <p className="text-xl font-bold leading-snug text-pretty">{hero.subheading}</p>
            <p className="mt-3 text-lg leading-relaxed text-muted">{hero.subline}</p>
          </div>
        </div>

        <figure className="mx-auto mt-14 max-w-6xl px-4 sm:px-6" aria-labelledby="example-caption">
          <ExampleClonePair />
          <figcaption id="example-caption" className="mt-4 max-w-copy text-sm text-muted">
            Example sentence: “{exampleClone.sentence}”
            {!(exampleClone.realSrc && exampleClone.cloneSrc) && <span className="mt-1 block">{exampleClone.pendingNote}</span>}
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

      <Section id="family">
        <SectionHeading intro={familySection.intro}>{familySection.heading}</SectionHeading>
        <ScrollTour stops={familySection.tips} />
        <p className="mt-10 max-w-copy text-muted">{familySection.note}</p>
      </Section>

      <FounderStory />

      <Section id="privacy">
        <SectionHeading>{privacyPromise.heading}</SectionHeading>
        <RecordingFigure />
        <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {privacyPromise.points.map((p) => (
            <div key={p.title} className="max-w-copy">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
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
