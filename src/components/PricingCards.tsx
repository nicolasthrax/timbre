import { Check, Lock } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { PRICES, plans } from "@/content/pricing";

export function PricingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col rounded-card border border-border bg-surface p-6">
        <h3 className="text-lg font-semibold">{plans.free.name}</h3>
        <p className="mt-1 text-sm text-muted">{plans.free.tagline}</p>
        <p className="mt-6 tabular-nums text-4xl font-semibold">{plans.free.price}</p>
        <ul className="mt-6 flex-1 space-y-3 text-sm">
          {plans.free.features.map((f) => (
            <li key={f} className="flex gap-2">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {f}
            </li>
          ))}
          {plans.free.excluded.map((f) => (
            <li key={f} className="flex gap-2 text-muted">
              <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <ButtonLink href="/signin" variant="secondary" className="mt-8">
          Start free scan
        </ButtonLink>
      </div>
      <div className="relative flex flex-col overflow-hidden rounded-card border-2 border-accent bg-surface p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{plans.pro.name}</h3>
          <Badge tone="accent">{PRICES.year.saving} yearly</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">{plans.pro.tagline}</p>
        <p className="mt-6 flex items-baseline gap-1 tabular-nums">
          <span className="text-4xl font-semibold">{PRICES.month.label}</span>
          <span className="text-sm text-muted">{PRICES.month.per}</span>
        </p>
        <p className="mt-1 tabular-nums text-sm text-muted">
          or {PRICES.year.label}
          {PRICES.year.per}
        </p>
        <ul className="mt-6 flex-1 space-y-3 text-sm">
          {plans.pro.features.map((f) => (
            <li key={f} className="flex gap-2">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {f}
            </li>
          ))}
        </ul>
        <ButtonLink href="/signin" className="mt-8">
          Scan free, upgrade later
        </ButtonLink>
      </div>
    </div>
  );
}
