"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "DMS – Financial Disbursement Platform",
    type: "FinTech Core",
    description:
      "Secure backend APIs for financial transactions with banking API integrations, stability & performance improvements.",
    tech: ["Spring Boot", "Vue.js", "Oracle"],
    contributions: [
      "Secure transaction APIs",
      "Banking integrations",
      "Performance optimization",
    ],
  },
  {
    name: "C&C – Credit Card Eligibility Platform",
    type: "Microservices",
    description:
      "Microservices architecture with ActiveMQ integration. Full-stack feature delivery for credit card eligibility workflows.",
    tech: ["NestJS", "React", "Oracle", "ActiveMQ"],
    contributions: [
      "Microservices design",
      "ActiveMQ integration",
      "End-to-end feature delivery",
    ],
  },
  {
    name: "ClickScan – Backend Team Lead",
    type: "Team Lead",
    description:
      "Led a team of 4 engineers designing core backend services and migrating legacy software to a modern web platform.",
    tech: ["NestJS", "Next.js", "MySQL"],
    contributions: [
      "Team leadership (4 engineers)",
      "Core service design",
      "Legacy migration",
    ],
  },
  {
    name: "MAIKA Assistant CMS",
    type: "AI / CMS",
    description:
      "Content management system for a Vietnamese voice assistant. Built both backend and frontend with containerized deployment.",
    tech: ["Python", "NestJS", "React", "PostgreSQL", "Redis", "Docker", "K8S"],
    contributions: [
      "Full-stack CMS development",
      "Container orchestration",
      "Voice assistant integration",
    ],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.9)]" />
              <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">
                Projects / Case Studies
              </p>
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Featured work,
              <span className="block bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                production mindset.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A mix of financial platforms, microservices, CMS systems, and
            AI-adjacent products focused on stability, delivery, and clean
            architecture.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/45 p-6 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card/60"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-cyan-500/15" />

              <div className="relative flex h-full flex-col">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
                      {project.type}
                    </p>
                    <h3 className="mt-3 text-xl font-bold leading-snug">
                      {project.name}
                    </h3>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                    0{idx + 1}
                  </span>
                </div>

                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-background/35 p-4">
                  <p className="mb-3 font-mono-accent text-xs uppercase tracking-widest text-primary/80">
                    Key Contributions
                  </p>
                  <ul className="space-y-2">
                    {project.contributions.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span className="mt-0.5 text-cyan-400">▸</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;