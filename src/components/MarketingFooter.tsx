import Link from "next/link";
import { Logo } from "@/components/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-muted">
            We show where your voice is publicly exposed and help you reduce it. Made in Hong Kong.
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/privacy" className="text-muted hover:text-text">Privacy</Link>
          <Link href="/terms" className="text-muted hover:text-text">Terms</Link>
          <Link href="/signin" className="text-muted hover:text-text">Sign in</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 tabular-nums text-xs text-muted sm:px-6">© 2026 Timbre AI</p>
    </footer>
  );
}
