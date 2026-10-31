import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)}>
      <rect width="24" height="24" rx="7" fill="#13161B" stroke="#262B33" />
      {[6, 9, 12, 15, 18].map((x, i) => {
        const h = [6, 11, 14, 9, 5][i];
        return (
          <rect key={x} x={x - 1} y={12 - h / 2} width="2" height={h} rx="1" fill={i === 2 ? "#2EE6C5" : "#9AA1AC"} />
        );
      })}
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 font-semibold tracking-tight text-text", className)}>
      <LogoMark />
      <span>
        Timbre<span className="ml-1 font-mono text-xs font-normal text-muted">AI</span>
      </span>
    </Link>
  );
}
