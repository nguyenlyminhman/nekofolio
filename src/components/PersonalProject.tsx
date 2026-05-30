"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  DatabaseZap,
  MessageSquareCode,
  Radio,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

const personalProjects = [
  {
    name: "AI-Powered Portfolio Chatbot",
    tagline: "Recruiter-facing AI assistant for my live portfolio.",
    description:
      "A smart, interactive chatbot integrated into my Live Portfolio Website, designed to help HR and recruiters explore candidate information, professional experience, technical skills, and project highlights in real time.",
    tech: [
      "NestJS",
      "SSE",
      "Socket.io",
      "Next.js",
      "Gemini API",
      "MCP",
      "PostgreSQL",
    ],
    contributions: [
      {
        title: "Session-aware backend",
        desc: "Built NestJS services with PostgreSQL persistence for session state, message history, and recruiter conversations.",
        icon: DatabaseZap,
      },
      {
        title: "MCP tool layer",
        desc: "Exposed CV details and project data to the LLM through Model Context Protocol tools with controlled context access.",
        icon: BrainCircuit,
      },
      {
        title: "Streaming UX",
        desc: "Designed a responsive Next.js chat UI with smooth real-time streaming responses and a lightweight interaction flow.",
        icon: Radio,
      },
      {
        title: "Prompt safety",
        desc: "Optimized prompts, boundaries, and context retrieval so the assistant answers professionally without hallucinating.",
        icon: ShieldCheck,
      },
    ],
  },
];

const metrics = [
  { value: "01", label: "Live AI product" },
  { value: "MCP", label: "Tool-based context" },
  { value: "SSE", label: "Streaming response" },
];

const PersonalProjects = () => {
  const handleOpenChatbot = () => {
    const event = new CustomEvent("open-portfolio-chatbot");
    window.dispatchEvent(event);
  };

  return (
    <section id="personal-projects" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:58px_58px]" />
        <div className="absolute left-[-12%] top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Sparkles size={14} className="text-primary" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.28em] text-primary">
                Personal Lab
              </span>
            </div>
            <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Building AI products, not just demos.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Side projects where backend architecture, AI tooling, realtime UX, and production deployment meet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenChatbot}
            className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 font-mono-accent text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]"
          >
            <MessageSquareCode size={16} />
            Ask Neko
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        {personalProjects.map((project, idx) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[110px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[110px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Bot size={24} />
                  </div>
                  <div>
                    <p className="font-mono-accent text-xs uppercase tracking-[0.22em] text-primary/70">
                      {project.tagline}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">{project.name}</h3>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {project.description}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-border/50 bg-background/40 p-4"
                    >
                      <p className="font-mono-accent text-xl font-black text-primary">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 font-mono-accent text-[10px] font-medium text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                    <TerminalSquare size={13} />
                    project.pipeline
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  {project.contributions.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.1 + index * 0.06 }}
                      className="group rounded-2xl border border-border/40 bg-card/40 p-4 transition-all hover:border-primary/35 hover:bg-primary/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <item.icon size={17} />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-mono-accent text-[10px] text-primary/70">
                              0{index + 1}
                            </span>
                            <h4 className="text-sm font-semibold">{item.title}</h4>
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PersonalProjects;