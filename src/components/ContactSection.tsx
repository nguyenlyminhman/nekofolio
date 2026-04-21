"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contacts = [
  {
    label: "Email",
    value: "nguyenlyminhman@gmail.com",
    href: "mailto:nguyenlyminhman@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/nguyenlyminhman",
    href: "https://github.com/nguyenlyminhman",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "Ly Minh Man Nguyen",
    href: "https://www.linkedin.com/in/ly-minh-man-nguyen-204039147/",
    icon: Linkedin,
  },
  {
    label: "Location",
    value: "Ho Chi Minh City, Vietnam",
    href: null,
    icon: MapPin,
  },
];

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("nguyenlyminhman@gmail.com");
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-mono-accent text-sm text-primary mb-3 tracking-widest uppercase">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let&apos;s connect.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Open to senior engineering roles, system design consulting, and technical collaboration.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card glow-border p-6 sm:p-10 w-full mx-auto max-w-4xl lg:w-4/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((c) => {
              const Wrapper = c.href ? "a" : "div";
              const wrapperProps = c.href
                ? { href: c.href, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={c.label}
                  {...wrapperProps}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all duration-300"
                >
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                    <c.icon
                      size={22}
                      className="text-primary transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono-accent text-xs text-primary/70 uppercase tracking-wider mb-0.5">
                      {c.label}
                    </p>
                    <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {c.value}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:nguyenlyminhman@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
            >
              <Mail size={16} strokeWidth={2} />
              Send email
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/30 bg-transparent text-primary text-sm font-medium hover:bg-primary/10 transition-colors w-full sm:w-auto justify-center"
            >
              {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
