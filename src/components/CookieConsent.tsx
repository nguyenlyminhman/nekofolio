"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "cookie-consent-v1";
const CHAT_FLAG_EVENT = "chatbot:opened";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : "accepted";
    if (stored) return;

    const t = setTimeout(() => setVisible(true), 1200);

    const handleChatOpened = () => {
      // If user engages with the chatbot first, dismiss the bar — disclaimer lives there.
      localStorage.setItem(STORAGE_KEY, "acknowledged-via-chat");
      setVisible(false);
    };
    window.addEventListener(CHAT_FLAG_EVENT, handleChatOpened);

    return () => {
      clearTimeout(t);
      window.removeEventListener(CHAT_FLAG_EVENT, handleChatOpened);
    };
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto mx-auto max-w-3xl flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-md"
            style={{
              background: "hsl(var(--card) / 0.92)",
              borderColor: "hsl(var(--primary) / 0.2)",
              boxShadow: "0 10px 30px -10px hsl(0 0% 0% / 0.6)",
            }}
          >
            <Cookie size={16} className="text-primary shrink-0" strokeWidth={1.8} />
            <p className="text-xs sm:text-[13px] text-foreground/90 leading-snug flex-1">
              This site uses minimal cookies for analytics and to improve your experience.
            </p>
            <button
              onClick={accept}
              className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ background: "hsl(var(--primary))" }}
            >
              Got it
            </button>
            <button
              onClick={accept}
              aria-label="Dismiss"
              className="shrink-0 h-7 w-7 -mr-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;