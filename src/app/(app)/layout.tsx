import type { Metadata } from "next";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
