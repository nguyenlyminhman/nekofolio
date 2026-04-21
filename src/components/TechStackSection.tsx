"use client";

import { motion } from "framer-motion";

const categories = [
  {
    title: "Backend",
    items: ["Java (Spring Boot)", "Node.js (NestJS, Express)", "Python (FastAPI, Flask)"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Vue.js", "TypeScript"],
  },
  {
    title: "Architecture",
    items: ["DDD", "Clean Architecture", "Microservices", "RESTful APIs", "RBAC"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "Oracle", "MongoDB", "Redis"],
  },
  {
    title: "DevOps",
    items: ["Docker", "Kubernetes", "Jenkins CI/CD", "AWS", "Google Cloud"],
  },
];

const TechStackSection = () => {
  return (
    <section id="tech" className="py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">Tech Stack</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Tools of the trade.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-card p-6 card-hover"
            >
              <h3 className="font-mono-accent text-sm font-semibold text-primary mb-4 tracking-wider uppercase">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="tech-tag"
                  >
                    {item}
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

export default TechStackSection;
