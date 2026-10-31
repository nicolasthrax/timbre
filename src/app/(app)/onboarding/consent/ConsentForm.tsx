"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useSession } from "@/components/SessionProvider";
import { CONSENT_VERSION, consentCopy } from "@/content/consent";
import { api } from "@/lib/api";

export function ConsentForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setError("Please tick the box to continue.");
      return;
    }
    setBusy(true);
    try {
      await api.recordConsent(CONSENT_VERSION);
      await refresh();
      router.push("/onboarding/enrol");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="animate-fade-up">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{consentCopy.title}</h1>
      <p className="mt-2 text-muted">{consentCopy.intro}</p>

      <ul className="mt-8 space-y-3">
        {consentCopy.stored.map((item) => (
          <li key={item.title} className="flex gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Check aria-hidden className="size-3.5" />
            </span>
            <div>
              <h2 className="font-medium">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <label className="mt-8 flex cursor-pointer gap-3 rounded-xl border border-border bg-surface-2 p-4 has-[:checked]:border-accent/50">
        <input
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setError(null);
          }}
          aria-describedby={error ? "consent-error" : undefined}
          className="mt-0.5 size-5 shrink-0 accent-[#2EE6C5]"
        />
        <span className="text-sm leading-relaxed">{consentCopy.checkbox}</span>
      </label>
      {error && (
        <p id="consent-error" role="alert" className="mt-2 text-sm text-[#ff8a8e]">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Consent version <span className="font-mono">{CONSENT_VERSION}</span> ·{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-text">
            Full privacy policy
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={busy || !agreed}>
          {busy ? "Saving…" : consentCopy.cta}
        </Button>
      </div>
    </form>
  );
}
