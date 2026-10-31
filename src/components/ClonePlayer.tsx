"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { Waveform } from "@/components/Waveform";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";

/**
 * Custom audio player with no download affordance: no native controls,
 * `controlsList="nodownload"`, no context menu and no links to the file.
 */
export function ClonePlayer({
  label,
  src,
  seed,
  watermarked = false,
  active,
  onPlay,
}: {
  label: string;
  src: string;
  seed: number;
  watermarked?: boolean;
  /** When another player starts, this one pauses. */
  active: boolean;
  onPlay: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!active) audioRef.current?.pause();
  }, [active]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      onPlay();
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  const progress = duration > 0 ? time / duration : 0;

  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-4 sm:p-5",
        watermarked ? "border-accent/40" : "border-border",
      )}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{label}</h3>
        {watermarked ? <Badge tone="accent">Watermarked</Badge> : <Badge>Your recording</Badge>}
      </div>
      <Waveform bars={40} seed={seed} progress={progress} className="mt-4 h-16" />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-on-accent hover:bg-[#5bf0d6]"
        >
          {playing ? <Pause aria-hidden className="size-5" /> : <Play aria-hidden className="ml-0.5 size-5" />}
          <span className="sr-only">
            {playing ? "Pause" : "Play"} {label}
          </span>
        </button>
        <span className="font-mono text-sm tabular-nums text-muted">
          {formatClock(time)} / {formatClock(duration)}
        </span>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        controlsList="nodownload noplaybackrate"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
