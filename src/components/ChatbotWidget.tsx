"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, FileText, CalendarCheck, Cpu } from "lucide-react";

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
};

const BOT_NAME = "Manny";
const RESUME_URL = "/resume.pdf";
const CALENDLY_URL = "https://calendly.com/nguyenlyminhman";

const quickReplies = [
  {
    id: "resume",
    label: "View resume",
    icon: FileText,
    emoji: "📄",
    action: "link" as const,
    href: RESUME_URL,
    response:
      "Opening Mẫn's resume in a new tab. It covers 7+ years across fintech, banking systems, and AI-driven platforms.",
  },
  {
    id: "meeting",
    label: "Schedule a meeting",
    icon: CalendarCheck,
    emoji: "🤝",
    action: "link" as const,
    href: CALENDLY_URL,
    response:
      "Great — opening the booking page. Pick any 30-minute slot that works for you and Mẫn will confirm shortly.",
  },
  {
    id: "stack",
    label: "Tell me about the tech stack",
    icon: Cpu,
    emoji: "🛠️",
    action: "reply" as const,
    response:
      "Core stack: Node.js, NestJS, Go, and Python on the backend; React, Next.js, and TypeScript on the frontend. Architecture leans on microservices, event-driven systems (Kafka, RabbitMQ), PostgreSQL/MongoDB, and Kubernetes on AWS/GCP. Lately also building with LLMs and MCP.",
  },
];

const initialMessage: Message = {
  id: "welcome",
  role: "bot",
  content: `Hi there! I'm ${BOT_NAME}, Mẫn's AI assistant. Need help finding something in his portfolio, or want to book a call?\n\nHeads up: this chat uses minimal cookies to remember our conversation — no personal data is shared.`,
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showPing, setShowPing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-open greeting once after a short delay
  useEffect(() => {
    if (hasGreeted) return;
    const t = setTimeout(() => {
      setHasGreeted(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [hasGreeted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleOpen = () => {
    setOpen(true);
    setShowPing(false);
    // Notify the cookie bar so it can dismiss itself — disclaimer now lives in the welcome message.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chatbot:opened"));
    }
  };

  const pushMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: `${Date.now()}-${Math.random()}` }]);
  };

  const handleQuickReply = (reply: (typeof quickReplies)[number]) => {
    pushMessage({ role: "user", content: `${reply.emoji} ${reply.label}` });
    setTimeout(() => {
      pushMessage({ role: "bot", content: reply.response });
      if (reply.action === "link" && reply.href) {
        window.open(reply.href, "_blank", "noopener,noreferrer");
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    pushMessage({ role: "user", content: trimmed });
    setInput("");
    setTimeout(() => {
      pushMessage({
        role: "bot",
        content:
          "Thanks for the message! For a detailed reply, please use the quick actions above or email nguyenlyminhman@gmail.com — Mẫn will get back to you within 24 hours.",
      });
    }, 600);
  };

  return (
    <>
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
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(174 60% 38%))",
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
                    background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))",
                    border: "1px solid hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Bot size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{BOT_NAME}</p>
                  <p className="font-mono-accent text-[10px] text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Online
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm text-primary-foreground"
                        : "rounded-bl-sm text-foreground"
                    }`}
                    style={
                      m.role === "user"
                        ? { background: "hsl(var(--primary))" }
                        : {
                            background: "hsl(var(--secondary))",
                            border: "1px solid hsl(var(--border))",
                          }
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {/* Quick replies (shown only after initial greeting) */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex flex-col gap-2 pt-1"
                >
                  {quickReplies.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickReply(q)}
                      className="flex items-center gap-2.5 text-left text-sm px-3.5 py-2.5 rounded-xl transition-all"
                      style={{
                        background: "hsl(var(--secondary) / 0.5)",
                        border: "1px solid hsl(var(--primary) / 0.25)",
                        color: "hsl(var(--foreground))",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "hsl(var(--primary) / 0.1)";
                        e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "hsl(var(--secondary) / 0.5)";
                        e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.25)";
                      }}
                    >
                      <q.icon size={15} className="text-primary shrink-0" strokeWidth={1.8} />
                      <span>{q.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-primary-foreground transition-opacity disabled:opacity-40"
                style={{ background: "hsl(var(--primary))" }}
              >
                <Send size={15} strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
