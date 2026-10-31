"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Paywall } from "@/components/Paywall";
import { SCENARIO_EVENT } from "@/components/ScenarioSync";
import { api, type User } from "@/lib/api";

interface SessionValue {
  /** `undefined` while loading, `null` when signed out. */
  me: User | null | undefined;
  refresh: () => Promise<User | null>;
  setMe: (user: User | null) => void;
  openPaywall: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<User | null | undefined>(undefined);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const refresh = useCallback(async () => {
    const user = await api.getMe();
    setMe(user);
    return user;
  }, []);

  useEffect(() => {
    let active = true;
    api.getMe().then((user) => {
      if (active) setMe(user);
    });
    const onScenario = () => void refresh();
    window.addEventListener(SCENARIO_EVENT, onScenario);
    return () => {
      active = false;
      window.removeEventListener(SCENARIO_EVENT, onScenario);
    };
  }, [refresh]);

  const openPaywall = useCallback(() => setPaywallOpen(true), []);

  const value = useMemo(() => ({ me, refresh, setMe, openPaywall }), [me, refresh, openPaywall]);

  return (
    <SessionContext.Provider value={value}>
      {children}
      <Paywall
        open={paywallOpen}
        lapsed={me?.plan === "lapsed"}
        onClose={() => setPaywallOpen(false)}
        onUpgraded={(user) => setMe(user)}
      />
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
