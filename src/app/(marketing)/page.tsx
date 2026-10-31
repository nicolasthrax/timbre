import { ArrowRight, ChevronDown, Lock, Mic, ScanSearch, ShieldCheck, Sparkles, Trash2, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/Button";
import { DeletedNotice } from "@/components/DeletedNotice";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PricingCards } from "@/components/PricingCards";
import { Waveform } from "@/components/Waveform";
import { faq } from "@/content/faq";
import {
  finalCta,
  founder,
  hero,
  platformsSection,
  privacyPromise,
  sampleResult,
  steps,
} from "@/content/landing";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  openGraph: { title: site.title, description: site.description },
};

const stepIcons = [Mic, ScanSearch, Wrench];
const promiseIcons = [Trash2, ShieldCheck, Lock, Sparkles];

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-pretty text-muted">{intro}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DeletedNotice />
      </Suspense>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(46,230,197,0.14),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{hero.headline}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {hero.subline}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/signin" size="lg" className="w-full sm:w-auto">
                {hero.cta}
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary" size="lg" className="w-full sm:w-auto">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-muted">{hero.footnote}</p>
          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-xl border border-border bg-surface/80 p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">{sampleResult.caption}</p>
                <p className="mt-2 flex items-baseline gap-2 font-mono">
                  <span className="text-5xl font-semibold text-text sm:text-6xl">{sampleResult.minutes}</span>
                  <span className="text-lg text-muted">min of voice found</span>
                </p>
              </div>
              <p className="max-w-xs text-sm text-muted">{sampleResult.line}</p>
            </div>
            <Waveform
              className="mt-6 h-20 sm:h-28"
              bars={72}
              seed={11}
              animated
              highlight={[
                [0.08, 0.2],
                [0.34, 0.41],
                [0.55, 0.72],
                [0.84, 0.9],
              ]}
              label="Waveform with highlighted segments where a voice was found"
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2 w-4 rounded-full bg-accent" /> Your voice found
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2 w-4 rounded-full bg-[#3a414c]" /> Other audio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="How it works" title="Three steps. About five minutes." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={step.title} className="rounded-xl border border-border bg-surface p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-accent">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Founder story */}
      <section className="border-t border-border/60 bg-gradient-to-b from-surface/60 to-transparent">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading eyebrow="Our story" title={founder.heading} />
          <figure className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <blockquote className="text-lg leading-relaxed text-text text-pretty">“{founder.quote}”</blockquote>
            {founder.body.map((p) => (
              <p key={p} className="mt-4 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-sm text-accent"
              >
                NF
              </span>
              <span>
                <span className="block text-sm font-medium">{founder.name}</span>
                <span className="block text-xs text-muted">{founder.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* What we look for */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Coverage" title={platformsSection.heading} intro={platformsSection.intro} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {platformsSection.platforms.map((p) => (
              <li key={p.platform} className="rounded-xl border border-border bg-surface p-6">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-text">
                  <PlatformIcon platform={p.platform} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            We only look at public content. We never access private accounts, messages or anything behind a login.
          </p>
        </div>
      </section>

      {/* Privacy promise */}
      <section id="privacy" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Privacy" title={privacyPromise.heading} intro={privacyPromise.intro} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {privacyPromise.points.map((p, i) => {
              const Icon = promiseIcons[i];
              return (
                <li key={p.title} className="rounded-xl border border-border bg-surface p-6">
                  <Icon aria-hidden className="size-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Pricing" title="Start free. Upgrade when you want the details." />
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Honest answers" />
          <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-surface">
            {faq.map((item) => (
              <details key={item.q} className="group px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{finalCta.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">{finalCta.body}</p>
          <ButtonLink href="/signin" size="lg" className="mt-8">
            {hero.cta}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
