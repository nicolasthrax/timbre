"use client";

import { CalendarClock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ExposureHero, NoScanYet, PlatformCounts, ResultsSkeleton } from "@/components/ExposureSummary";
import { useSession } from "@/components/SessionProvider";
import { SourceCard } from "@/components/SourceCard";
import { Sparkline } from "@/components/Sparkline";
import { LowExposureState, ScanIssuesNotice } from "@/components/StateNotices";
import { useAsync } from "@/hooks/useAsync";
import { api, type Platform, type Scan, type SourceStatus } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatDate, minutesNumber } from "@/lib/format";
import { PLATFORMS, platformLabel } from "@/lib/platforms";

const STATUS_FILTERS: { value: SourceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "fixed", label: "Fixed" },
  { value: "ignored", label: "Ignored" },
];

function nextScanIn(latest: Scan): string {
  const next = new Date(latest.finishedAt ?? latest.startedAt).getTime() + 7 * 86_400_000;
  const days = Math.max(0, Math.ceil((next - Date.now()) / 86_400_000));
  if (days === 0) return "next scan today";
  return `next scan in ${days} day${days === 1 ? "" : "s"}`;
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
        active ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

export function DashboardView() {
  const router = useRouter();
  const { me } = useSession();
  const plan = me?.plan;
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [status, setStatus] = useState<SourceStatus | "all">("all");
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const { data, error } = useAsync(() => Promise.all([api.listScans(), api.listSources()]), plan ?? "");

  useEffect(() => {
    if (plan && plan !== "pro") router.replace("/results");
  }, [plan, router]);

  async function runScan() {
    setStarting(true);
    setStartError(null);
    try {
      const scan = await api.startScan("paid");
      router.push(`/scan/${scan.id}`);
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "Couldn't start a scan.");
      setStarting(false);
    }
  }

  if (error) return <Banner tone="warn" title="We couldn't load your dashboard">{error.message}</Banner>;
  if (!data || !me || plan !== "pro") return <ResultsSkeleton />;

  const [scans, sources] = data;
  const latest = scans[0];
  if (!latest) return <NoScanYet />;
  const running = !latest.finishedAt;
  const finished = scans.filter((s) => s.finishedAt);
  const current = finished[0];
  const trend = [...finished].reverse().map((s) => s.matchedSeconds);
  const counts = {
    open: sources.filter((s) => s.status === "open").length,
    fixed: sources.filter((s) => s.status === "fixed").length,
    ignored: sources.filter((s) => s.status === "ignored").length,
  };
  const filtered = sources
    .filter((s) => platform === "all" || s.platform === platform)
    .filter((s) => status === "all" || s.status === status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your voice exposure</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <CalendarClock aria-hidden className="size-4" />
            {me.monitoring ? (
              <span>
                Weekly scans on, <span data-testid="next-scan">{nextScanIn(latest)}</span>
              </span>
            ) : (
              <span>
                Weekly scans are off.{" "}
                <Link href="/settings" className="text-text underline underline-offset-2">
                  Turn on
                </Link>
              </span>
            )}
          </p>
        </div>
        {running ? (
          <ButtonLink href={`/scan/${latest.id}`} variant="secondary">
            <RefreshCw aria-hidden className="size-4 animate-spin" />
            Scan in progress
          </ButtonLink>
        ) : (
          <Button onClick={runScan} disabled={starting} variant="secondary">
            <RefreshCw aria-hidden className="size-4" />
            {starting ? "Starting…" : "Run new scan"}
          </Button>
        )}
      </div>
      {startError && <Banner tone="warn" title="Couldn't start a scan">{startError}</Banner>}

      {current && (
        <>
          <ScanIssuesNotice issues={current.issues} />
          <ExposureHero scan={current} />
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card className="p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-medium">Exposure trend</h2>
                <span className="tabular-nums text-xs text-muted">
                  {finished.length} scan{finished.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-3">
                <Sparkline values={trend} label={`Minutes of voice found over your last ${trend.length} scans`} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {trend.length > 1
                  ? `${minutesNumber(trend[0])} → ${minutesNumber(trend[trend.length - 1])} min since ${formatDate(finished[finished.length - 1].finishedAt ?? "")}`
                  : "Your trend appears after your next weekly scan."}
              </p>
            </Card>
            <Card className="grid grid-cols-3 gap-2 p-5 text-center">
              {(["open", "fixed", "ignored"] as const).map((k) => (
                <div key={k}>
                  <p className="tabular-nums text-2xl font-semibold tabular-nums">{counts[k]}</p>
                  <p className="text-xs capitalize text-muted">{k}</p>
                </div>
              ))}
            </Card>
          </div>
          <PlatformCounts scan={current} />
        </>
      )}

      {current && sources.length === 0 ? (
        <LowExposureState />
      ) : (
        <section aria-labelledby="sources-heading" className="space-y-4">
          <h2 id="sources-heading" className="font-semibold">
            Sources
          </h2>
          <div className="flex flex-col gap-3">
            <div role="group" aria-label="Filter by platform" className="flex flex-wrap gap-2">
              <FilterChip active={platform === "all"} onClick={() => setPlatform("all")}>
                All platforms
              </FilterChip>
              {PLATFORMS.map((p) => (
                <FilterChip key={p} active={platform === p} onClick={() => setPlatform(p)}>
                  {platformLabel[p]}
                </FilterChip>
              ))}
            </div>
            <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <FilterChip key={f.value} active={status === f.value} onClick={() => setStatus(f.value)}>
                  {f.label}
                  {f.value !== "all" && <span className="tabular-nums text-xs opacity-80">{counts[f.value]}</span>}
                </FilterChip>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={<RefreshCw aria-hidden className="size-5" />} title="Nothing matches these filters">
              Try a different platform or status.
            </EmptyState>
          ) : (
            <ul className="space-y-3" data-testid="source-list">
              {filtered.map((s) => (
                <li key={s.id}>
                  <SourceCard source={s} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
