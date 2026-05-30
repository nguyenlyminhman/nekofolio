"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bootLogs = [
  { tag: "OK", text: "Loading portfolio shell" },
  { tag: "OK", text: "Hydrating project database" },
  { tag: "OK", text: "Connecting MCP tools" },
  { tag: "OK", text: "Waking up backend services" },
  { tag: "WARN", text: "Coffee level critical" },
  { tag: "OK", text: "Recruiter mode enabled" },
];

const asciiNeko = [" /\\_/\\", "( o.o )", " > ^ <"];

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(1);

  const bootText = useMemo(() => "booting nekofolio.exe", []);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.floor(Math.random() * 9) + 4, 100);
      });
    }, 140);

    const logTimer = window.setInterval(() => {
      setVisibleLogs((prev) => Math.min(prev + 1, bootLogs.length));
    }, 360);

    const exitTimer = window.setTimeout(() => {
      setLoading(false);
    }, 3200);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(logTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020617] px-4 text-foreground"
        >
          <style>{`
            @keyframes nekoScan {
              0% { transform: translateY(-100%); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translateY(220%); opacity: 0; }
            }

            @keyframes nekoCursor {
              0%, 45% { opacity: 1; }
              46%, 100% { opacity: 0; }
            }

            @keyframes nekoFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `}</style>

          {/* Cyber grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-50" />
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-120px] right-[-80px] h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/75 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="h-24 bg-gradient-to-b from-cyan-300/0 via-cyan-300/10 to-cyan-300/0" style={{ animation: "nekoScan 2.2s ease-in-out infinite" }} />
            </div>

            {/* Terminal header */}
            <div className="relative flex items-center justify-between border-b border-cyan-400/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">
                NEKO DEV BIOS v2.5
              </div>
            </div>

            <div className="relative grid gap-6 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:p-8">
              {/* Left: hologram neko */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-400/10 bg-white/[0.03] p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  className="absolute h-40 w-40 rounded-full border border-dashed border-cyan-300/20"
                />

                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/5 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
                  <div className="absolute h-28 w-28 rounded-full border border-purple-300/15" />
                  <div className="font-mono text-lg leading-7 text-cyan-200 drop-shadow-[0_0_14px_rgba(34,211,238,0.55)]" style={{ animation: "nekoFloat 2.6s ease-in-out infinite" }}>
                    {asciiNeko.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200">
                  ai assistant online
                </div>
              </div>

              {/* Right: boot console */}
              <div className="flex flex-col justify-center">
                <div className="font-mono text-xs text-cyan-200/90">
                  <span className="text-purple-300">$</span> {bootText}
                  <span className="ml-1 inline-block h-4 w-2 bg-cyan-300 align-middle" style={{ animation: "nekoCursor 0.9s steps(2,start) infinite" }} />
                </div>

                <div className="mt-5 space-y-2 font-mono text-[11px] sm:text-xs">
                  {bootLogs.slice(0, visibleLogs).map((log, index) => (
                    <motion.div
                      key={`${log.tag}-${log.text}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.03 }}
                      className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.025] px-3 py-2"
                    >
                      <span
                        className={
                          log.tag === "WARN"
                            ? "text-yellow-300"
                            : "text-emerald-300"
                        }
                      >
                        [{log.tag}]
                      </span>
                      <span className="text-slate-300">{log.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    <span>system load</span>
                    <span className="text-cyan-300">{progress}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full border border-cyan-300/20 bg-slate-900">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-purple-400/15 bg-purple-400/5 px-4 py-3 font-mono text-[11px] text-purple-100/85">
                  STATUS: <span className="text-cyan-200">READY TO FLEX</span>
                  <span className="text-slate-500">  {"// professional mode, but make it fun"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}