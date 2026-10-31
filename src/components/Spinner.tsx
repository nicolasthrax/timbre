import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm text-muted", className)}>
      <LoaderCircle aria-hidden className="size-4 animate-spin" />
      <span>{label}</span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-field bg-surface-2", className)} />;
}
