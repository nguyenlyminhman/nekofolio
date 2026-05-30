"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Terminal } from "lucide-react";
import { useChatStore } from "@/stores";
import Lottie from "lottie-react";


type Message = {
  id: string;
  role: "bot" | "hr";
  content: string;
};

const BOT_NAME = "Neko";

const initialMessage: Message = {
  id: "welcome",
  role: "bot",
  content: `Hi there! I'm ${BOT_NAME}, ManNguyen's AI assistant. Need help finding something in his portfolio, or want to book a call?\n\nHeads up: this chat uses minimal cookies to remember our conversation — no personal data is shared.`,
};

const STREAM_FRAME_MS = 16;
const STREAM_CHARS_PER_FRAME = 4;

const HologramNeko = ({ active = false }: { active?: boolean }) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/dancing-cat.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lỗi load lottie:", err));
  }, []);



  return (
    <div className="">
      {/* <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-primary/20 border-t-primary/70"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-cyan-400/20 border-b-cyan-300/70"
      />
      <motion.div
        animate={{ scale: active ? [1, 1.08, 1] : [1, 1.04, 1], opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: active ? 0.9 : 2.4, repeat: Infinity }}
        className="absolute inset-3 rounded-full bg-primary/10 blur-md"
      /> */}

      {/* <svg
        viewBox="0 0 120 120"
        className="relative z-10 h-12 w-12 drop-shadow-[0_0_18px_hsl(var(--primary)/0.65)] sm:h-16 sm:w-16"
        fill="none"
      >
        <path
          d="M32 48 L24 24 L47 39 M88 48 L96 24 L73 39"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        <path
          d="M28 55 C28 35 92 35 92 55 V74 C92 92 28 92 28 74 V55Z"
          stroke="currentColor"
          strokeWidth="4"
          className="text-cyan-300"
        />
        <motion.circle
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          cx="48"
          cy="64"
          r="5"
          fill="currentColor"
          className="text-primary"
        />
        <motion.circle
          animate={{ opacity: [1, 0.45, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          cx="72"
          cy="64"
          r="5"
          fill="currentColor"
          className="text-primary"
        />
        <path
          d="M56 78 H64 M45 86 H75"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-cyan-200/80"
        />
        <path
          d="M35 54 H85 M38 92 H82"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-primary/30"
        />
      </svg> */}

      <Lottie animationData={animationData} loop={true} />

    </div>
  );
};

const ChatbotWidget = () => {
  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const historyMessages = useChatStore((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [showPing, setShowPing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingBotMsgId, setStreamingBotMsgId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const submittingRef = useRef(false);
  const streamBufferRef = useRef("");
  const streamTimerRef = useRef<number | null>(null);
  const activeBotMessageIdRef = useRef<string | null>(null);
  const isStreamDoneRef = useRef(false);
  const flushStreamBufferRef = useRef<() => void>(() => { });

  const focusTextarea = useCallback(() => {
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const resetTextareaHeight = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
  }, []);

  const autoResizeTextarea = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  }, []);

  const closeSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const clearStreamTimer = useCallback(() => {
    if (streamTimerRef.current !== null) {
      window.clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  }, []);

  const updateBotMessage = useCallback((id: string, content: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)));
  }, []);

  const finishStream = useCallback(() => {
    clearStreamTimer();
    closeSSE();
    streamBufferRef.current = "";
    activeBotMessageIdRef.current = null;
    isStreamDoneRef.current = false;
    setIsTyping(false);
    setStreamingBotMsgId(null);
    submittingRef.current = false;
    focusTextarea();
  }, [clearStreamTimer, closeSSE, focusTextarea]);

  const flushStreamBuffer = useCallback(() => {
    const botMsgId = activeBotMessageIdRef.current;
    if (!botMsgId) {
      clearStreamTimer();
      return;
    }

    const nextChunk = streamBufferRef.current.slice(0, STREAM_CHARS_PER_FRAME);
    streamBufferRef.current = streamBufferRef.current.slice(STREAM_CHARS_PER_FRAME);

    if (nextChunk) {
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, content: m.content + nextChunk } : m))
      );
      scrollToBottom("auto");
    }

    if (streamBufferRef.current.length > 0) {
      streamTimerRef.current = window.setTimeout(() => flushStreamBufferRef.current(), STREAM_FRAME_MS);
      return;
    }

    streamTimerRef.current = null;
    if (isStreamDoneRef.current) finishStream();
  }, [clearStreamTimer, finishStream, scrollToBottom]);

  useEffect(() => {
    flushStreamBufferRef.current = flushStreamBuffer;
  }, [flushStreamBuffer]);

  const enqueueStreamChunk = useCallback(
    (chunk: string) => {
      streamBufferRef.current += chunk;
      if (streamTimerRef.current === null) {
        streamTimerRef.current = window.setTimeout(() => flushStreamBuffer(), 0);
      }
    },
    [flushStreamBuffer]
  );

  const terminateStream = useCallback(() => {
    if (streamBufferRef.current.length > 0) {
      isStreamDoneRef.current = true;
      if (streamTimerRef.current === null) flushStreamBuffer();
      return;
    }
    finishStream();
  }, [finishStream, flushStreamBuffer]);

  const startStreaming = useCallback(
    (userQuery: string) => {
      closeSSE();
      clearStreamTimer();
      streamBufferRef.current = "";
      isStreamDoneRef.current = false;
      setIsTyping(true);

      const botMsgId = `${Date.now()}-bot`;
      activeBotMessageIdRef.current = botMsgId;
      setStreamingBotMsgId(botMsgId);

      setMessages((prev) => [...prev, { id: botMsgId, role: "bot", content: "" }]);
      scrollToBottom("smooth");

      const sessionId =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("sessionId="))
          ?.split("=")[1] ?? "";

      const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/stream?message=${encodeURIComponent(userQuery)}${sessionId ? `&sessionId=${encodeURIComponent(sessionId)}` : ""
        }`;

      const es = new EventSource(sseUrl, { withCredentials: true });
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            streamBufferRef.current = "";
            updateBotMessage(botMsgId, data.message);
            es.close();
            terminateStream();
            return;
          }

          if (data.done) {
            isStreamDoneRef.current = true;
            es.close();
            eventSourceRef.current = null;
            terminateStream();
            return;
          }

          if (data.chunk) enqueueStreamChunk(data.chunk);
        } catch (err) {
          console.error("SSE Parse Error:", err);
        }
      };

      es.onerror = () => {
        if (isStreamDoneRef.current) return;
        streamBufferRef.current = "";
        updateBotMessage(botMsgId, "Connection hiccup. Please resend your message ✨");
        es.close();
        terminateStream();
      };
    },
    [clearStreamTimer, closeSSE, enqueueStreamChunk, scrollToBottom, terminateStream, updateBotMessage]
  );

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || submittingRef.current) return;

    submittingRef.current = true;
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, role: "hr", content: trimmed }]);
    setInput("");
    resetTextareaHeight();
    focusTextarea();
    scrollToBottom("smooth");
    startStreaming(trimmed);
  }, [focusTextarea, input, resetTextareaHeight, scrollToBottom, startStreaming]);

  useEffect(() => {
    const handleRemoteOpen = () => {
      setOpen(true);
      setShowPing(false);
      focusTextarea();
    };

    window.addEventListener("open-portfolio-chatbot", handleRemoteOpen);
    return () => window.removeEventListener("open-portfolio-chatbot", handleRemoteOpen);
  }, [focusTextarea]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(true);
      focusTextarea();
    }, 12000);

    fetchHistory().catch(console.error);
    return () => window.clearTimeout(t);
  }, [fetchHistory, focusTextarea]);

  useEffect(() => {
    if (!historyMessages?.length) return;

    const mapped: Message[] = historyMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => Array.from(new Map([...prev, ...mapped].map((m) => [m.id, m])).values()));
  }, [historyMessages]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      closeSSE();
      clearStreamTimer();
    };
  }, [clearStreamTimer, closeSSE]);

  const handleOpen = () => {
    setOpen(true);
    setShowPing(false);
    focusTextarea();
  };

  return (
    <>
      <style>{`
        @keyframes chatbotCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes nekoTerminalScan {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(220%); opacity: 0; }
        }
      `}</style>

      {/* Floating terminal CTA */}
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {!open && (
            <motion.div
              key="terminal-trigger"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group flex items-end gap-3"
            >
              <motion.button
                type="button"
                onClick={handleOpen}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="hidden max-w-[260px] overflow-hidden rounded-2xl border border-primary/25 bg-background/80 text-left shadow-[0_0_40px_hsl(var(--primary)/0.18)] backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_55px_hsl(var(--primary)/0.28)] sm:block"
                aria-label="Open Neko AI assistant"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-primary/10 to-transparent" />
                  <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-cyan-300/15 to-transparent" style={{ animation: "nekoTerminalScan 2.4s linear infinite" }} />

                  <div className="flex items-center justify-between border-b border-primary/15 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400/80" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                      <span className="h-2 w-2 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-primary/80">
                      <Terminal size={11} />
                      recruiter console
                    </div>
                  </div>

                  <div className="relative px-4 py-3 font-mono">
                    {/* <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                      recruiter console
                    </div> */}

                    <div className="text-[12px] leading-relaxed text-foreground">
                      <span className="text-primary">$</span> ask-neko --about Man
                      <span
                        className="ml-1 inline-block h-3 w-1 translate-y-0.5 bg-primary"
                        style={{ animation: "chatbotCursorBlink 0.9s infinite" }}
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="mt-2 text-[10px] leading-relaxed text-muted-foreground"
                    >
                      Experience • Projects • Tech stack • Availability
                    </motion.div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleOpen}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                // className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-[0_0_36px_hsl(var(--primary)/0.32)] backdrop-blur-xl sm:h-24 sm:w-24"
                className="relative flex h-16 w-16 items-center justify-center rounded-full text-primary backdrop-blur-xl sm:h-24 sm:w-24"
                aria-label="Open Neko AI assistant"
              >
                {showPing && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-primary/35"
                    animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
                <HologramNeko />
              </motion.button>

              {/* <motion.button
                type="button"
                onClick={handleOpen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-[72px] right-0 rounded-xl border border-primary/25 bg-background/90 px-3 py-2 font-mono text-[10px] text-primary shadow-[0_0_25px_hsl(var(--primary)/0.2)] backdrop-blur-xl sm:hidden"
              >
                $ ask-neko --start
              </motion.button> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed inset-0 z-50 m-0 flex flex-col overflow-hidden rounded-none border-primary/20 bg-card shadow-[0_0_50px_hsl(var(--primary)/0.18)] sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[540px] sm:w-[380px] sm:rounded-2xl sm:border"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-primary" strokeWidth={1.8} />
                <p className="font-mono-accent flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {isTyping ? "Processing…" : "Online"}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  setShowPing(true);
                }}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => {
                const isCurrentStreamingBotMessage = m.id === streamingBotMsgId;
                const showTypingDots = isTyping && isCurrentStreamingBotMessage && m.content === "";
                const showCursor = isTyping && isCurrentStreamingBotMessage && m.content !== "";

                return (
                  <div key={m.id} className={`flex ${m.role === "hr" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${m.role === "hr" ? "bg-primary text-primary-foreground" : "bg-secondary"
                        }`}
                    >
                      {m.content}
                      {showCursor && (
                        <span
                          className="ml-1 inline-block h-4 w-1 bg-current"
                          style={{ animation: "chatbotCursorBlink 1s infinite" }}
                        />
                      )}
                      {showTypingDots && <div className="mt-1 text-xs opacity-70">Neko is processing...</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="border-t border-border/60 p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  rows={1}
                  disabled={isTyping}
                  placeholder={isTyping ? "Đang trả lời..." : "Ask me anything..."}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
                    }
                  }}
                  className="max-h-40 flex-1 resize-none rounded-xl border border-border/70 bg-background/60 px-4 py-3 outline-none transition-colors focus:border-primary/50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {isTyping ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;