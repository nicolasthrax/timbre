"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const STEPS = [
  { path: "/onboarding/consent", label: "Consent" },
  { path: "/onboarding/enrol", label: "Voice" },
  { path: "/onboarding/accounts", label: "Accounts" },
];

export function OnboardingSteps() {
  const pathname = usePathname();
  const current = STEPS.findIndex((s) => pathname.startsWith(s.path));
  return (
    <nav aria-label="Onboarding progress">
      <p className="font-mono text-xs text-muted sm:hidden">
        Step {current + 1} of {STEPS.length}
      </p>
      <ol className="hidden items-center gap-2 sm:flex">
        {STEPS.map((step, i) => (
          <li key={step.path} className="flex items-center gap-2">
            <span
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                i === current
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : i < current
                    ? "border-border text-text"
                    : "border-border text-muted",
              )}
            >
              <span className="font-mono">{i + 1}</span>
              {step.label}
              {i < current && <span className="sr-only">(done)</span>}
            </span>
            {i < STEPS.length - 1 && <span aria-hidden className="h-px w-4 bg-border" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
