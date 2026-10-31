"use client";

import { CircleCheck, Mic, MicOff, Pause, RotateCcw, ShieldCheck, TriangleAlert, Volume1 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Waveform } from "@/components/Waveform";
import { type AudioQuality, type RecorderError, useRecorder } from "@/hooks/useRecorder";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";

const BARS = 56;

const errorCopy: Record<RecorderError, { title: string; body: string }> = {
  denied: {
    title: "Microphone access is blocked",
    body: "Allow microphone access for this site — usually via the lock icon next to the address bar, or in your browser's site settings — then try again.",
  },
  "no-mic": {
    title: "No microphone found",
    body: "We couldn't find a working microphone. Plug in a headset, check that no other app is using the mic, or switch to your phone, then try again.",
  },
  unsupported: {
    title: "This browser can't record audio",
    body: "Open Timbre in a recent version of Chrome, Safari, Edge or Firefox. In-app browsers (like Instagram's) often block the microphone — use \"Open in browser\".",
  },
  unknown: {
    title: "Something went wrong with the microphone",
    body: "Close other apps that might be using it, reload the page and try again.",
  },
};

const qualityCopy: Record<AudioQuality, { label: string; Icon: typeof Mic; className: string }> = {
  "too-quiet": { label: "Too quiet — move closer", Icon: Volume1, className: "border-warn/40 text-warn" },
  good: { label: "Good", Icon: CircleCheck, className: "border-accent/40 text-accent" },
  noisy: { label: "Background noise", Icon: TriangleAlert, className: "border-warn/40 text-warn" },
};

export function MicErrorState({ kind, onRetry }: { kind: RecorderError; onRetry?: () => void }) {
  const copy = errorCopy[kind];
  return (
    <div role="alert" className="rounded-xl border border-warn/40 bg-warn/5 p-5">
      <div className="flex gap-3">
        <MicOff aria-hidden className="mt-0.5 size-5 shrink-0 text-warn" />
        <div>
          <p className="font-medium">{copy.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{copy.body}</p>
          {onRetry && kind !== "unsupported" && (
            <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
              <RotateCcw aria-hidden className="size-4" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Recorder({
  phrases,
  minSeconds,
  submitLabel,
  onComplete,
}: {
  phrases: string[];
  minSeconds: number;
  submitLabel: string;
  /** Receives the recording. The blob is discarded from memory right after. */
  onComplete: (audio: Blob) => Promise<void>;
}) {
  const rec = useRecorder();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pendingBlob = useRef<Blob | null>(null);

  const seconds = rec.elapsedMs / 1000;
  const progress = Math.min(1, seconds / minSeconds);
  const enough = seconds >= minSeconds;
  const recording = rec.status === "recording";
  const levels = [...Array(Math.max(0, BARS - rec.levels.length)).fill(0.06), ...rec.levels];

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const blob = pendingBlob.current ?? (await rec.finish());
      pendingBlob.current = blob;
      await onComplete(blob);
      pendingBlob.current = null;
      rec.discard();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function startOver() {
    pendingBlob.current = null;
    setSubmitError(null);
    rec.reset();
  }

  if (rec.status === "error" && rec.error) {
    return <MicErrorState kind={rec.error} onRetry={startOver} />;
  }

  return (
    <div className="space-y-5">
      <ol className="space-y-2" aria-label="Phrases to read aloud">
        {phrases.map((phrase, i) => (
          <li key={phrase} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
            <span className="font-mono text-sm text-accent">{i + 1}</span>
            <span className="text-base leading-relaxed text-text sm:text-lg">{phrase}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className={cn("size-2 rounded-full", recording ? "animate-pulse bg-danger" : "bg-[#3a414c]")}
            />
            <span className="text-muted">
              {recording ? "Recording" : rec.status === "paused" ? "Paused" : rec.status === "requesting" ? "Waiting for microphone…" : rec.status === "finished" ? "Recorded" : "Ready"}
            </span>
          </span>
          <span className="font-mono text-sm tabular-nums" aria-label={`Recorded ${Math.floor(seconds)} of ${minSeconds} seconds`}>
            {formatClock(seconds)} <span className="text-muted">/ {formatClock(minSeconds)}</span>
          </span>
        </div>

        <Waveform levels={levels} className="mt-4 h-20" />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Mic aria-hidden className="size-4 shrink-0 text-muted" />
            <div
              role="meter"
              aria-label="Input level"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(rec.level * 100)}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"
            >
              <div className="h-full rounded-full bg-accent transition-[width] duration-75" style={{ width: `${rec.level * 100}%` }} />
            </div>
          </div>
          <p aria-live="polite" className="min-h-7">
            {rec.quality && rec.status === "recording" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  qualityCopy[rec.quality].className,
                )}
              >
                {(() => {
                  const { Icon } = qualityCopy[rec.quality];
                  return <Icon aria-hidden className="size-3.5" />;
                })()}
                {qualityCopy[rec.quality].label}
              </span>
            )}
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Minimum recording length"
          aria-valuemin={0}
          aria-valuemax={minSeconds}
          aria-valuenow={Math.min(minSeconds, Math.floor(seconds))}
          className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2"
        >
          <div className="h-full bg-text/70 transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          {enough
            ? "That's enough audio. You can continue."
            : `Read all three phrases at a normal pace. At least ${minSeconds} seconds needed — ${Math.max(0, Math.ceil(minSeconds - seconds))}s to go.`}
        </p>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-[#ff8a8e]">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {recording ? (
            <Button variant="secondary" size="lg" onClick={rec.pause}>
              <Pause aria-hidden className="size-4" />
              Pause
            </Button>
          ) : (
            rec.status !== "finished" && (
              <Button
                variant={enough ? "secondary" : "primary"}
                size="lg"
                onClick={rec.start}
                disabled={rec.status === "requesting" || submitting}
              >
                <Mic aria-hidden className="size-4" />
                {rec.status === "paused" ? "Resume" : "Start recording"}
              </Button>
            )
          )}
          {(rec.status === "paused" || rec.status === "finished" || (recording && seconds > 2)) && (
            <Button variant="ghost" size="lg" onClick={startOver} disabled={submitting}>
              <RotateCcw aria-hidden className="size-4" />
              Start over
            </Button>
          )}
        </div>
        <Button size="lg" onClick={submit} disabled={!enough || submitting}>
          {submitting ? "Processing…" : submitLabel}
        </Button>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
        Your audio stays in this browser and is never stored. In this preview it&apos;s discarded as soon as you continue.
      </p>
    </div>
  );
}
