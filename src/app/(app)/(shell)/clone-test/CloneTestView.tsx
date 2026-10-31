"use client";

import { ArrowRight, FlaskConical, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Banner } from "@/components/Banner";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ClonePlayer } from "@/components/ClonePlayer";
import { Recorder } from "@/components/Recorder";
import { useSession } from "@/components/SessionProvider";
import { Spinner } from "@/components/Spinner";
import { Waveform } from "@/components/Waveform";
import { cloneTestCopy } from "@/content/cloneTest";
import { api, type CloneTestResult } from "@/lib/api";
import { formatDate } from "@/lib/format";

type Step = "intro" | "record" | "generating" | "result";

function Safeguards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {cloneTestCopy.safeguards.map((s) => (
        <li key={s.title} className="rounded-xl border border-border bg-surface p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck aria-hidden className="size-4 text-accent" />
            {s.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function LockedCloneTest({ onUpgrade, lapsed }: { onUpgrade: () => void; lapsed: boolean }) {
  return (
    <div className="space-y-6" data-testid="clone-test-locked">
      <Card className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none opacity-40 blur-[2px]">
          <Waveform bars={48} seed={31} className="h-20" />
        </div>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2">
              <Lock aria-hidden className="size-4 text-accent" />
            </span>
            <div>
              <h2 className="font-semibold">{cloneTestCopy.lockedTitle}</h2>
              <p className="mt-1 max-w-lg text-sm text-muted">{cloneTestCopy.lockedBody}</p>
            </div>
          </div>
          <Button onClick={onUpgrade} className="shrink-0">
            {lapsed ? "Renew Pro" : "Upgrade to Pro"}
          </Button>
        </div>
      </Card>
      <Safeguards />
    </div>
  );
}

export function CloneTestView({ phrase }: { phrase: string }) {
  const { me, openPaywall } = useSession();
  const [step, setStep] = useState<Step>("intro");
  const [result, setResult] = useState<CloneTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<"real" | "clone" | null>(null);

  if (!me) return null;

  async function generate(sample: Blob) {
    setStep("generating");
    setError(null);
    try {
      setResult(await api.requestCloneTest(sample));
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate the clone.");
      setStep("record");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <FlaskConical aria-hidden className="size-6 text-accent" />
          {cloneTestCopy.title}
        </h1>
        <p className="mt-1 text-muted">{cloneTestCopy.intro}</p>
      </div>

      {me.plan !== "pro" ? (
        <LockedCloneTest onUpgrade={openPaywall} lapsed={me.plan === "lapsed"} />
      ) : (
        <div data-testid="clone-test-unlocked" className="space-y-6">
          {step === "intro" && (
            <>
              <Safeguards />
              <Button size="lg" onClick={() => setStep("record")}>
                Start clone test
              </Button>
            </>
          )}

          {step === "record" && (
            <Card>
              <h2 className="font-semibold">Read this phrase aloud</h2>
              <p className="mt-1 text-sm text-muted">This re-verifies that it&apos;s your voice. It takes a few seconds.</p>
              {error && <Banner tone="warn" title="Something went wrong" className="mt-4">{error}</Banner>}
              <div className="mt-5">
                <Recorder phrases={[phrase]} minSeconds={3} submitLabel="Generate clone" onComplete={generate} />
              </div>
            </Card>
          )}

          {step === "generating" && (
            <Card className="flex flex-col items-center py-12 text-center">
              <Waveform bars={32} seed={41} animated className="h-14 max-w-xs" />
              <Spinner label={cloneTestCopy.generating} className="mt-6" />
            </Card>
          )}

          {step === "result" && result && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <ClonePlayer
                  label="Real"
                  src={result.realAudioUrl}
                  seed={51}
                  active={activePlayer === "real"}
                  onPlay={() => setActivePlayer("real")}
                />
                <ClonePlayer
                  label="Clone"
                  src={result.cloneAudioUrl}
                  seed={51}
                  watermarked
                  active={activePlayer === "clone"}
                  onPlay={() => setActivePlayer("clone")}
                />
              </div>
              <Card>
                <h2 className="text-sm font-medium">Transcript (both clips)</h2>
                <p className="mt-2 text-lg leading-relaxed">“{result.sentence}”</p>
                <p className="mt-4 text-xs text-muted">
                  Preview build: both clips are placeholder audio. The clone is watermarked and deleted when you leave this page
                  (expires {formatDate(result.expiresAt)}).
                </p>
              </Card>
              <Banner tone="info" title="Why this matters">
                A few minutes of public audio is enough to make a clone like this. The less of your voice that&apos;s public, the
                harder it is to make one that fools your family.
              </Banner>
              <ButtonLink href="/dashboard" size="lg">
                {cloneTestCopy.cta}
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}
