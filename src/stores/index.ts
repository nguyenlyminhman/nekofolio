"use client";

import { create } from "zustand";

import {
  getChatHistory,
  initCookies as initCookiesApi,
} from "@/services/chatchit";
import type { Message } from "@/type/message";

type ChatState = {
  messages: Message[];
  isStreaming: boolean;
  initCookies: () => Promise<void>;
  fetchHistory: () => Promise<void>;
};

let cookieInitPromise: Promise<void> | null = null;

export { useAuthStore } from "./auth-store";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,

  initCookies: async () => {
    if (!cookieInitPromise) {
      cookieInitPromise = initCookiesApi();
    }

    await cookieInitPromise;
  },

  fetchHistory: async () => {
    await get().initCookies();
    const history = await getChatHistory();
    set({ messages: history });
  },
}));
