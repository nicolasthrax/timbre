"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { id: "how-it-works", label: "How it works" },
  { id: "family", label: "Your family" },
  { id: "faq", label: "FAQ" },
];

/**
 * Landing-page section links. On the home page an underline slides to the
 * section in the reading band (35–40% down the viewport); elsewhere none shows.
 */
export function SectionNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [inView, setInView] = useState<string | null>(null);
  const active = onHome ? inView : null;
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef(new Map<string, HTMLSpanElement>());

  useEffect(() => {
    if (!onHome) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setInView(links.find((l) => visible.has(l.id))?.id ?? null);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const { id } of links) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [onHome]);

  // Moves the underline with transform only; re-measures when fonts or the viewport change the nav's size.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    if (!nav || !bar) return;
    const place = () => {
      const label = active ? labelRefs.current.get(active) : undefined;
      if (!label) {
        bar.style.opacity = "0";
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const box = label.getBoundingClientRect();
      bar.style.transform = `translateX(${box.left - navBox.left}px) scaleX(${box.width / navBox.width})`;
      bar.style.opacity = "1";
    };
    place();
    const resize = new ResizeObserver(place);
    resize.observe(nav);
    return () => resize.disconnect();
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Main" className="relative hidden items-center gap-1 md:flex">
      {links.map((l) => (
        <Link
          key={l.id}
          href={`/#${l.id}`}
          aria-current={active === l.id ? "location" : undefined}
          className={cn(
            "rounded-field px-3 py-2 text-sm transition-colors duration-150",
            active === l.id ? "text-text" : "text-muted hover:text-text",
          )}
        >
          <span
            ref={(el) => {
              if (el) labelRefs.current.set(l.id, el);
              else labelRefs.current.delete(l.id);
            }}
          >
            {l.label}
          </span>
        </Link>
      ))}
      <span
        ref={barRef}
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-text opacity-0 transition duration-250 ease-out"
        style={{ transform: "scaleX(0)" }}
      />
    </nav>
  );
}
