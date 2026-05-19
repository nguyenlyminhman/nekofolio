"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useChatStore } from "@/stores";

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

const ChatbotWidget = () => {
  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const message = useChatStore((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [showPing, setShowPing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingBotMsgId, setStreamingBotMsgId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const streamBufferRef = useRef("");
  const streamTimerRef = useRef<number | null>(null);
  const flushStreamBufferRef = useRef<() => void>(() => undefined);
  const activeBotMessageIdRef = useRef<string | null>(null);
  const isStreamDoneRef = useRef(false);

  const closeSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const focusTextarea = useCallback(() => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
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

      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    });
  }, []);

  const updateBotMessage = useCallback((id: string, content: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)));
  }, []);

  const clearStreamTimer = useCallback(() => {
    if (streamTimerRef.current !== null) {
      window.clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  }, []);

  const finishStream = useCallback(() => {
    clearStreamTimer();
    closeSSE();

    streamBufferRef.current = "";
    activeBotMessageIdRef.current = null;
    isStreamDoneRef.current = false;

    setIsTyping(false);
    setStreamingBotMsgId(null);

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
      streamTimerRef.current = window.setTimeout(() => {
        flushStreamBufferRef.current();
      }, STREAM_FRAME_MS);
      return;
    }

    streamTimerRef.current = null;

    if (isStreamDoneRef.current) {
      finishStream();
    }
  }, [clearStreamTimer, finishStream, scrollToBottom]);

  useEffect(() => {
    flushStreamBufferRef.current = flushStreamBuffer;
  }, [flushStreamBuffer]);

  const enqueueStreamChunk = useCallback(
    (chunk: string) => {
      streamBufferRef.current += chunk;

      if (streamTimerRef.current === null) {
        streamTimerRef.current = window.setTimeout(() => {
          flushStreamBufferRef.current();
        }, 0);
      }
    },
    []
  );

  const terminateStream = useCallback(() => {
    if (streamBufferRef.current.length > 0) {
      isStreamDoneRef.current = true;

      if (streamTimerRef.current === null) {
        flushStreamBufferRef.current();
      }

      return;
    }

    finishStream();
  }, [finishStream]);

  const startStreaming = useCallback(
    (userQuery: string) => {
      if (isTyping) return;

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

      const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/stream?message=${encodeURIComponent(
        userQuery
      )}`;

      const es = new EventSource(sseUrl, { withCredentials: true });
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            streamBufferRef.current = "";
            updateBotMessage(botMsgId, data.message);
            terminateStream();
            return;
          }

          if (data.done) {
            terminateStream();
            return;
          }

          if (data.chunk) {
            enqueueStreamChunk(data.chunk);
          }
        } catch (err) {
          console.error("Lỗi parse:", err);
        }
      };

      es.onerror = () => {
        streamBufferRef.current = "";
        updateBotMessage(
          botMsgId,
          `Hình như đường truyền giữa chúng mình vừa có chút 'nấc cụt'. Bạn thử gửi lại tin nhắn giúp Neko nhé! ✨\nLooks like our connection just had a little 'hiccup.' Could you please resend that message for Neko? ✨`
        );
        terminateStream();
      };
    },
    [
      clearStreamTimer,
      closeSSE,
      enqueueStreamChunk,
      isTyping,
      scrollToBottom,
      terminateStream,
      updateBotMessage,
    ]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
      e?.preventDefault();

      const trimmed = input.trim();
      if (!trimmed || isTyping) {
        focusTextarea();
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, role: "hr", content: trimmed },
      ]);

      setInput("");
      resetTextareaHeight();
      focusTextarea();
      scrollToBottom("smooth");
      startStreaming(trimmed);
    },
    [focusTextarea, input, isTyping, resetTextareaHeight, scrollToBottom, startStreaming]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(true);
      focusTextarea();
    }, 3000);

    fetchHistory().catch(console.error);

    return () => window.clearTimeout(t);
  }, [fetchHistory, focusTextarea]);

  useEffect(() => {
    if (isTyping) return;
    if (!message || !Array.isArray(message) || message.length === 0) return;

    const historyMsgs: Message[] = message.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const missingHistoryMsgs = historyMsgs.filter((m) => !existingIds.has(m.id));

      if (prev.length === 1 && prev[0]?.id === initialMessage.id) {
        return [initialMessage, ...historyMsgs];
      }

      if (missingHistoryMsgs.length === 0) {
        return prev;
      }

      return [...prev, ...missingHistoryMsgs];
    });
  }, [isTyping, message]);

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

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chatbot:opened"));
    }

    focusTextarea();
  };

  return (
    <>
      <style>{`
        @keyframes chatbotCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="trigger"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={handleOpen}
              aria-label="Open chat assistant"
              className="relative flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg group"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary)), hsl(174 60% 38%))",
                boxShadow:
                  "0 0 0 1px hsl(var(--primary) / 0.4), 0 8px 30px -8px hsl(var(--primary) / 0.6), 0 0 40px -10px hsl(var(--primary) / 0.5)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: "hsl(var(--primary) / 0.35)",
                  animationDuration: "2.4s",
                  display: showPing ? "block" : "none",
                }}
              />
              <Bot size={24} strokeWidth={1.8} className="relative z-10" />
            </motion.button>
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
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 flex h-[540px] max-h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border sm:w-[380px]"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--primary) / 0.25)",
              boxShadow:
                "0 0 0 1px hsl(var(--primary) / 0.1), 0 24px 60px -20px hsl(0 0% 0% / 0.6), 0 0 50px -10px hsl(var(--primary) / 0.25)",
            }}
            role="dialog"
            aria-label="AI chat assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))",
                    border: "1px solid hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Bot size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    {BOT_NAME}
                  </p>
                  <p className="font-mono-accent flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {isTyping ? "Typing…" : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 
                scrollbar-thin
                scrollbar-thumb-rounded-full
                scrollbar-track-rounded-full

                scrollbar-track-transparent
                scrollbar-thumb-primary/50
                hover:scrollbar-thumb-primary/50
              ">
              {messages.map((m) => {
                const isCurrentStreamingBotMessage = m.id === streamingBotMsgId;
                const showTypingDots = isTyping && isCurrentStreamingBotMessage && m.content === "";
                const showCursor = isTyping && isCurrentStreamingBotMessage && m.content !== "";

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "hr" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "hr"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary border text-foreground"
                        }`}
                    >
                      <div className="prose prose-sm dark:prose-invert break-words whitespace-pre-line">
                        {m.content}
                        {showCursor && (
                          <span
                            aria-hidden="true"
                            className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 rounded-sm bg-current"
                            style={{ animation: "chatbotCursorBlink 1s infinite" }}
                          />
                        )}
                      </div>

                      {showTypingDots && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>Neko is typing</span>
                          <span className="h-1 w-1 rounded-full bg-current animate-bounce" />
                          <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.3s]" />
                          <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.6s]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 border-t bg-background/80 px-3 py-3 backdrop-blur-sm"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div
                className="flex flex-1 items-end rounded-2xl border bg-background/40 transition-all focus-within:ring-1"
                style={{
                  borderColor: "hsl(var(--primary) / 0.35)",
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.08)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  rows={1}
                  disabled={isTyping}
                  placeholder={isTyping ? "Đang trả lời…" : "Ask me anything…"}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleSubmit(e);
                    }
                  }}
                  className="max-h-40 min-h-[48px] flex-1 resize-none overflow-y-auto bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="mb-2 mr-2 mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: "hsl(var(--primary))" }}
                  onClick={focusTextarea}
                >
                  {isTyping ? (
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <Send size={16} strokeWidth={2} />
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
