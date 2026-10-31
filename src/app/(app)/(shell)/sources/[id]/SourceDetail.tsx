"use client";

import { ArrowLeft, Check, ChevronDown, CircleCheck, Copy, ExternalLink, EyeOff, Lock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useSession } from "@/components/SessionProvider";
import { SourceStatusBadge } from "@/components/SourceCard";
import { Skeleton } from "@/components/Spinner";
import { reportLinks, selfFixes, takedownDraft } from "@/content/remediation";
import { useAsync } from "@/hooks/useAsync";
import { api, type Source, type SourceStatus } from "@/lib/api";
import { formatDate, formatDuration, formatPercent } from "@/lib/format";
import { platformLabel } from "@/lib/platforms";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 truncate text-sm text-text">{children}</dd>
    </div>
  );
}

function SelfFixes({ source }: { source: Source }) {
  const guide = selfFixes[source.platform];
  return (
    <Card>
      <h2 className="font-semibold">Reduce this exposure</h2>
      <p className="mt-1 text-sm text-muted">
        You posted this, so you can fix it in a minute. Pick whichever option suits you. Making it private is quickest.
      </p>
      <div className="mt-5 divide-y divide-border rounded-field border border-border">
        {guide.options.map((option, i) => (
          <details key={option.title} className="disclosure group px-4" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-sm font-medium">{option.title}</span>
                <span className="block text-xs text-muted">{option.summary}</span>
              </span>
              <ChevronDown aria-hidden className="size-4 shrink-0 text-muted transition-transform duration-250 ease-out group-open:rotate-180" />
            </summary>
            <ol className="space-y-2 pb-4 text-sm">
              {option.steps.map((step, n) => (
                <li key={step} className="flex gap-3">
                  <span className="tabular-nums text-accent">{n + 1}</span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
      <a
        href={guide.helpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted underline underline-offset-2 hover:text-text"
      >
        {platformLabel[source.platform]} help centre
        <ExternalLink aria-hidden className="size-3.5" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </Card>
  );
}

function Takedown({ source, fullName }: { source: Source; fullName: string | null }) {
  const [copied, setCopied] = useState(false);
  const draft = takedownDraft({
    platformLabel: platformLabel[source.platform],
    url: source.url ?? "",
    author: source.author,
    fullName,
    matchedSeconds: source.matchedSeconds,
  });
  const report = reportLinks[source.platform];

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card>
      <h2 className="font-semibold">Ask {platformLabel[source.platform]} to remove it</h2>
      <p className="mt-1 text-sm text-muted">
        Someone else posted this. Copy the request below and send it through {platformLabel[source.platform]}&apos;s report form.
        You can also message the poster directly. Most people take things down when asked.
      </p>
      <label htmlFor="takedown" className="sr-only">
        Takedown request text
      </label>
      <textarea
        id="takedown"
        readOnly
        value={draft}
        rows={12}
        className="mt-4 w-full resize-y rounded-field border border-field bg-surface p-3 tabular-nums text-xs leading-relaxed text-text"
      />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" onClick={copy}>
          {copied ? <Check key="done" aria-hidden className="size-4 animate-pop text-accent" /> : <Copy key="copy" aria-hidden className="size-4" />}
          {copied ? "Copied" : "Copy request"}
        </Button>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-field border border-border px-4 text-sm text-text hover:bg-surface-2"
        >
          Open {report.label}
          <ExternalLink aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Request copied to clipboard" : ""}
      </p>
    </Card>
  );
}

export function SourceDetail({ sourceId }: { sourceId: string }) {
  const { me, openPaywall } = useSession();
  const { data: source, error, setData } = useAsync(() => api.getSource(sourceId), `${sourceId}:${me?.plan ?? ""}`);
  const [busy, setBusy] = useState<SourceStatus | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const backHref = me?.plan === "pro" ? "/dashboard" : "/results";

  async function setStatus(status: SourceStatus) {
    setBusy(status);
    setActionError(null);
    try {
      setData(await api.updateSourceStatus(sourceId, status));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Couldn't update this source.");
    } finally {
      setBusy(null);
    }
  }

  const back = (
    <Link
      href={backHref}
      transitionTypes={["nav-back"]}
      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
    >
      <ArrowLeft aria-hidden className="size-4" />
      All sources
    </Link>
  );

  if (error) {
    return (
      <div className="space-y-4">
        {back}
        <Banner tone="warn" title="We couldn't load this source">{error.message}</Banner>
      </div>
    );
  }
  if (!source || !me) {
    return (
      <div className="space-y-4" aria-busy="true">
        {back}
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const redacted = source.url === null;
  const isSelf = source.postedBy === "self";

  return (
    <div className="space-y-6">
      {back}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm">
            {platformLabel[source.platform]}
          </span>
          {!redacted && <SourceStatusBadge status={source.status} />}
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          {source.title ?? "Video details hidden"}
        </h1>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex max-w-full items-center gap-1.5 tabular-nums text-xs text-muted hover:text-text"
          >
            <span className="truncate" data-testid="source-url">{source.url}</span>
            <ExternalLink aria-hidden className="size-3.5 shrink-0" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border pt-5 sm:grid-cols-3">
          <Fact label="Posted">{formatDate(source.postedAt)}</Fact>
          <Fact label="Posted by">
            {isSelf ? "You" : source.postedBy === "other" ? "Someone else" : "Unknown"}
            {source.author && <span className="ml-1 tabular-nums text-xs text-muted">{source.author}</span>}
          </Fact>
          <Fact label="Seconds matched">
            <span className="tabular-nums">{Math.round(source.matchedSeconds)} s</span>
            <span className="ml-1 text-xs text-muted">({formatDuration(source.matchedSeconds)})</span>
          </Fact>
          <Fact label="Confidence">
            <span className="tabular-nums">{formatPercent(source.confidence)}</span>
          </Fact>
          <Fact label="First seen">{formatDate(source.firstSeenAt)}</Fact>
          <Fact label="Platform">{platformLabel[source.platform]}</Fact>
        </dl>
      </Card>

      {redacted ? (
        <Card className="flex flex-col items-start gap-4 border-accent/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Lock aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">The link, title and fixes are part of Pro</p>
              <p className="mt-1 text-sm text-muted">Upgrade to see where this video is and get step-by-step help removing it.</p>
            </div>
          </div>
          <Button onClick={openPaywall}>Upgrade to Pro</Button>
        </Card>
      ) : (
        <>
          {source.status !== "open" && (
            <Banner
              tone={source.status === "fixed" ? "success" : "info"}
              title={source.status === "fixed" ? "Marked as fixed" : "Ignored"}
              action={
                <Button variant="ghost" size="sm" onClick={() => setStatus("open")} disabled={busy !== null}>
                  <RotateCcw aria-hidden className="size-4" />
                  Reopen
                </Button>
              }
            >
              {source.status === "fixed"
                ? "It no longer counts toward your exposure. We'll re-check it on your next scan."
                : "It's hidden from your open list but still counts toward your exposure."}
            </Banner>
          )}

          {isSelf ? <SelfFixes source={source} /> : <Takedown source={source} fullName={me.fullName} />}

          {actionError && <Banner tone="warn" title="Couldn't update">{actionError}</Banner>}

          {source.status === "open" && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => setStatus("fixed")} disabled={busy !== null} size="lg">
                <CircleCheck aria-hidden className="size-4" />
                {busy === "fixed" ? "Saving…" : "Mark as fixed"}
              </Button>
              {!isSelf && (
                <Button variant="secondary" onClick={() => setStatus("ignored")} disabled={busy !== null} size="lg">
                  <EyeOff aria-hidden className="size-4" />
                  {busy === "ignored" ? "Saving…" : "Ignore"}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
