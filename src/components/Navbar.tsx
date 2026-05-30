"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Tech", href: "#tech", sectionId: "tech" },
  { label: "Projects", href: "#projects", sectionId: "projects" },
  { label: "Leadership", href: "#leadership", sectionId: "leadership" },
  { label: "AI", href: "#ai", sectionId: "ai" },
  {
    label: "Personal",
    href: "#personal-projects",
    sectionId: "personal-projects",
  },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const activeLockRef = useRef<number>(0);

  const sectionIds = useMemo(() => navItems.map((item) => item.sectionId), []);

  useEffect(() => {
    const handleScrollState = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScrollState();
    window.addEventListener("scroll", handleScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollState);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const getCurrentSection = () => {
      if (Date.now() < activeLockRef.current) return;

      const documentEl = document.documentElement;
      const maxScrollTop = documentEl.scrollHeight - window.innerHeight;

      // When user reaches the bottom, always activate the last section.
      // This fixes Contact being misread as Personal on the first click.
      if (window.scrollY >= maxScrollTop - 8) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      // Use a viewport probe instead of only navbar offset.
      // It is more stable for sections with different heights.
      const probeY = window.scrollY + window.innerHeight * 0.34;

      let current = sectionIds[0];

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (!section) continue;

        const top = section.offsetTop;

        if (probeY >= top) {
          current = sectionId;
        }
      }

      setActiveSection(current);
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        getCurrentSection();
        ticking = false;
      });
    };

    getCurrentSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", getCurrentSection);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", getCurrentSection);
    };
  }, [sectionIds]);

  const handleNavClick = (href: string, sectionId: string) => {
    setMobileOpen(false);
    setActiveSection(sectionId);

    // Smooth scrolling fires intermediate scroll events. Lock active state briefly
    // so Contact does not flash back to Personal while the scroll is moving.
    activeLockRef.current = Date.now() + 900;

    const section = document.getElementById(sectionId);

    if (!section) return;

    const navbarOffset = 86;
    const top = section.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      setActiveSection(sectionId);
      activeLockRef.current = 0;
    }, 920);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 lg:px-5 ${
          scrolled
            ? "border-primary/15 bg-background/75 shadow-[0_18px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
            : "border-white/10 bg-background/35 backdrop-blur-xl"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            setActiveSection("about");
            activeLockRef.current = Date.now() + 700;
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.setTimeout(() => {
              activeLockRef.current = 0;
            }, 720);
          }}
          className="group flex items-center gap-3 text-left"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-xs font-black text-primary shadow-[0_0_30px_hsl(var(--primary)/0.14)] transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20">
            <span className="relative z-10">MN</span>
            <span className="absolute inset-1 rounded-lg border border-primary/10" />
          </div>

          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              Nguyễn Lý Minh Mẫn
            </span>
            <span className=" pt-2 font-mono text-[10px] tracking-[0.24em] text-primary/80">
              man-nguyen.com
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
  {navItems.map((item) => {
    const isActive = activeSection === item.sectionId;

    return (
      <button
        key={item.href}
        type="button"
        onClick={() => handleNavClick(item.href, item.sectionId)}
        className={`
          group
          relative
          overflow-hidden
          rounded-xl
          px-3
          py-2
          font-mono
          text-[11px]
          uppercase
          tracking-[0.16em]
          transition-all
          duration-300
          hover:scale-[1.03]

          ${
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }
        `}
      >
        {/* Hover Pill */}
        {!isActive && (
          <span
            className="
              absolute inset-0
              rounded-xl
              border border-primary/0
              bg-primary/0
              opacity-0
              transition-all
              duration-300
              group-hover:opacity-100
              group-hover:bg-primary/5
              group-hover:border-primary/15
              group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)]
            "
          />
        )}

        {/* Active Pill */}
        {isActive && (
          <motion.span
            layoutId="navbar-active-pill"
            className="
              absolute inset-0
              rounded-xl
              border border-primary/20
              bg-primary/10
              shadow-[0_0_28px_hsl(var(--primary)/0.12)]
            "
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
            }}
          />
        )}

        {/* Text */}
        <span className="relative z-10 flex items-center gap-1.5">
          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          )}
          {item.label}
        </span>
      </button>
    );
  })}
</nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-primary/15 bg-background/90 shadow-[0_22px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:hidden"
          >
            <div className="border-b border-primary/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
              /navigation
            </div>

            <div className="grid gap-1 p-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.sectionId;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavClick(item.href, item.sectionId)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                      isActive
                        ? "border border-primary/20 bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-primary/60">
                      {isActive ? "ACTIVE" : item.href}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;