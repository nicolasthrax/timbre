"use client";

import { useEffect } from "react";
import { mockControls } from "@/lib/api";
import { isScenario } from "@/lib/api/mock-data";

export const SCENARIO_EVENT = "timbre:scenario-change";

/** Applies `?scenario=high|none|partial|lapsed` to the mock backend (dev only). */
export function ScenarioSync() {
  useEffect(() => {
    if (!mockControls) return;
    const value = new URLSearchParams(window.location.search).get("scenario");
    if (isScenario(value) && value !== mockControls.getScenario()) {
      mockControls.setScenario(value);
      window.dispatchEvent(new Event(SCENARIO_EVENT));
    }
  }, []);
  return null;
}
