import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#family", label: "Your family" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-field px-3 py-2 text-sm text-muted hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>
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
