"use client";

import { create } from "zustand";

import { ADMIN_AUTH_TOKEN_STORAGE_KEY, ADMIN_AUTH_USER_STORAGE_KEY } from "@/lib/auth-constants";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => void;
  setToken: (token: string) => void;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearToken: () => void;
};

function readTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
}

function readUserFromStorage(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(ADMIN_AUTH_USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: () => {
    set({
      token: readTokenFromStorage(),
      user: readUserFromStorage(),
      hydrated: true,
    });
  },

  setToken: (token) => {
    localStorage.setItem(ADMIN_AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.removeItem(ADMIN_AUTH_USER_STORAGE_KEY);
    set({ token, user: null, hydrated: true });
  },

  setSession: (accessToken, user) => {
    localStorage.setItem(ADMIN_AUTH_TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(ADMIN_AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    set({ token: accessToken, user, hydrated: true });
  },

  clearToken: () => {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_AUTH_USER_STORAGE_KEY);
    set({ token: null, user: null, hydrated: true });
  },
}));
