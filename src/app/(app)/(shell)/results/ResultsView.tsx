"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Banner } from "@/components/Banner";
import { ButtonLink } from "@/components/Button";
import { useSession } from "@/components/SessionProvider";
import { SourceCard } from "@/components/SourceCard";
import { LapsedBanner, LowExposureState, ScanIssuesNotice, UpgradeCard } from "@/components/StateNotices";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { ExposureHero, NoScanYet, PlatformCounts, ResultsSkeleton } from "@/components/ExposureSummary";

export function ResultsView() {
  const router = useRouter();
  const { me, openPaywall } = useSession();
  const plan = me?.plan;
  const { data, error } = useAsync(
    () => Promise.all([api.listScans(), api.listSources()]),
    plan ?? "",
  );

  useEffect(() => {
    if (plan === "pro") router.replace("/dashboard");
  }, [plan, router]);

  if (error) return <Banner tone="warn" title="We couldn't load your results">{error.message}</Banner>;
  if (!data || !me || plan === "pro") return <ResultsSkeleton />;

  const [scans, sources] = data;
  const scan = scans[0];
  if (!scan) return <NoScanYet />;
  if (!scan.finishedAt) {
    return (
      <Banner tone="info" title="Your scan is still running" action={<ButtonLink href={`/scan/${scan.id}`} size="sm">View progress</ButtonLink>}>
        We&apos;ll show your results here as soon as it finishes.
      </Banner>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Your exposure results</h1>
      {me.plan === "lapsed" && <LapsedBanner lapsedAt={me.lapsedAt} onRenew={openPaywall} />}
      <ScanIssuesNotice issues={scan.issues} />
      <ExposureHero scan={scan} />
      <PlatformCounts scan={scan} />

      {sources.length === 0 ? (
        <LowExposureState />
      ) : (
        <>
          <UpgradeCard count={sources.length} onUpgrade={openPaywall} lapsed={me.plan === "lapsed"} />
          <section aria-labelledby="sources-heading">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="sources-heading" className="font-semibold">
                Sources
              </h2>
              <span className="tabular-nums text-xs text-muted">{sources.length} found</span>
            </div>
            <div className="relative">
              <ul className="space-y-3" data-testid="source-list">
                {sources.map((s) => (
                  <li key={s.id}>
                    <SourceCard source={s} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
