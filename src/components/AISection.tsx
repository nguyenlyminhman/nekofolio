"use client";

import { motion } from "framer-motion";
import { Brain, Cpu, Code2, Server } from "lucide-react";

const topics = [
  {
    title: "LLM-based Chatbot Systems",
    desc: "Exploring conversational AI architectures powered by large language models for enterprise use cases.",
    icon: Brain,
  },
  {
    title: "Model Context Protocol (MCP)",
    desc: "Investigating MCP for building context-aware AI agents that interface with backend systems.",
    icon: Cpu,
  },
  {
    title: "AI-assisted Development",
    desc: "Leveraging AI tools for code debugging, refactoring, and accelerating development workflows.",
    icon: Code2,
  },
  {
    title: "Intelligent Backend Systems",
    desc: "Designing backend architectures that integrate AI capabilities for smarter data processing and automation.",
    icon: Server,
  },
];

const AISection = () => {
  return (
    <section id="ai" className="py-20 sm:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">AI & Innovation</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Exploring the frontier.</h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Bridging traditional backend engineering with modern AI capabilities to build the next generation of intelligent systems.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-card p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <topic.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;
