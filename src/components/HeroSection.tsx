"use client";

import { motion } from "framer-motion";

const techStack = [
  "NestJS",
  "Spring Boot",
  "React",
  "PostgreSQL",
  "AWS",
  "Docker",
  "AI",
];

const stats = [
  { value: "7+", label: "Years Experience" },
  { value: "10+", label: "Projects Delivered" },
  { value: "1K+", label: "API Requests" },
];

const systemSignals = [
  { label: "API Gateway", value: "99.9%", status: "stable" },
  { label: "Event Bus", value: "24ms", status: "fast" },
  { label: "AI Agent", value: "online", status: "ready" },
];

const codeLines = [
  "const engineer = 'Nguyen Ly Minh Man';",
  "build({ backend: 'scalable', cloud: 'aws' });",
  "ship('microservices', 'ai-systems', 'fintech');",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 lg:pt-28">
      {/* Tech Grid Background */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]
          bg-[size:56px_56px]
          pointer-events-none
        "
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Floating Circuit Lines */}
      <div className="absolute inset-x-0 top-32 hidden h-72 overflow-hidden opacity-40 lg:block pointer-events-none">
        <div className="absolute left-10 top-12 h-px w-64 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute right-20 top-32 h-px w-72 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        <div className="absolute left-1/3 top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>

      <div className="section-container relative z-10 flex min-h-[calc(100vh-6rem)] items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-center lg:text-left"
          >
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background/60 px-4 py-2 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Backend Engineer • AI Builder
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              Build.
              <br />
              Scale.
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(34,211,238,0.22)]">
                Automate.
              </span>
            </h1>

            <p className="mt-7 text-xl font-semibold sm:text-2xl">
              Nguyễn Lý Minh Mẫn
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              I design backend-first platforms, microservices, cloud systems,
              and AI-powered products with a strong focus on reliability,
              clean architecture, and production-ready engineering.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className="
                    rounded-full border border-primary/15 bg-primary/[0.06]
                    px-4 py-2 font-mono text-xs text-foreground/85
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                    transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10
                  "
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#projects"
                className="group relative w-full overflow-hidden rounded-2xl bg-primary px-8 py-3.5 text-center font-semibold text-primary-foreground shadow-[0_0_36px_rgba(34,211,238,0.2)] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <span className="relative z-10">Explore Projects</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </a>

              <a
                href="#contact"
                className="w-full rounded-2xl border border-border/70 bg-background/50 px-8 py-3.5 text-center font-semibold backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:w-auto"
              >
                Contact Me
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-xl"
                >
                  <div className="text-2xl font-black sm:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Tech Visual */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/15 via-primary/10 to-purple-500/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/65 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  Terminal
                </span>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl border border-primary/15 bg-black/20 p-4 font-mono text-sm">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Runtime Profile
                  </p>
                  <div className="space-y-3">
                    {codeLines.map((line, index) => (
                      <motion.p
                        key={line}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + index * 0.16 }}
                        className="text-foreground/85"
                      >
                        <span className="mr-3 text-primary">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-cyan-300">{line}</span>
                      </motion.p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {systemSignals.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-card/45 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                        <span className="font-mono text-[10px] uppercase text-muted-foreground">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-xl font-black">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/45 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Delivery Pipeline
                    </p>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      passing
                    </span>
                  </div>

                  <div className="space-y-3">
                    {["Design", "Build", "Test", "Deploy"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs">
                          {index + 1}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${92 - index * 9}%` }}
                            transition={{ delay: 0.65 + index * 0.12, duration: 0.7 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-purple-400"
                          />
                        </div>
                        <span className="w-16 text-right text-sm text-muted-foreground">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;