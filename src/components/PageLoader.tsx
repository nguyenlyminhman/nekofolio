"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";

export default function PageLoader() {
    const [loading, setLoading] = useState(true);
    const [animationData, setAnimationData] = useState<any>(null);

    // 1. Fetch JSON mèo nhảy múa từ thư mục public
    useEffect(() => {
        fetch("/dancing-cat.json")
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Lỗi load lottie:", err));

        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: -50,
                        transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
                >
                    {/* Box đũy mèo Lottie */}
                    <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                        {animationData && (
                            <Lottie animationData={animationData} loop={true} />
                        )}
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-1.5 font-mono text-[11px] sm:text-xs tracking-widest text-primary/90">
                        <div className="flex items-center">
                            {"INITIALIZING NEKO ECOSYSTEM...".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        delay: 0.3 + index * 0.04,
                                        duration: 0.01,
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}

                            <span
                                className="ml-1 inline-block w-1.5 h-3.5 bg-primary"
                                style={{ animation: "hackerCursorBlink 0.8s steps(2, start) infinite" }}
                            />
                        </div>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0.2, 0.5, 0] }}
                            transition={{ delay: 1.6, duration: 0.4 }}
                            className="text-[9px] text-muted-foreground lowercase font-mono tracking-normal"
                        >
                            [sys.info] secure sse tunnel established.
                        </motion.span>

                        <style>{`
                            @keyframes hackerCursorBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                            }
                        `}</style>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}