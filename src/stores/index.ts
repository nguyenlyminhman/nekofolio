"use client";

import { create } from "zustand";

import {
  createChatStream,
  getChatHistory,
  initCookies as initCookiesApi,
} from "@/services/chatchit";
import type { Message } from "@/type/message";

type ChatState = {
  messages: Message[];
  isStreaming: boolean;
  initCookies: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  startStream: () => void;
  stopStream: () => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
};

let streamConnection: EventSource | null = null;
let cookieInitPromise: Promise<void> | null = null;

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

  startStream: () => {
    if (streamConnection) {
      return;
    }

    void get().initCookies().then(() => {
      if (streamConnection) {
        return;
      }

      streamConnection = createChatStream((incomingMessage) => {
        get().addMessage(incomingMessage);
      });

      set({ isStreaming: true });
    });
  },

  stopStream: () => {
    if (!streamConnection) {
      return;
    }

    streamConnection.close();
    streamConnection = null;
    set({ isStreaming: false });
  },

  addMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));