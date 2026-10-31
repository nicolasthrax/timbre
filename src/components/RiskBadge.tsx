import { Info, OctagonAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import type { RiskLevel } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { RISK_TOOLTIP, riskCopy } from "@/lib/risk";

const styles: Record<RiskLevel, { className: string; Icon: typeof Info }> = {
  low: { className: "border-accent/40 bg-accent/10 text-accent", Icon: ShieldCheck },
  medium: { className: "border-warn/40 bg-warn/10 text-warn", Icon: TriangleAlert },
  high: { className: "border-warn/50 bg-warn/15 text-warn", Icon: TriangleAlert },
  critical: { className: "border-danger/50 bg-danger/15 text-[#ff8a8e]", Icon: OctagonAlert },
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
            className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <strong className="mb-1 block font-medium text-text">Exposure estimate</strong>
            {RISK_TOOLTIP}
          </span>
        </>
      )}
    </span>
  );
}
