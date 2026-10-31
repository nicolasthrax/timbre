import { Info, OctagonAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import type { RiskLevel } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { RISK_TOOLTIP, riskCopy } from "@/lib/risk";

const styles: Record<RiskLevel, { className: string; Icon: typeof Info }> = {
  low: { className: "border-success/40 bg-success/10 text-success", Icon: ShieldCheck },
  medium: { className: "border-warn/40 bg-warn/10 text-warn", Icon: TriangleAlert },
  high: { className: "border-warn/50 bg-warn/10 text-warn", Icon: TriangleAlert },
  critical: { className: "border-danger/50 bg-danger/10 text-danger", Icon: OctagonAlert },
};

/** Risk level with icon + label (never colour alone) and an "exposure estimate" tooltip. */
export function RiskBadge({
  level,
  size = "md",
  tooltip = true,
}: {
  level: RiskLevel;
  size?: "md" | "lg";
  tooltip?: boolean;
}) {
  const { className, Icon } = styles[level];
  const tipId = `risk-tip-${level}`;
  return (
    <span className="group relative inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium",
          size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs",
          className,
        )}
      >
        <Icon aria-hidden className={size === "lg" ? "size-4" : "size-3.5"} />
        <span>{riskCopy[level].label} risk</span>
      </span>
      {tooltip && (
        <>
          <button
            type="button"
            aria-describedby={tipId}
            className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:text-text"
          >
            <Info aria-hidden className="size-4" />
            <span className="sr-only">What does this mean?</span>
          </button>
          <span
            id={tipId}
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-64 max-w-[calc(100vw-2rem)] rounded-field border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted group-hover:block group-focus-within:block sm:left-0 sm:right-auto"
          >
            <strong className="mb-1 block font-medium text-text">Exposure estimate</strong>
            {RISK_TOOLTIP}
          </span>
        </>
      )}
    </span>
  );
}
