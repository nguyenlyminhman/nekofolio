"use client";

import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Radar,
  Send,
  TerminalSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMAIL = "nguyenlyminhman@gmail.com";

const contacts = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    status: "primary.channel",
  },
  {
    label: "GitHub",
    value: "github.com/nguyenlyminhman",
    href: "https://github.com/nguyenlyminhman",
    icon: Github,
    status: "source.code",
  },
  {
    label: "LinkedIn",
    value: "Ly Minh Man Nguyen",
    href: "https://www.linkedin.com/in/ly-minh-man-nguyen-204039147/",
    icon: Linkedin,
    status: "career.profile",
  },
  {
    label: "Location",
    value: "Ho Chi Minh City, Vietnam",
    href: null,
    icon: MapPin,
    status: "timezone.gmt+7",
  },
];

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.10),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Radar size={14} className="text-primary" />
            <span className="font-mono-accent text-xs uppercase tracking-[0.28em] text-primary">
              Contact
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Let&apos;s build something solid.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Open to senior engineering roles, backend architecture, AI-enabled product work, and technical collaboration.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 p-6 backdrop-blur-xl">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-[90px]" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <TerminalSquare size={22} />
                </div>
                <div>
                  <p className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-primary/70">
                    availability.status
                  </p>
                  <h3 className="text-xl font-bold">Ready for the next challenge</h3>
                </div>
              </div>

              <div className="space-y-3 font-mono-accent text-sm">
                <p>
                  <span className="text-primary">$</span> who_to_contact
                </p>
                <p className="text-muted-foreground">Nguyễn Lý Minh Mẫn — Senior Full Stack Engineer</p>
                <p>
                  <span className="text-primary">$</span> interests
                </p>
                <p className="text-muted-foreground">
                  Backend systems • Microservices • AI products • Cloud deployment
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]"
                >
                  <Send size={16} />
                  Send email
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/15"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy email"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map((c, idx) => {
              const Wrapper = c.href ? "a" : "div";
              const wrapperProps = c.href
                ? { href: c.href, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.14 + idx * 0.05 }}
                >
                  <Wrapper
                    {...wrapperProps}
                    className="group flex h-full items-start gap-4 rounded-3xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.10)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <c.icon size={21} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono-accent text-[10px] uppercase tracking-[0.22em] text-primary/70">
                        {c.status}
                      </p>
                      <p className="mt-2 text-sm font-semibold">{c.label}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground transition-colors group-hover:text-primary">
                        {c.value}
                      </p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="mx-auto mt-6 flex max-w-6xl items-center justify-center gap-2 rounded-2xl border border-border/40 bg-background/40 px-4 py-3 font-mono-accent text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
          <MessageSquare size={14} className="text-primary" />
          Response channel online
        </div>
      </div>
    </section>
  );
};

export default ContactSection;