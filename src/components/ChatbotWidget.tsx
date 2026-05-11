"use client";
import ReactMarkdown from "react-markdown"; // Import thêm cái này
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, FileText, CalendarCheck, Cpu } from "lucide-react";
import { useChatStore } from "@/stores";


type Message = {
  id: string;
  role: "bot" | "hr";
  content: string;
  streaming?: boolean;
};

const BOT_NAME = "Manos";

const initialMessage: Message = {
  id: "welcome",
  role: "bot",
  content: `Hi there! I'm ${BOT_NAME}, ManNguyen's AI assistant. Need help finding something in his portfolio, or want to book a call?\n\nHeads up: this chat uses minimal cookies to remember our conversation — no personal data is shared.`,
};

const ChatbotWidget = () => {
  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const message = useChatStore((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showPing, setShowPing] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    // Xóa flag streaming khỏi message cuối
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false } : m))
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 3000);

    fetchHistory().catch(console.error);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (message.length === 0) return;

    // Map Message từ store (role: "hr"|"bot") sang Message local widget
    const historyMsgs: Message[] = message.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));

    // Đặt lịch sử trước initialMessage chào hỏi
    setMessages([initialMessage, ...historyMsgs]);
  }, [message]);

  useEffect(() => {
    return () => closeSSE();
  }, []);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isTyping) return;

    handleSubmit(e);
    resetTextareaHeight();
  };

  const startStreaming = (userQuery: string) => {
    if (isTyping) return; // Chống gửi tin nhắn khi đang stream

    closeSSE();
    setIsTyping(true);

    const botMsgId = `${Date.now()}-bot`;
    setMessages((prev) => [...prev, { id: botMsgId, role: "bot", content: "" }]);

    const sseUrl = `http://localhost:3001/api/v1/chat/stream?message=${encodeURIComponent(userQuery)}`;
    const es = new EventSource(sseUrl, { withCredentials: true });
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          updateBotMessage(botMsgId, data.message);
          terminateStream();
          return;
        }

        if (data.done) {
          terminateStream();
          return;
        }

        // Cập nhật từng chunk
        if (data.chunk) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, content: m.content + data.chunk } : m
            )
          );
        }
      } catch (err) {
        console.error("Lỗi parse:", err);
      }
    };

    es.onerror = () => {
      updateBotMessage(botMsgId, `Hình như đường truyền giữa chúng mình vừa có chút 'nấc cụt'. Bạn thử gửi lại tin nhắn giúp Manny nhé! ✨
        \nLooks like our connection just had a little 'hiccup.' Could you please resend that message for Manny? ✨`);
      terminateStream();
    };
  };

  // Hàm helper để dọn dẹp
  const terminateStream = () => {
    closeSSE();
    setIsTyping(false);
    // Sau khi bot trả lời xong, fetch lại để đồng bộ với server
    fetchHistory().catch(console.error);
  };

  const updateBotMessage = (id: string, content: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)));
  };

  useEffect(() => {
    if (hasGreeted) return;
    const t = setTimeout(() => setHasGreeted(true), 1500);
    return () => clearTimeout(t);
  }, [hasGreeted]);

  // Auto-scroll mỗi khi messages thay đổi (bao gồm khi chunk mới tới)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    setShowPing(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chatbot:opened"));
    }
  };

  const pushMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    pushMessage({ role: "hr", content: trimmed });
    setInput("");
    startStreaming(trimmed);
  };

  return (
    <>
      {/* CSS cho cursor nhấp nháy — inject 1 lần */}
      <style>{`
        @keyframes blink {
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
              className="relative h-14 w-14 rounded-full flex items-center justify-center text-primary-foreground shadow-lg group"
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
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[380px] h-[540px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border"
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
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))",
                    border: "1px solid hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Bot size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {BOT_NAME}
                  </p>
                  <p className="font-mono-accent text-[10px] text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {isStreaming ? "Typing…" : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "hr" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "hr" ? "bg-primary text-primary-foreground" : "bg-secondary border text-foreground"
                      }`}
                  >
                    {/* Dùng Markdown để text hiện lên mượt và đúng định dạng */}
                    <div className="prose prose-sm dark:prose-invert break-words whitespace-pre-line">
                      {m.content}
                    </div>

                    {isTyping && m.id.endsWith("-bot") && m.content === "" && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Manny is typing</span>
                        <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                        <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="
                flex items-end gap-2
                px-3 py-3
                border-t
                bg-background/80
                backdrop-blur-sm
              "
              style={{
                borderColor: "hsl(var(--border))",
              }}
            >
              <div
                className="flex-1 flex items-end rounded-2xl border bg-background/40 transition-all focus-within:ring-1"
                style={{
                  borderColor: "hsl(var(--primary) / 0.35)",
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.08)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  rows={1}
                  disabled={isStreaming}
                  placeholder={isStreaming ? "Đang trả lời…" : "Ask me anything…"}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResizeTextarea();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      if (!input.trim()) return;

                      handleSubmit(e as any);

                      setInput("");

                      setTimeout(() => {
                        resetTextareaHeight();
                      }, 0);
                    }
                  }}
                  className="flex-1 resize-none overflow-y-auto bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-4 py-3 min-h-[48px] max-h-40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 mb-2 mr-2 mt-2 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "hsl(var(--primary))",
                  }}
                >
                  {isTyping ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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