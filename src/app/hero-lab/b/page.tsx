import "@fontsource-variable/schibsted-grotesk";
import { Phone, PhoneOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroLabNav } from "@/components/HeroLabNav";
import { Waveform } from "@/components/Waveform";
import { heroLab } from "@/content/heroLab";
import "../hero-lab.css";

export const metadata: Metadata = { title: "Hero B: The call", robots: { index: false } };

export default function HeroB() {
  return (
    <div className="hero-b min-h-dvh bg-hero-bg font-hero text-hero-ink">
      <HeroLabNav />
      <main id="main">
        <section data-hero className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-16 lg:grid-cols-12 lg:items-center lg:pt-20">
          <div className="lg:col-span-7">
            <h1 className="max-w-headline text-4xl font-bold leading-display tracking-tight sm:text-hero-display">
              {heroLab.headline}
            </h1>
            <p className="mt-6 max-w-copy text-hero-lead leading-relaxed text-hero-muted">{heroLab.subline}</p>

            <figure className="mt-10 max-w-copy rounded-hero-card bg-hero-surface p-6">
              <blockquote className="text-lg leading-relaxed">“{heroLab.founderQuote}”</blockquote>
              <figcaption className="mt-3 text-sm text-hero-muted">
                {heroLab.founderName}, {heroLab.founderRole}
              </figcaption>
            </figure>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/signin"
                className="inline-flex h-12 items-center rounded-hero-field bg-hero-action px-6 font-semibold text-hero-on-action hover:opacity-90"
              >
                {heroLab.cta}
              </Link>
              <p className="text-sm text-hero-muted">{heroLab.reassurance}</p>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-xs lg:col-span-5">
            <div
              aria-hidden
              className="rounded-hero-device border border-hero-line bg-hero-surface px-6 pb-8 pt-12 text-center"
            >
              <p className="text-sm text-hero-muted">Incoming call</p>
              <p className="mt-2 text-3xl font-semibold">Nicolas</p>
              <p className="mt-1 text-sm text-hero-muted">Mobile</p>
              <Waveform
                bars={28}
                seed={19}
                animated
                className="mx-auto mt-10 h-20"
                litClassName="bg-hero-action"
                unlitClassName="bg-hero-line"
                highlight={[[0, 1]]}
              />
              <div className="mt-12 flex justify-between px-2">
                <span className="flex flex-col items-center gap-2 text-sm text-hero-muted">
                  <span className="flex size-14 items-center justify-center rounded-full border border-hero-line">
                    <PhoneOff className="size-6" />
                  </span>
                  Decline
                </span>
                <span className="flex flex-col items-center gap-2 text-sm text-hero-muted">
                  <span className="flex size-14 items-center justify-center rounded-full border border-hero-line">
                    <Phone className="size-6" />
                  </span>
                  Accept
                </span>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm leading-relaxed text-hero-muted">
              The voice on a call like this can be an AI copy built from public videos.
            </figcaption>
          </figure>
        </section>
      </main>
    </div>
  );
}
