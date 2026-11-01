"use client";

import { Radar } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { Skeleton } from "@/components/Spinner";
import { Waveform } from "@/components/Waveform";
import { useCountUp } from "@/hooks/useCountUp";
import type { Scan } from "@/lib/api/types";
import { formatDate, minutesNumber } from "@/lib/format";
import { PLATFORMS, platformLabel } from "@/lib/platforms";
import { riskCopy } from "@/lib/risk";

/** The headline figure counts up once; screen readers get the final number only. */
function MinutesFigure({ minutes }: { minutes: string }) {
  const shown = useCountUp(Number(minutes), { decimals: minutes.includes(".") ? 1 : 0 });
  return (
    <span className="text-7xl font-semibold tracking-tight sm:text-8xl">
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{minutes}</span>
    </span>
  );
}

export function ExposureHero({ scan }: { scan: Scan }) {
  const risk = scan.riskLevel ?? "low";
  const highlight: [number, number][] = scan.sourceCount === 0 ? [] : [[0.06, 0.18], [0.3, 0.38], [0.5, 0.66], [0.8, 0.86]];
  return (
    <Card className="overflow-visible">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted">Your voice found in public videos</p>
          <p className="mt-2 flex items-baseline gap-3 tabular-nums" data-testid="minutes-found">
            <MinutesFigure minutes={minutesNumber(scan.matchedSeconds)} />
            <span className="text-2xl text-muted">min</span>
          </p>
          <p className="mt-3 max-w-md text-pretty text-text">
            {scan.sourceCount === 0
              ? "We didn't find your voice in any public videos we checked."
              : `We found ${minutesNumber(scan.matchedSeconds)} minutes of your voice in ${scan.sourceCount} public video${scan.sourceCount === 1 ? "" : "s"}.`}
          </p>
        </div>
        <div className="lg:text-right">
          <RiskBadge level={risk} size="lg" />
          <p className="mt-2 max-w-xs text-sm text-muted">{riskCopy[risk].summary}</p>
        </div>
      </div>
      <Waveform bars={48} seed={5} intro highlight={highlight} className="mt-6 h-14" />
      <p className="mt-3 tabular-nums text-xs text-muted">
        We checked {scan.candidatesCount} videos{scan.finishedAt ? ` on ${formatDate(scan.finishedAt)}` : ""}. The risk level is an exposure estimate.
      </p>
    </Card>
  );
}

export function PlatformCounts({ scan }: { scan: Scan }) {
  return (
    <ul className="grid grid-cols-3 gap-3" aria-label="Sources by platform">
      {PLATFORMS.map((p) => (
        <li key={p} className="rounded-card border border-border bg-surface p-4">
          <p className="tabular-nums text-2xl font-semibold tabular-nums">{scan.sourceCountByPlatform[p]}</p>
          <p className="text-xs text-muted">
            {platformLabel[p]}
            <span className="sr-only"> source{scan.sourceCountByPlatform[p] === 1 ? "" : "s"}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading results">
      <Skeleton className="h-64" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
    </div>
  );
}

export function NoScanYet() {
  return (
    <EmptyState
      icon={<Radar aria-hidden className="size-5" />}
      title="No scan yet"
      action={<ButtonLink href="/onboarding/accounts">Start a scan</ButtonLink>}
    >
      Add your accounts and we&apos;ll check public videos for your voice.
    </EmptyState>
  );
}
