"use client";

import { motion } from "framer-motion";

const items = [
  { title: "Backend Team Lead", desc: "Led team of 4 engineers, driving architecture decisions and sprint delivery." },
  { title: "Code Reviews", desc: "Maintained code quality standards through thorough review processes." },
  { title: "System Design", desc: "Designed scalable microservice architectures for financial platforms." },
  { title: "Performance Optimization", desc: "Improved system stability and response times across critical services." },
  { title: "Agile Collaboration", desc: "Worked in cross-functional Agile teams with stakeholders and product owners." },
  { title: "Cross-functional Teamwork", desc: "Bridged backend, frontend, DevOps, and QA for seamless delivery." },
];

const LeadershipSection = () => {
  return (
    <section id="leadership" className="py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">Leadership</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Impact & influence.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="glass-card p-5 card-hover"
            >
              <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
