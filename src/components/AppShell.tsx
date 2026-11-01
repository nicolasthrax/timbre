"use client";

import { AudioLines, FlaskConical, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { api, type User } from "@/lib/api";
import { cn } from "@/lib/cn";

const items = [
  { href: "/dashboard", label: "Exposure", Icon: AudioLines, match: ["/dashboard", "/results", "/sources", "/scan"] },
  { href: "/clone-test", label: "Clone test", Icon: FlaskConical, match: ["/clone-test"] },
  { href: "/settings", label: "Settings", Icon: Settings, match: ["/settings"] },
];

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    await api.signOut();
    router.push("/");
  }

  const links = (onNavigate?: () => void) => (
    <ul className="space-y-1">
      {items.map(({ href, label, Icon, match }) => {
        const active = match.some((m) => pathname.startsWith(m));
        return (
          <li key={label}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-field px-3 py-2.5 text-sm transition-colors",
                active ? "bg-surface-2 text-text" : "text-muted hover:bg-surface-2/60 hover:text-text",
              )}
            >
              <Icon aria-hidden className={cn("size-4", active && "text-accent")} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 rounded-field border border-border px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm" title={user.email}>
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-field text-muted hover:bg-surface-2 hover:text-text"
        >
          <LogOut aria-hidden className="size-4" />
          <span className="sr-only">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col justify-between border-r border-border bg-surface/40 p-4 lg:flex">
        <div>
          <div className="px-2 py-2">
            <Logo href={items[0].href} />
          </div>
          <nav aria-label="App" className="mt-6">
            {links()}
          </nav>
        </div>
        {footer}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo href={items[0].href} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-field text-muted hover:bg-surface-2 hover:text-text"
            >
              {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-nav" aria-label="App" className="space-y-4 border-t border-border px-4 pb-4 pt-3">
            {links(() => setMenuOpen(false))}
            {footer}
          </nav>
        )}
      </header>

      <main id="main" className="min-w-0">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
