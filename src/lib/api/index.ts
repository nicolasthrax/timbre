import type { TimbreApi } from "./client";
import { MockTimbreApi } from "./mock";
import { SupabaseTimbreApi } from "./supabase";

export type ApiMode = "mock" | "supabase";

export const API_MODE: ApiMode =
  process.env.NEXT_PUBLIC_API_MODE === "supabase" ? "supabase" : "mock";

/** The single entry point UI code uses. Swap the implementation here. */
export const api: TimbreApi =
  API_MODE === "supabase" ? new SupabaseTimbreApi() : new MockTimbreApi();

/** Dev-only scenario controls. `null` outside mock mode. */
export const mockControls: MockTimbreApi | null =
  api instanceof MockTimbreApi ? api : null;

export type { TimbreApi } from "./client";
export * from "./types";
