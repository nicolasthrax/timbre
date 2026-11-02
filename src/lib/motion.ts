"use client";

/**
 * Motion presets shared by the landing moments (DESIGN.md, Motion). Durations
 * mirror the CSS tokens in globals.css so library and CSS animation stay in one
 * family. `motion` turns these into reduced-motion-safe variants on its own:
 * with prefers-reduced-motion set, enter animations land instantly at their end
 * state and layout values jump instead of tweening.
 */

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** --duration-moment: a section's one orchestrated beat. */
export const momentMs = 0.7;
/** --duration-enter: small states and labels. */
export const enterMs = 0.25;

/** Rise from below with a fade, the default entrance for copy. */
export const riseIn = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: momentMs, ease: easeOut },
} as const;

/** A container that hands its children a staggered rise. */
export const staggerParent = {
  initial: {},
  whileInView: {},
  viewport: { once: true, amount: 0.3 },
} as const;

export const staggerChild = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: momentMs, ease: easeOut },
} as const;
