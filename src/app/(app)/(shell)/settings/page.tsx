import type { Metadata } from "next";
import { SettingsView } from "./SettingsView";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PageTransition>
      <SettingsView />
    </PageTransition>
  );
}
