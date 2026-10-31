"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { Spinner } from "@/components/Spinner";

/** Redirects to /signin when signed out. TODO(real): enforce in proxy/middleware too. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { me } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (me === null) router.replace("/signin");
  }, [me, router]);

  if (!me) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label={me === null ? "Redirecting to sign in" : "Loading your account"} />
      </div>
    );
  }
  return <>{children}</>;
}
