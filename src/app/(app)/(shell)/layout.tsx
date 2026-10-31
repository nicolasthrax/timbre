"use client";

import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useSession } from "@/components/SessionProvider";

function Shell({ children }: { children: React.ReactNode }) {
  const { me } = useSession();
  if (!me) return null;
  return <AppShell user={me}>{children}</AppShell>;
}

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Shell>{children}</Shell>
    </RequireAuth>
  );
}
