"use client";

import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { ScanIssue } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { platformLabel } from "@/lib/platforms";

function issueText(issue: ScanIssue): { title: string; body: string } {
  const where = platformLabel[issue.platform];
  const who = issue.handle ? `@${issue.handle}` : `Your ${where} account`;
  switch (issue.kind) {
    case "private":
      return {
        title: `${who} on ${where} is private`,
        body: "We only scan public content, so we skipped it. That's good news — strangers can't reach those videos either.",
      };
    case "blocked":
      return {
        title: `${where} limited our access`,
        body: "The platform temporarily blocked automated checks. We'll retry on your next scan.",
      };
    case "unreachable":
      return {
        title: `${where} was unreachable`,
        body: "We couldn't reach it during this scan, so results may be incomplete. We'll retry automatically next time.",
      };
  }
}

/** Partial scan failure / private account — informative, not alarming. */
export function ScanIssuesNotice({ issues }: { issues: ScanIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <Banner tone="info" title="Some sources couldn't be checked">
      <ul className="mt-1 space-y-2">
        {issues.map((issue) => {
          const text = issueText(issue);
          return (
            <li key={`${issue.platform}-${issue.kind}`}>
              <span className="text-text">{text.title}.</span> {text.body}
            </li>
          );
        })}
      </ul>
    </Banner>
  );
}

export function LapsedBanner({ lapsedAt, onRenew }: { lapsedAt: string | null; onRenew?: () => void }) {
  const until = lapsedAt ? formatDate(new Date(new Date(lapsedAt).getTime() + 30 * 86_400_000).toISOString()) : null;
  return (
    <Banner
      tone="warn"
      title="Your Pro subscription has lapsed"
      action={
        onRenew && (
          <Button size="sm" onClick={onRenew}>
            Renew Pro
          </Button>
        )
      }
    >
      Your last payment didn&apos;t go through, so source details are hidden again. We&apos;re keeping your data for 30 days
      {until ? ` — until ${until}` : ""}. Renew to pick up where you left off.
    </Banner>
  );
}

export function LowExposureState() {
  const tips = [
    "Keep accounts that show your face and voice private, or limit who can see stories.",
    "Turn off downloads, duets and stitches so others can't reuse your audio.",
    "Agree a family safe word — a clone can copy your voice, not your secrets.",
    "Run a new scan after you post something new, or turn on weekly monitoring.",
  ];
  return (
    <Card className="border-accent/30">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <ShieldCheck aria-hidden className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">Low exposure — here&apos;s how to keep it that way</h2>
          <p className="text-sm text-muted">We didn&apos;t find your voice in any public videos we checked.</p>
        </div>
      </div>
      <ul className="mt-5 space-y-3 text-sm">
        {tips.map((tip, i) => (
          <li key={tip} className="flex gap-3">
            <span className="font-mono text-accent">{i + 1}</span>
            <span className="text-muted">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function UpgradeCard({ count, onUpgrade, lapsed }: { count: number; onUpgrade: () => void; lapsed?: boolean }) {
  return (
    <Card className="relative overflow-hidden border-accent/40 bg-gradient-to-br from-accent/[0.08] via-surface to-surface">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-accent">
            <Lock aria-hidden className="size-4" />
            {count} source{count === 1 ? "" : "s"} hidden
          </p>
          <h2 className="mt-2 text-lg font-semibold">See exactly where your voice is — and remove it</h2>
          <p className="mt-1 text-sm text-muted">
            Pro unlocks every link, guided fixes, takedown drafts, the clone test and weekly monitoring.
          </p>
        </div>
        <Button onClick={onUpgrade} size="lg" className="shrink-0">
          <Sparkles aria-hidden className="size-4" />
          {lapsed ? "Renew Pro" : "Unlock full report"}
        </Button>
      </div>
    </Card>
  );
}
