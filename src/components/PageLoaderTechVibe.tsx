"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bootLines = [
    "mounting /portfolio/kernel",
    "loading cv.index.json",
    "syncing project vectors",
    "opening mcp tool registry",
    "establishing secure sse channel",
    "starting neko-core runtime",
];

const statusSteps = [
    "NEKO CORE v2.5",
    "AI ASSISTANT ONLINE",
    "PORTFOLIO READY",
];

export default function PageLoader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [activeLine, setActiveLine] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const matrixChars = useMemo(
        () =>
            Array.from({ length: 42 }, (_, index) => ({
                id: index,
                value: ["01", "AI", "MCP", "API", "SYS", "DB", "CTX"][index % 7],
                left: `${(index * 37) % 100}%`,
                delay: (index % 8) * 0.18,
                duration: 3 + (index % 5) * 0.35,
            })),
        []
    );

    useEffect(() => {
        const progressTimer = window.setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    window.clearInterval(progressTimer);
                    return 100;
                }
                return Math.min(prev + 2, 100);
            });
        }, 45);

        const lineTimer = window.setInterval(() => {
            setActiveLine((prev) => Math.min(prev + 1, bootLines.length - 1));
        }, 360);

        const statusTimer = window.setInterval(() => {
            setStatusIndex((prev) => Math.min(prev + 1, statusSteps.length - 1));
        }, 850);

        const doneTimer = window.setTimeout(() => {
            setLoading(false);
        }, 3100);

        return () => {
            window.clearInterval(progressTimer);
            window.clearInterval(lineTimer);
            window.clearInterval(statusTimer);
            window.clearTimeout(doneTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.02,
                        filter: "blur(10px)",
                        transition: { duration: 0.65, ease: "easeInOut" },
                    }}
                    className="fixed inset-0 z-[9999] overflow-hidden bg-background text-foreground"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,hsl(var(--primary)/0.18),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.12),transparent_35%)]" />

                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />

                    <div className="absolute inset-0 pointer-events-none">
                        {matrixChars.map((char) => (
                            <motion.span
                                key={char.id}
                                initial={{ y: "-12vh", opacity: 0 }}
                                animate={{ y: "112vh", opacity: [0, 0.45, 0.2, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: char.duration,
                                    delay: char.delay,
                                    ease: "linear",
                                }}
                                className="absolute top-0 font-mono text-[10px] text-primary/35"
                                style={{ left: char.left }}
                            >
                                {char.value}
                            </motion.span>
                        ))}
                    </div>

                    <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                        <div className="w-full max-w-5xl">
                            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
                                <motion.div
                                    initial={{ opacity: 0, x: -24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.55 }}
                                    className="rounded-3xl border border-primary/20 bg-background/55 p-5 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-2xl sm:p-6"
                                >
                                    <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-red-500/80" />
                                            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                            <span className="h-3 w-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">
                                            boot.console
                                        </span>
                                    </div>

                                    <div className="font-mono text-xs leading-7 sm:text-sm">
                                        <p className="text-primary">
                                            $ <span className="text-foreground">launch --profile senior-engineer</span>
                                        </p>

                                        <div className="mt-4 space-y-1.5">
                                            {bootLines.map((line, index) => {
                                                const isLoaded = index <= activeLine;
                                                return (
                                                    <motion.div
                                                        key={line}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: isLoaded ? 1 : 0.18, x: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="flex items-center gap-3 text-muted-foreground"
                                                    >
                                                        <span className={isLoaded ? "text-green-400" : "text-primary/30"}>
                                                            {isLoaded ? "✓" : "·"}
                                                        </span>
                                                        <span>{line}</span>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                                            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-primary/80">
                                                <span>initializing</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                <motion.div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-300 to-purple-400 shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.18 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.65, delay: 0.1 }}
                                    className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border border-dashed border-primary/25"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                        className="absolute inset-8 rounded-full border border-cyan-400/20"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.9, 0.45] }}
                                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                        className="absolute inset-16 rounded-full bg-primary/10 blur-2xl"
                                    />

                                    <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border border-primary/30 bg-background/70 shadow-[0_0_90px_rgba(34,211,238,0.18)] backdrop-blur-xl sm:h-64 sm:w-64">
                                        <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(120deg,transparent,rgba(34,211,238,0.12),transparent)]" />
                                        <div className="absolute left-6 right-6 top-7 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                        <div className="absolute bottom-7 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

                                        <div className="relative text-center font-mono">
                                            <motion.pre
                                                animate={{
                                                    textShadow: [
                                                        "0 0 12px rgba(34,211,238,0.45)",
                                                        "0 0 28px rgba(34,211,238,0.9)",
                                                        "0 0 12px rgba(34,211,238,0.45)",
                                                    ],
                                                }}
                                                transition={{ repeat: Infinity, duration: 1.8 }}
                                                className="select-none text-[24px] leading-[1.05] text-primary sm:text-[28px]"
                                            >{` /\\_/\\
 ( o.o )
 > ^ <`}</motion.pre>

                                            <motion.div
                                                key={statusIndex}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-5 text-[10px] uppercase tracking-[0.35em] text-cyan-300"
                                            >
                                                {statusSteps[statusIndex]}
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}