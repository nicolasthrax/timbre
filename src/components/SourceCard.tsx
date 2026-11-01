import { ChevronRight, CircleCheck, EyeOff, User, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Waveform } from "@/components/Waveform";
import type { PostedBy, Source, SourceStatus } from "@/lib/api/types";
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
      <Badge tone="success" icon={<CircleCheck aria-hidden className="size-3" />}>
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

export function SourceCard({ source }: { source: Source }) {
  const PostedIcon = source.postedBy === "self" ? User : Users;

  const body = (
    <div className="flex gap-4">
      <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-field border border-border bg-surface-2 sm:block">
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
            {platformLabel[source.platform]}
          </span>
          <span>{formatDate(source.postedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <PostedIcon aria-hidden className="size-3.5" />
            {postedByLabel[source.postedBy]}
          </span>
        </div>
        <p className="mt-1.5 truncate font-medium text-text">{source.title}</p>
        <p className="mt-0.5 truncate tabular-nums text-xs text-muted">{displayUrl(source.url)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="tabular-nums text-sm tabular-nums text-text">
            {formatDuration(source.matchedSeconds)} <span className="text-muted">matched</span>
          </span>
          <span className="tabular-nums text-xs tabular-nums text-muted">{formatPercent(source.confidence)} confidence</span>
          <SourceStatusBadge status={source.status} />
        </div>
      </div>
      <ChevronRight aria-hidden className="mt-1 size-5 shrink-0 self-center text-muted" />
    </div>
  );

  return (
    <Link
      href={`/sources/${source.id}`}
      className="block rounded-card border border-border bg-surface p-4 transition-colors hover:border-field hover:bg-surface-2"
    >
      {body}
    </Link>
  );
}
