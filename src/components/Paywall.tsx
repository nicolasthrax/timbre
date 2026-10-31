"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { PRICES, paywallCopy } from "@/content/pricing";
import { api, type BillingInterval, type User } from "@/lib/api";
import { cn } from "@/lib/cn";

export function Paywall({
  open,
  lapsed = false,
  onClose,
  onUpgraded,
}: {
  open: boolean;
  lapsed?: boolean;
  onClose: () => void;
  onUpgraded: (user: User) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [interval, setBillingInterval] = useState<BillingInterval>("year");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function upgrade() {
    setBusy(true);
    setError(null);
    try {
      // TODO(real): redirect to Stripe Checkout; plan updates via webhook.
      const user = await api.upgrade(interval);
      onUpgraded(user);
      onClose();
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="paywall-title"
      className="sheet m-0 mt-auto w-full max-w-none rounded-t-card border border-border bg-surface p-0 text-text sm:m-auto sm:max-w-md sm:rounded-card"
    >
      <div className="relative p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-field text-muted hover:bg-surface-2 hover:text-text"
        >
          <X aria-hidden className="size-5" />
          <span className="sr-only">Close</span>
        </button>
        <Badge tone="accent">Timbre Pro</Badge>
        <h2 id="paywall-title" className="mt-3 pr-8 text-xl font-semibold">
          {lapsed ? "Renew Pro to see your sources again" : paywallCopy.title}
        </h2>
        <p className="mt-2 text-sm text-muted">{paywallCopy.body}</p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {paywallCopy.unlocks.map((item) => (
            <li key={item} className="flex gap-2">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <fieldset className="mt-6">
          <legend className="sr-only">Billing period</legend>
          <div className="grid grid-cols-2 rounded-field border border-border bg-bg p-1">
            {/* Sliding indicator behind the chosen option; it shares the grid cell with "Monthly". */}
            <span
              aria-hidden
              className={cn(
                "col-start-1 row-start-1 rounded-field bg-surface ring-1 ring-field transition-transform duration-250 ease-out",
                interval === "year" && "translate-x-full",
              )}
            />
            {(["month", "year"] as const).map((value) => (
              <label
                key={value}
                className={cn(
                  "relative row-start-1 flex cursor-pointer items-center justify-center gap-2 rounded-field px-3 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  value === "month" ? "col-start-1" : "col-start-2",
                  interval === value ? "font-bold text-text" : "text-muted hover:text-text",
                )}
              >
                <input
                  type="radio"
                  name="interval"
                  value={value}
                  checked={interval === value}
                  onChange={() => setBillingInterval(value)}
                  className="sr-only"
                />
                {value === "month" ? "Monthly" : "Yearly"}
                {value === "year" && <span className="tabular-nums text-xs text-accent">−28%</span>}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-5 flex items-baseline gap-1 tabular-nums">
          <span key={interval} className="animate-enter text-3xl font-semibold">
            {PRICES[interval].label}
          </span>
          <span className="text-sm text-muted">{PRICES[interval].per}</span>
          {interval === "year" && <span className="ml-2 text-xs text-muted">≈ HK$49/month</span>}
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-danger">
            {error}
          </p>
        )}

        <Button onClick={upgrade} disabled={busy} size="lg" className="mt-5 w-full">
          {busy ? "Processing…" : paywallCopy.cta}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">{paywallCopy.mockNote} Cancel anytime.</p>
      </div>
    </dialog>
  );
}
