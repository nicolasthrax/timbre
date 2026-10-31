import { CircleCheck, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warn" | "danger";

const tones: Record<Tone, { className: string; Icon: typeof Info }> = {
  info: { className: "border-border bg-surface text-text", Icon: Info },
  success: { className: "border-accent/40 bg-accent/5 text-text", Icon: CircleCheck },
  warn: { className: "border-warn/40 bg-warn/5 text-text", Icon: TriangleAlert },
  danger: { className: "border-danger/40 bg-danger/5 text-text", Icon: OctagonAlert },
};

const iconColor: Record<Tone, string> = {
  info: "text-muted",
  success: "text-accent",
  warn: "text-warn",
  danger: "text-danger",
};

export function Banner({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { className: toneClass, Icon } = tones[tone];
  return (
    <div
      role={tone === "danger" || tone === "warn" ? "alert" : "status"}
      className={cn("flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start", toneClass, className)}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconColor[tone])} />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed text-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
