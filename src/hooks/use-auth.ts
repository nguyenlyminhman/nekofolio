"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const setToken = useAuthStore((s) => s.setToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearToken = useAuthStore((s) => s.clearToken);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return {
    token,
    user,
    hydrated,
    isAuthenticated: Boolean(token),
    setToken,
    setSession,
    clearToken,
    hydrate,
  };
}
