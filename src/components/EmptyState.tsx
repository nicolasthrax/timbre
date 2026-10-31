import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-card border border-dashed border-border px-6 py-10 text-center", className)}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-surface-2 text-muted">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-muted">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
