import type { Metadata } from "next";
import { connection } from "next/server";
import { pickPhrases } from "@/content/phrases";
import { EnrolClient } from "./EnrolClient";

export const metadata: Metadata = { title: "Record your voice" };

export default async function EnrolPage() {
  // Render per request so every visit gets a fresh random set (liveness check).
  await connection();
  return <EnrolClient phrases={pickPhrases(3)} />;
}
