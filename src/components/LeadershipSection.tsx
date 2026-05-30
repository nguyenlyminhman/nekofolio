"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Code2,
  GitPullRequest,
  Layers3,
  Network,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";

const items = [
  {
    title: "Backend Team Lead",
    desc: "Led a team of 4 engineers, aligning technical direction with sprint delivery.",
    icon: Users,
    tag: "team.enablement",
  },
  {
    title: "Code Reviews",
    desc: "Protected maintainability through review habits, clean boundaries, and practical feedback.",
    icon: GitPullRequest,
    tag: "quality.gate",
  },
  {
    title: "System Design",
    desc: "Designed scalable microservice architectures for financial and workflow-heavy platforms.",
    icon: Layers3,
    tag: "architecture",
  },
  {
    title: "Performance Optimization",
    desc: "Improved stability, latency, and reliability across critical backend services.",
    icon: Activity,
    tag: "runtime.health",
  },
  {
    title: "Agile Collaboration",
    desc: "Worked with product owners, QA, DevOps, and stakeholders to keep delivery moving.",
    icon: Rocket,
    tag: "delivery",
  },
  {
    title: "Cross-functional Teamwork",
    desc: "Bridged backend, frontend, DevOps, and QA to reduce handoff friction.",
    icon: Network,
    tag: "collaboration",
  },
];

const LeadershipSection = () => {
  return (
    <section id="leadership" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
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
              <ShieldCheck size={14} className="text-primary" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.28em] text-primary">
                Leadership
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Impact beyond code.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Technical ownership, engineering quality, and team collaboration across real product delivery.
            </p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl">
            <p className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-primary/70">
              leadership.mode
            </p>
            <p className="mt-2 text-2xl font-black text-primary">Build / Review / Ship</p>
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-[60px]" />
              <div className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <item.icon size={20} />
                  </div>
                  <span className="font-mono-accent text-[10px] uppercase tracking-wider text-primary/60">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-[0.22em] text-primary/70">
                  {item.tag}
                </p>
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-6 grid gap-4 rounded-3xl border border-border/50 bg-background/40 p-5 backdrop-blur-xl md:grid-cols-3"
        >
          {[
            { icon: Code2, label: "Engineering", value: "Clean, scalable implementation" },
            { icon: Users, label: "People", value: "Mentoring and alignment" },
            { icon: Rocket, label: "Delivery", value: "Reliable execution rhythm" },
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
        </motion.div>
      </div>
    </section>
  );
};

export default LeadershipSection;