"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { Waveform } from "@/components/Waveform";
import { cn } from "@/lib/cn";

export interface PlatformStop {
  title: string;
  body: string;
  /** Example find shown on the card for this platform. */
  example: { where: string; detail: string; range: [number, number] };
}

function ExampleFind({ stop, seed }: { stop: PlatformStop; seed: number }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold">{stop.title}</p>
        <Badge>Example</Badge>
      </div>
      <Waveform bars={36} seed={seed} highlight={[stop.example.range]} className="mt-4 h-14" />
      <p className="mt-4 font-bold">{stop.example.where}</p>
      <p className="text-sm text-muted">{stop.example.detail}</p>
    </div>
  );
}

/**
 * "What we look for": from lg up, the card stays put while the list scrolls and
 * shows an example find for the platform in the reading band. Below lg each
 * platform carries its own card, so nothing depends on scroll position.
 */
export function PlatformTour({ stops }: { stops: PlatformStop[] }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const item of itemRefs.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ol className="space-y-10 lg:space-y-0">
        {stops.map((stop, i) => (
          <li
            key={stop.title}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-index={i}
            className="lg:flex lg:min-h-72 lg:items-center"
          >
            <div
              className={cn(
                "lg:border-l-2 lg:pl-6 lg:transition-colors lg:duration-300",
                active === i ? "lg:border-text" : "lg:border-border",
              )}
            >
              <h3
                className={cn(
                  "text-xl font-bold transition-colors duration-300",
                  active === i ? "text-text" : "lg:text-muted",
                )}
              >
                {stop.title}
              </h3>
              <p className="mt-2 max-w-copy leading-relaxed text-muted">{stop.body}</p>
              <div className="mt-5 lg:hidden">
                <ExampleFind stop={stop} seed={11 + i * 6} />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div aria-hidden className="hidden lg:block">
        <div className="sticky top-1/3">
          <div key={active} className="animate-swap">
            <ExampleFind stop={stops[active]} seed={11 + active * 6} />
          </div>
        </div>
      </div>
    </div>
  );
}
