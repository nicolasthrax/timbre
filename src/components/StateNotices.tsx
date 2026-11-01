"use client";

import { ShieldCheck } from "lucide-react";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Card";
import type { ScanIssue } from "@/lib/api/types";
import { platformLabel } from "@/lib/platforms";

function issueText(issue: ScanIssue): { title: string; body: string } {
  const where = platformLabel[issue.platform];
  const who = issue.handle ? `@${issue.handle}` : `Your ${where} account`;
  switch (issue.kind) {
    case "private":
      return {
        title: `${who} on ${where} is private`,
        body: "We only scan public content, so we skipped it. That's good news: strangers can't reach those videos either.",
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

/** Partial scan failure or private account. Informative, not alarming. */
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

export function LowExposureState() {
  const tips = [
    "Keep accounts that show your face and voice private, or limit who can see stories.",
    "Turn off downloads, duets and stitches so others can't reuse your audio.",
    "Agree a family safe word. A clone can copy your voice, but it can't know the word.",
    "Run a new scan after you post something new, or turn on weekly monitoring.",
  ];
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
          <ShieldCheck aria-hidden className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">Low exposure. Here&apos;s how to keep it that way</h2>
          <p className="text-sm text-muted">We didn&apos;t find your voice in any public videos we checked.</p>
        </div>
      </div>
      <ul className="mt-5 space-y-3 text-sm">
        {tips.map((tip, i) => (
          <li key={tip} className="flex gap-3">
            <span className="tabular-nums text-accent">{i + 1}</span>
            <span className="text-muted">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
