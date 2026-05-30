"use client";

import { motion } from "framer-motion";

const highlights = [
  "Microservices",
  "Clean Architecture",
  "System Design",
  "AI Exploration",
];

const metrics = [
  { value: "7+", label: "Years Experience" },
  { value: "4", label: "Core Domains" },
  { value: "AI", label: "Current Focus" },
];

const principles = [
  {
    title: "Backend-first mindset",
    desc: "Design APIs, services, and data flows with stability, observability, and long-term maintainability in mind.",
  },
  {
    title: "Product-aware delivery",
    desc: "Balance engineering quality with real business workflows across finance, CMS, and platform systems.",
  },
  {
    title: "AI-native exploration",
    desc: "Experimenting with LLM, MCP, and agent-style backend architecture to connect traditional systems with AI capabilities.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">
              About / Profile
            </p>
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Engineer at scale,
            <span className="block bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              built for real systems.
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/45 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="absolute right-6 top-6 font-mono text-xs text-primary/40">
              profile.json
            </div>

            <div className="space-y-6 text-muted-foreground">
              <p className="max-w-3xl text-base leading-relaxed sm:text-lg">
                Senior Full Stack Software Engineer with 7+ years of experience
                building scalable financial systems, CMS platforms, and
                microservice-based applications. Strong expertise in Java
                (Spring Boot) and Node.js (NestJS), with frontend proficiency in
                React, Next.js, and Vue.js.
              </p>

              <p className="max-w-3xl text-base leading-relaxed sm:text-lg">
                Currently exploring AI-driven systems using Large Language
                Models and Model Context Protocol (MCP), with a focus on
                building intelligent backend architectures that bridge
                traditional systems with modern AI capabilities.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-background/35 p-4"
                >
                  <p className="bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-3xl font-black text-transparent">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 backdrop-blur-xl">
              <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary/80">
                Focus Areas
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition hover:border-primary/50 hover:bg-primary/15"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/45 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  mindset.sh
                </span>
              </div>
              <div className="space-y-4 p-5">
                {principles.map((item, idx) => (
                  <div key={item.title}>
                    <p className="font-mono text-xs text-cyan-400">
                      0{idx + 1}. {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;