"use client";

import { motion } from "framer-motion";
import { MessageSquareCode } from "lucide-react"; // Đổi sang MessageSquareCode nhìn hợp với widget chat hơn

const personalProjects = [
  {
    name: "AI-Powered Portfolio Chatbot",
    description: "A smart, interactive chatbot integrated into my Live Portfolio Website, specifically designed to assist HR/recruiters in querying candidate information, professional experience, and technical skills in real-time.",
    tech: ["Node.js (NestJS)", "Server Sent Event (SSE)", "Socket.io", "Next.js", "Google Generative AI", "Model Context Protocol (MCP)", "PostgreSQL"],
    contributions: [
      "Designed and implemented the chatbot backend using NestJS and PostgreSQL to manage session states and conversation history.",
      "Integrated Google Generative AI (Gemini API) using the Model Context Protocol (MCP) to securely and accurately expose portfolio data (CV details, project highlights) as tools for the LLM.",
      "Built a clean, responsive frontend chat interface using Next.js, allowing seamless user interaction and smooth streaming responses.",
      "Optimized prompt engineering and context retrieval to ensure the bot answers recruiting-related questions accurately while maintaining professional boundaries."
    ],
  }
];

const PersonalProjects = () => {
  const handleOpenChatbot = () => {
    // Phát Event thông báo kích hoạt Chatbot mở ra
    const event = new CustomEvent("open-portfolio-chatbot");
    window.dispatchEvent(event);
  };

  return (
    <section id="personal-projects" className="py-20 sm:py-28">
      <div className="section-container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">
            Personal Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Side Projects.
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Putting new concepts into practice. Building production-grade tools and experimenting with AI ecosystem tools.
          </p>
        </motion.div>

        {/* Project Card */}
        <div className="grid gap-6">
          {personalProjects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card p-6 md:p-8 card-hover flex flex-col relative overflow-hidden"
            >
              {/* Header inside card: Title, Icon & Trigger Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <MessageSquareCode size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                </div>
                
                <button 
                  onClick={handleOpenChatbot}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-accent text-primary hover:underline self-start sm:self-center cursor-pointer group/btn"
                >
                  <span>Ask Neko about this</span>
                  <svg 
                    className="w-3.5 h-3.5 transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

              {/* Main Project Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-4xl">
                {project.description}
              </p>

              {/* Key Contributions Breakdown */}
              <div className="mb-6">
                <p className="text-xs font-mono-accent text-primary/70 uppercase tracking-wider mb-3">
                  Key Implementations
                </p>
                <ul className="space-y-2">
                  {project.contributions.map((contribution, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                      <span className="text-primary mt-0.5 select-none">▸</span>
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Badges Stack */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-primary/5">
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

export default PersonalProjects;