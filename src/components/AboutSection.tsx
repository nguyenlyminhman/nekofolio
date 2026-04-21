"use client";

import { motion } from "framer-motion";

const highlights = [
  "Microservices",
  "Clean Architecture",
  "System Design",
  "AI Exploration (LLM + MCP)",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">About</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Engineer at scale.</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              Senior Full Stack Software Engineer with 7+ years of experience building scalable financial systems, 
              CMS platforms, and microservice-based applications. Strong expertise in Java (Spring Boot) and 
              Node.js (NestJS), with frontend proficiency in React, Next.js, and Vue.js.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently exploring AI-driven systems using Large Language Models and Model Context Protocol (MCP), 
              with a focus on building intelligent backend architectures that bridge traditional systems with 
              modern AI capabilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Badge */}
            <div className="glass-card glow-border p-4 text-center">
              <p className="text-3xl font-bold text-gradient">7+</p>
              <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
            </div>

            {/* Focus areas */}
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="tech-tag"
                >
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
