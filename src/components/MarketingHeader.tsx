import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { SectionNav } from "@/components/SectionNav";

export function MarketingHeader() {
  return (
    <header className="chrome-site sticky top-0 z-30 border-b border-border/60 bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <SectionNav />
        <div className="flex items-center gap-2">
          <Link href="/signin" className="rounded-field px-3 py-2 text-sm text-muted hover:text-text">
            Sign in
          </Link>
          <ButtonLink href="/signin" size="sm" className="hidden sm:inline-flex">
            Hear my clone
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
