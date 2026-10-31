import Link from "next/link";

/** Minimal top bar for the hero previews, styled entirely from --hero-* tokens. */
export function HeroLabNav() {
  return (
    <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link href="/" className="text-lg font-bold text-hero-ink">
        Timbre
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/#how-it-works" className="hidden text-hero-muted hover:text-hero-ink sm:inline">
          How it works
        </Link>
        <Link href="/#pricing" className="hidden text-hero-muted hover:text-hero-ink sm:inline">
          Pricing
        </Link>
        <Link href="/signin" className="font-medium text-hero-ink underline-offset-4 hover:underline">
          Sign in
        </Link>
      </div>
    </nav>
  );
}
