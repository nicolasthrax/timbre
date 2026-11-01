import type { Metadata } from "next";
import { DashboardView } from "./DashboardView";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PageTransition>
      <DashboardView />
    </PageTransition>
  );
}
