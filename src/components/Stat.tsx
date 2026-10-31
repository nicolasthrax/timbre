import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Stat({
  label,
  value,
  unit,
  hint,
  size = "md",
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  size?: "md" | "xl";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5 font-mono tabular-nums text-text">
        <span className={size === "xl" ? "text-7xl font-semibold tracking-tight sm:text-8xl" : "text-2xl font-semibold"}>
          {value}
        </span>
        {unit && <span className={size === "xl" ? "text-2xl text-muted" : "text-sm text-muted"}>{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
