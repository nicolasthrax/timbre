import { ChevronRight, CircleCheck, EyeOff, Lock, User, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Waveform } from "@/components/Waveform";
import type { PostedBy, Source, SourceStatus } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDate, formatDuration, formatPercent } from "@/lib/format";
import { platformLabel } from "@/lib/platforms";
import { hashString } from "@/lib/random";

export const postedByLabel: Record<PostedBy, string> = {
  self: "Posted by you",
  other: "Posted by someone else",
  unknown: "Poster unknown",
};

export function SourceStatusBadge({ status }: { status: SourceStatus }) {
  if (status === "fixed")
    return (
      <Badge tone="accent" icon={<CircleCheck aria-hidden className="size-3" />}>
        Fixed
      </Badge>
    );
  if (status === "ignored")
    return (
      <Badge icon={<EyeOff aria-hidden className="size-3" />}>
        Ignored
      </Badge>
    );
  return <Badge tone="warn">Open</Badge>;
}

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

/**
 * Renders exactly what the API returned. When details are redacted
 * (`url`/`title` are null) it shows a decorative blurred placeholder.
 */
export function SourceCard({ source }: { source: Source }) {
  const redacted = source.url === null;
  const PostedIcon = source.postedBy === "self" ? User : Users;

  const body = (
    <div className="flex gap-4">
      <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2 sm:block">
        {source.thumbnail ? (
          // Local placeholder thumbnails; next/image adds nothing here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={source.thumbnail} alt="" className="size-full object-cover" />
        ) : (
          <Waveform bars={14} seed={hashString(source.id)} className="h-full px-2 opacity-60" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 text-text">
            <PlatformIcon platform={source.platform} className="size-4" />
            {platformLabel[source.platform]}
          </span>
          <span>{formatDate(source.postedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <PostedIcon aria-hidden className="size-3.5" />
            {postedByLabel[source.postedBy]}
          </span>
        </div>
        {redacted ? (
          <div className="mt-2" aria-label="Video details hidden on the free plan">
            <div aria-hidden className="h-4 w-4/5 rounded bg-surface-2 blur-[3px]" />
            <div aria-hidden className="mt-2 h-3 w-1/2 rounded bg-surface-2 blur-[3px]" />
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
              <Lock aria-hidden className="size-3" /> Details hidden
            </p>
          </div>
        ) : (
          <>
            <p className="mt-1.5 truncate font-medium text-text">{source.title}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-muted">{displayUrl(source.url ?? "")}</p>
          </>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-sm tabular-nums text-text">
            {formatDuration(source.matchedSeconds)} <span className="text-muted">matched</span>
          </span>
          <span className="font-mono text-xs tabular-nums text-muted">{formatPercent(source.confidence)} confidence</span>
          {!redacted && <SourceStatusBadge status={source.status} />}
        </div>
      </div>
      {!redacted && <ChevronRight aria-hidden className="mt-1 size-5 shrink-0 self-center text-muted" />}
    </div>
  );

  const className = cn(
    "block rounded-xl border border-border bg-surface p-4 transition-colors",
    !redacted && "hover:border-[#363c46] hover:bg-surface-2",
  );

  if (redacted) {
    return <div className={className}>{body}</div>;
  }
  return (
    <Link href={`/sources/${source.id}`} className={className}>
      {body}
    </Link>
  );
}
