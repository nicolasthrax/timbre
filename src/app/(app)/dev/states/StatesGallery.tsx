"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Banner } from "@/components/Banner";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeletedBanner } from "@/components/DeletedNotice";
import { Logo } from "@/components/Logo";
import { MicErrorState } from "@/components/Recorder";
import { RiskBadge } from "@/components/RiskBadge";
import { SCENARIO_EVENT } from "@/components/ScenarioSync";
import { useSession } from "@/components/SessionProvider";
import { SourceCard } from "@/components/SourceCard";
import { LapsedBanner, LowExposureState, ScanIssuesNotice, UpgradeCard } from "@/components/StateNotices";
import { mockControls, type Plan, type Source } from "@/lib/api";
import { SCENARIOS, type Scenario } from "@/lib/api/mock-data";
import { cn } from "@/lib/cn";

const sampleSource: Source = {
  id: "src_preview",
  scanId: "scan_preview",
  userId: "usr_preview",
  platform: "tiktok",
  url: "https://www.tiktok.com/@chris_eats_hk/video/7301234567890123456",
  title: "rating Hong Kong milk tea (honestly)",
  thumbnail: "/thumbnails/thumb-2.svg",
  author: "@chris_eats_hk",
  postedBy: "other",
  postedAt: "2025-08-14T08:00:00.000Z",
  matchedSeconds: 74,
  confidence: 0.86,
  firstSeenAt: "2026-10-28T08:00:00.000Z",
  status: "open",
};
const redactedSource: Source = { ...sampleSource, id: "src_preview_r", url: null, title: null, thumbnail: null, author: null };

const PREVIEW_LAPSED_AT = "2026-10-29T00:00:00.000Z";

const scenarioCopy: Record<Scenario, string> = {
  high: "12 sources, 47 min, High risk",
  none: "Nothing found, low exposure",
  partial: "Some sources unreachable / private",
  lapsed: "Pro subscription lapsed",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Boom(): never {
  throw new Error("Preview of the global error page");
}

export function StatesGallery() {
  const { refresh, openPaywall } = useSession();
  const [scenario, setScenario] = useState<Scenario | null>(() => mockControls?.getScenario() ?? null);
  const [seeded, setSeeded] = useState<string | null>(null);
  const [crash, setCrash] = useState(false);

  function chooseScenario(next: Scenario) {
    mockControls?.setScenario(next);
    setScenario(next);
    window.dispatchEvent(new Event(SCENARIO_EVENT));
  }

  async function seed(plan: Plan) {
    mockControls?.seedDemo(plan);
    setScenario(mockControls?.getScenario() ?? null);
    await refresh();
    setSeeded(plan);
  }

  async function reset() {
    mockControls?.reset();
    await refresh();
    setSeeded("reset");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-10 sm:px-6">
      {crash && <Boom />}
      <header className="space-y-3">
        <Logo />
        <h1 className="text-2xl font-semibold">State previews</h1>
        <p className="text-sm text-muted">
          Hidden dev page. Switch mock scenarios, seed demo accounts and preview every required state.
        </p>
      </header>

      {!mockControls ? (
        <Banner tone="warn" title="Not in mock mode">Scenario controls only work when NEXT_PUBLIC_API_MODE=mock.</Banner>
      ) : (
        <Section title="Mock backend">
          <Card className="space-y-5">
            <div>
              <p className="text-sm font-medium">Scenario (applies to the next scan or seed)</p>
              <div role="group" aria-label="Scenario" className="mt-3 flex flex-wrap gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={scenario === s}
                    onClick={() => chooseScenario(s)}
                    className={cn(
                      "rounded-field border px-3 py-2 text-left text-sm",
                      scenario === s ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:text-text",
                    )}
                  >
                    <span className="block tabular-nums">{s}</span>
                    <span className="block text-xs opacity-80">{scenarioCopy[s]}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">Also settable with <code className="tabular-nums">?scenario=</code> on any page.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Seed a signed-in demo account (skips onboarding)</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => seed("free")}>Seed free user</Button>
                <Button variant="secondary" size="sm" onClick={() => seed("pro")}>Seed Pro user</Button>
                <Button variant="secondary" size="sm" onClick={() => seed("lapsed")}>Seed lapsed user</Button>
                <Button variant="ghost" size="sm" onClick={reset}>Reset everything</Button>
              </div>
              {seeded && (
                <p role="status" className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
                  {seeded === "reset" ? "Mock store cleared." : `Seeded ${seeded} account.`}
                  {seeded !== "reset" && (
                    <ButtonLink href={seeded === "pro" ? "/dashboard" : "/results"} size="sm">
                      Open app
                    </ButtonLink>
                  )}
                </p>
              )}
            </div>
          </Card>
        </Section>
      )}

      <Section title="Microphone: denied / no mic / unsupported / unknown">
        <MicErrorState kind="denied" onRetry={() => undefined} />
        <MicErrorState kind="no-mic" onRetry={() => undefined} />
        <MicErrorState kind="unsupported" />
        <MicErrorState kind="unknown" onRetry={() => undefined} />
      </Section>

      <Section title="Scan found nothing">
        <LowExposureState />
      </Section>

      <Section title="Partial scan failure">
        <ScanIssuesNotice issues={[{ platform: "tiktok", kind: "unreachable", handle: "kaichan" }]} />
      </Section>

      <Section title="Private account / platform blocked">
        <ScanIssuesNotice
          issues={[
            { platform: "instagram", kind: "private", handle: "kai.eats.hk" },
            { platform: "youtube", kind: "blocked", handle: null },
          ]}
        />
      </Section>

      <Section title="Payment failed / subscription lapsed">
        <LapsedBanner lapsedAt={PREVIEW_LAPSED_AT} onRenew={openPaywall} />
        <UpgradeCard count={12} onUpgrade={openPaywall} lapsed />
        <SourceCard source={redactedSource} />
      </Section>

      <Section title="Source card, redacted (free) and full (Pro)">
        <SourceCard source={redactedSource} />
        <SourceCard source={sampleSource} />
      </Section>

      <Section title="Risk badges">
        <div className="flex flex-wrap gap-4">
          <RiskBadge level="low" />
          <RiskBadge level="medium" />
          <RiskBadge level="high" />
          <RiskBadge level="critical" />
        </div>
      </Section>

      <Section title="Data deleted confirmation">
        <DeletedBanner />
      </Section>

      <Section title="Paywall, 404 and error pages">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={openPaywall}>Open paywall</Button>
          <ButtonLink href="/this-page-does-not-exist" variant="secondary">Open 404</ButtonLink>
          <Button variant="danger" onClick={() => setCrash(true)}>Trigger error page</Button>
        </div>
        <p className="text-xs text-muted">
          <Badge>Note</Badge> In development, Next.js shows its error overlay on top of the error page. Close it to see the branded page.
        </p>
      </Section>
    </div>
  );
}
