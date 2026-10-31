"use client";

import { Check, Circle, LoaderCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { useSession } from "@/components/SessionProvider";
import { Waveform } from "@/components/Waveform";
import { api, type Scan } from "@/lib/api";
import { cn } from "@/lib/cn";

type StepState = "done" | "active" | "pending";

function stepStates(scan: Scan | null): StepState[] {
  if (!scan) return ["active", "pending", "pending"];
  if (scan.finishedAt) return ["done", "done", "done"];
  if (scan.status === "collecting") return ["active", "pending", "pending"];
  if (scan.status === "matching") return ["done", "active", "pending"];
  return ["done", "done", "active"];
}

export function ScanProgress({ scanId }: { scanId: string }) {
  const router = useRouter();
  const { me } = useSession();
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const done = !!scan?.finishedAt;
  const destination = me?.plan === "pro" ? "/dashboard" : "/results";

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = () => {
      api.getScan(scanId).then(
        (next) => {
          if (!active) return;
          setScan(next);
          if (!next.finishedAt) timer = setTimeout(poll, 600);
        },
        (e: unknown) => {
          if (active) setError(e instanceof Error ? e.message : "We couldn't load this scan.");
        },
      );
    };
    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [scanId]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push(destination), 1400);
    return () => clearTimeout(t);
  }, [done, destination, router]);

  if (error) {
    return (
      <Banner tone="warn" title="We couldn't load this scan" action={<ButtonLink href="/results" size="sm" variant="secondary">Go to results</ButtonLink>}>
        {error}
      </Banner>
    );
  }

  const states = stepStates(scan);
  const steps = [
    {
      label: "Collecting public videos",
      detail: scan ? (
        <span className="tabular-nums">
          {scan.candidatesProcessed}/{scan.candidatesCount}
        </span>
      ) : null,
    },
    { label: "Matching your voice", detail: null },
    { label: "Calculating exposure", detail: null },
  ];

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {done ? "Scan complete" : "Scanning for your voice…"}
      </h1>
      <p className="mt-2 text-muted">
        {done ? "Taking you to your results." : "We're checking public videos on Instagram, TikTok and YouTube."}
      </p>

      <Card className="mt-8">
        <div className="relative overflow-hidden">
          <Waveform bars={48} seed={23} animated={!done} highlight={done ? [[0, 1]] : []} className="h-16" />
        </div>
        <ol className="mt-6 space-y-4" aria-live="polite">
          {steps.map((step, i) => (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  states[i] === "done" && "bg-accent/15 text-accent",
                  states[i] === "active" && "text-accent",
                  states[i] === "pending" && "text-muted",
                )}
              >
                {states[i] === "done" ? (
                  <Check aria-hidden className="size-4" />
                ) : states[i] === "active" ? (
                  <LoaderCircle aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Circle aria-hidden className="size-3.5" />
                )}
              </span>
              <span className={cn("flex-1 text-sm", states[i] === "pending" ? "text-muted" : "text-text")}>
                {step.label}
                {states[i] === "active" && "…"}
                <span className="sr-only"> ({states[i]})</span>
              </span>
              {step.detail && <span className="text-sm text-muted">{step.detail}</span>}
            </li>
          ))}
        </ol>
      </Card>

      {!done && (
        <p className="mt-6 flex items-start gap-2 text-sm text-muted">
          <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
          You can leave this page. We&apos;ll email you when it&apos;s done. Scans usually take a few minutes.
        </p>
      )}
      {done && (
        <ButtonLink href={destination} size="lg" className="mt-6 w-full sm:w-auto">
          See my results
        </ButtonLink>
      )}
    </div>
  );
}
