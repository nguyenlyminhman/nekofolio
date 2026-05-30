"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  BrainCircuit,
  Code2,
  Cpu,
  Network,
  Server,
  Sparkles,
} from "lucide-react";

const topics = [
  {
    title: "LLM-based Chatbot Systems",
    desc: "Designing conversational AI flows for recruiter-facing, enterprise, and internal productivity use cases.",
    icon: Brain,
    signal: "conversation.layer",
  },
  {
    title: "Model Context Protocol (MCP)",
    desc: "Using tool-based context to let AI agents interact with backend data in a controlled and explainable way.",
    icon: Cpu,
    signal: "tool.context",
  },
  {
    title: "AI-assisted Development",
    desc: "Applying AI for debugging, refactoring, test exploration, documentation, and faster engineering workflows.",
    icon: Code2,
    signal: "dev.acceleration",
  },
  {
    title: "Intelligent Backend Systems",
    desc: "Blending classic backend design with AI capabilities for smarter automation and data processing.",
    icon: Server,
    signal: "backend.ai",
  },
];

const pipeline = ["Prompt", "Context", "Tools", "Guardrails", "Response"];

const AISection = () => {
  return (
    <section id="ai" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Sparkles size={14} className="text-primary" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.28em] text-primary">
                AI & Innovation
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Exploring the frontier.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Bridging traditional backend engineering with modern AI capabilities to build intelligent, practical, and production-ready systems.
            </p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono-accent text-xs uppercase tracking-wider text-primary">
                <BrainCircuit size={16} />
                agent flow
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_18px_rgba(34,197,94,0.8)]" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {pipeline.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 font-mono-accent text-[10px] uppercase tracking-wider text-primary">
                    {step}
                  </span>
                  {index < pipeline.length - 1 && (
                    <span className="text-muted-foreground/60">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-[70px] transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <topic.icon size={22} strokeWidth={1.7} />
                </div>
                <div>
                  <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-[0.22em] text-primary/70">
                    {topic.signal}
                  </p>
                  <h3 className="text-base font-bold">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {topic.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-6 rounded-3xl border border-border/50 bg-background/40 p-5 backdrop-blur-xl"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Bot, label: "Agent UX", value: "human-friendly answers" },
              { icon: Network, label: "Context routing", value: "right data, right time" },
              { icon: BrainCircuit, label: "Guardrails", value: "controlled AI behavior" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/30 p-4">
                <item.icon size={18} className="text-primary" />
                <div>
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-primary/70">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;