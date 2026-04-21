"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "DMS – Financial Disbursement Platform",
    description: "Secure backend APIs for financial transactions with banking API integrations, stability & performance improvements.",
    tech: ["Spring Boot", "Vue.js", "Oracle"],
    contributions: ["Secure transaction APIs", "Banking integrations", "Performance optimization"],
  },
  {
    name: "C&C – Credit Card Eligibility Platform",
    description: "Microservices architecture with ActiveMQ integration. Full-stack feature delivery for credit card eligibility workflows.",
    tech: ["NestJS", "React", "Oracle", "ActiveMQ"],
    contributions: ["Microservices design", "ActiveMQ integration", "End-to-end feature delivery"],
  },
  {
    name: "ClickScan – Backend Team Lead",
    description: "Led a team of 4 engineers designing core backend services and migrating legacy software to a modern web platform.",
    tech: ["NestJS", "Next.js", "MySQL"],
    contributions: ["Team leadership (4 engineers)", "Core service design", "Legacy migration"],
  },
  {
    name: "MAIKA Assistant CMS",
    description: "Content management system for a Vietnamese voice assistant. Built both backend and frontend with containerized deployment.",
    tech: ["Python", "NestJS", "React", "PostgreSQL", "Redis", "Docker", "K8S"],
    contributions: ["Full-stack CMS development", "Container orchestration", "Voice assistant integration"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">Projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Featured work.</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card p-6 card-hover flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-mono-accent text-primary/70 uppercase tracking-wider mb-2">Key Contributions</p>
                <ul className="space-y-1">
                  {project.contributions.map((c) => (
                    <li key={c} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-[10px] rounded bg-primary/10 text-primary font-mono-accent font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
