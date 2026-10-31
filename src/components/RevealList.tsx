"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * An <ol> whose items pop in as they scroll into view (globals.css, .reveal-list).
 * Items that enter together are staggered. It only arms itself when the list
 * starts below the fold, so without JS, on reload mid-page, or under reduced
 * motion every item is simply visible.
 */
export function RevealList({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
