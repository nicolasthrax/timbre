import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page so route changes animate (CSS in globals.css). Links tagged
 * `nav-forward` or `nav-back` slide; every other navigation fades and rises.
 * It goes in each page, not a layout, because layouts persist across
 * navigations and never enter or exit. Updates inside the page do not animate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
