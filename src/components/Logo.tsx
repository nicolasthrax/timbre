import Link from "next/link";
import { cn } from "@/lib/cn";

/** Wordmark. Set in the body face at bold weight; no drawn mark until a real logo exists. */
export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("text-lg font-bold tracking-tight text-text", className)}>
      Timbre
    </Link>
  );
}
