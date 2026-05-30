"use client";

import { motion } from "framer-motion";

const categories = [
  {
    title: "Backend",
    level: "Core",
    items: ["Java (Spring Boot)", "Node.js (NestJS, Express)", "Python (FastAPI, Flask)"],
  },
  {
    title: "Frontend",
    level: "Product UI",
    items: ["React", "Next.js", "Vue.js", "TypeScript"],
  },
  {
    title: "Architecture",
    level: "System Design",
    items: ["DDD", "Clean Architecture", "Microservices", "RESTful APIs", "RBAC"],
  },
  {
    title: "Databases",
    level: "Data Layer",
    items: ["PostgreSQL", "Oracle", "MongoDB", "Redis"],
  },
  {
    title: "DevOps",
    level: "Delivery",
    items: ["Docker", "Kubernetes", "Jenkins CI/CD", "AWS", "Google Cloud"],
  },
];

const orbitItems = ["API", "DB", "MQ", "AI", "CI", "K8S"];

const TechStackSection = () => {
  return (
    <section id="tech" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_35%)]" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
              <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">
                Tech Stack / Toolkit
              </p>
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Tools mapped to
              <span className="block bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                real delivery layers.
              </span>
            </h2>
          </div>

          <div className="relative hidden min-h-40 overflow-hidden rounded-3xl border border-white/10 bg-card/45 p-6 backdrop-blur-xl lg:block">
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-center">
              <p className="font-mono text-xs text-primary">SYSTEM</p>
              <p className="text-sm font-bold">STACK</p>
            </div>
            {orbitItems.map((item, idx) => {
              const positions = [
                "left-[18%] top-[20%]",
                "right-[18%] top-[22%]",
                "left-[10%] bottom-[18%]",
                "right-[12%] bottom-[20%]",
                "left-[45%] top-[10%]",
                "left-[45%] bottom-[10%]",
              ];

              return (
                <span
                  key={item}
                  className={`absolute ${positions[idx]} rounded-full border border-primary/20 bg-background/60 px-3 py-1 font-mono text-xs text-cyan-300`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/45 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card/60"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-cyan-500/15" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                      {cat.level}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{cat.title}</h3>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs text-primary/90 transition hover:border-primary/40 hover:bg-primary/15"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;