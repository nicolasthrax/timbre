"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * An <ol> whose items rise into place as they are scrolled into view
 * (globals.css, .reveal-list). Where CSS scroll timelines exist the motion is
 * tied to scroll position and this component does nothing. Elsewhere it falls
 * back to a timed pop-in when each item enters, staggered for items entering
 * together, and only when the list starts below the fold.
 */
export function RevealList({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (CSS.supports("animation-timeline: view()")) return;
    if (list.getBoundingClientRect().top < window.innerHeight) return;
    list.dataset.armed = "";
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, order) => {
            const item = entry.target as HTMLElement;
            item.style.setProperty("--reveal-delay", `${order * 120}ms`);
            item.dataset.shown = "";
            observer.unobserve(item);
          });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    for (const item of Array.from(list.children)) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={`reveal-list ${className ?? ""}`}>
      {children}
    </ol>
  );
}
