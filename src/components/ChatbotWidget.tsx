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
  content: `Hi there! I'm ${BOT_NAME}, ManNguyen's AI assistant. Need help finding something in his portfolio, or want to book a call?

Heads up: this chat uses minimal cookies to remember our conversation — no personal data is shared.`,
};

const STREAM_FRAME_MS = 16;
const STREAM_CHARS_PER_FRAME = 4;

const ChatbotWidget = () => {
  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const historyMessages = useChatStore((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [showPing, setShowPing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingBotMsgId, setStreamingBotMsgId] = useState<string | null>(
    null
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // IMPORTANT: prevent duplicate submit
  const submittingRef = useRef(false);

  const streamBufferRef = useRef("");
  const streamTimerRef = useRef<number | null>(null);
  const activeBotMessageIdRef = useRef<string | null>(null);
  const isStreamDoneRef = useRef(false);

  // ===============================
  // HELPERS
  // ===============================

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

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      requestAnimationFrame(() => {
        const el = scrollRef.current;

        if (!el) return;

        el.scrollTo({
          top: el.scrollHeight,
          behavior,
        });
      });
    },
    []
  );

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

  const updateBotMessage = useCallback(
    (id: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content } : m))
      );
    },
    []
  );

  // ===============================
  // STREAM
  // ===============================

  const finishStream = useCallback(() => {
    clearStreamTimer();
    closeSSE();

    streamBufferRef.current = "";
    activeBotMessageIdRef.current = null;
    isStreamDoneRef.current = false;

    setIsTyping(false);
    setStreamingBotMsgId(null);

    // unlock submit
    submittingRef.current = false;

    focusTextarea();
  }, [clearStreamTimer, closeSSE, focusTextarea]);

  const flushStreamBuffer = useCallback(() => {
    const botMsgId = activeBotMessageIdRef.current;

    if (!botMsgId) {
      clearStreamTimer();
      return;
    }

    const nextChunk = streamBufferRef.current.slice(
      0,
      STREAM_CHARS_PER_FRAME
    );

    streamBufferRef.current = streamBufferRef.current.slice(
      STREAM_CHARS_PER_FRAME
    );

    if (nextChunk) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                content: m.content + nextChunk,
              }
            : m
        )
      );

      scrollToBottom("auto");
    }

    if (streamBufferRef.current.length > 0) {
      streamTimerRef.current = window.setTimeout(() => {
        flushStreamBuffer();
      }, STREAM_FRAME_MS);

      return;
    }

    streamTimerRef.current = null;

    if (isStreamDoneRef.current) {
      finishStream();
    }
  }, [clearStreamTimer, finishStream, scrollToBottom]);

  const enqueueStreamChunk = useCallback(
    (chunk: string) => {
      streamBufferRef.current += chunk;

      if (streamTimerRef.current === null) {
        streamTimerRef.current = window.setTimeout(() => {
          flushStreamBuffer();
        }, 0);
      }
    },
    [flushStreamBuffer]
  );

  const terminateStream = useCallback(() => {
    if (streamBufferRef.current.length > 0) {
      isStreamDoneRef.current = true;

      if (streamTimerRef.current === null) {
        flushStreamBuffer();
      }

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

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "bot",
          content: "",
        },
      ]);

      scrollToBottom("smooth");

      const sessionId =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("sessionId="))
          ?.split("=")[1] ?? "";

      const sseUrl = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/v1/chat/stream?message=${encodeURIComponent(userQuery)}${
        sessionId
          ? `&sessionId=${encodeURIComponent(sessionId)}`
          : ""
      }`;

      const es = new EventSource(sseUrl, {
        withCredentials: true,
      });

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

            // IMPORTANT
            es.close();
            eventSourceRef.current = null;

            terminateStream();

            return;
          }

          if (data.chunk) {
            enqueueStreamChunk(data.chunk);
          }
        } catch (err) {
          console.error("SSE Parse Error:", err);
        }
      };

      es.onerror = () => {
        // ignore normal close
        if (isStreamDoneRef.current) {
          return;
        }

        streamBufferRef.current = "";

        updateBotMessage(
          botMsgId,
          `Connection hiccup. Please resend your message ✨`
        );

        es.close();

        terminateStream();
      };
    },
    [
      clearStreamTimer,
      closeSSE,
      enqueueStreamChunk,
      scrollToBottom,
      terminateStream,
      updateBotMessage,
    ]
  );

  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();

    // IMPORTANT
    if (!trimmed) return;

    // prevent duplicate submit
    if (submittingRef.current) return;

    submittingRef.current = true;

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role: "hr",
        content: trimmed,
      },
    ]);

    setInput("");

    resetTextareaHeight();

    focusTextarea();

    scrollToBottom("smooth");

    startStreaming(trimmed);
  }, [
    focusTextarea,
    input,
    resetTextareaHeight,
    scrollToBottom,
    startStreaming,
  ]);

  // ===============================
  // EFFECTS
  // ===============================

  useEffect(() => {
    const handleRemoteOpen = () => {
      setOpen(true);
      setShowPing(false); // Tắt hiệu ứng ping thông báo nếu đã chủ động mở chat
    };

    window.addEventListener("open-portfolio-chatbot", handleRemoteOpen);
    return () => {
      window.removeEventListener("open-portfolio-chatbot", handleRemoteOpen);
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(true);
      focusTextarea();
    }, 3000);

    fetchHistory().catch(console.error);

    return () => {
      window.clearTimeout(t);
    };
  }, [fetchHistory, focusTextarea]);

  // merge history safely
  useEffect(() => {
    if (!historyMessages?.length) return;

    const mapped: Message[] = historyMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => {
      const merged = [...prev, ...mapped];

      return Array.from(
        new Map(merged.map((m) => [m.id, m])).values()
      );
    });
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

  // ===============================
  // UI
  // ===============================

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
      `}</style>

      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="trigger"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              onClick={handleOpen}
              className="relative flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg"
            >
              <Bot size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="window"
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span>{BOT_NAME}</span>
              </div>

              <button onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            >
              {messages.map((m) => {
                const isCurrentStreamingBotMessage =
                  m.id === streamingBotMsgId;

                const showTypingDots =
                  isTyping &&
                  isCurrentStreamingBotMessage &&
                  m.content === "";

                const showCursor =
                  isTyping &&
                  isCurrentStreamingBotMessage &&
                  m.content !== "";

                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "hr"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                        m.role === "hr"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {m.content}

                      {showCursor && (
                        <span
                          className="ml-1 inline-block h-4 w-1 bg-current"
                          style={{
                            animation:
                              "chatbotCursorBlink 1s infinite",
                          }}
                        />
                      )}

                      {showTypingDots && (
                        <div className="mt-1 text-xs opacity-70">
                          Neko is typing...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
              }}
              className="border-t p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  rows={1}
                  disabled={isTyping}
                  placeholder={
                    isTyping
                      ? "Đang trả lời..."
                      : "Ask me anything..."
                  }
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea();
                  }}
                  // IMPORTANT FIX
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();

                      (
                        e.currentTarget.form as HTMLFormElement
                      )?.requestSubmit();
                    }
                  }}
                  className="max-h-40 flex-1 resize-none rounded-xl border px-4 py-3"
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