"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import LeadershipSection from "@/components/LeadershipSection";
import AISection from "@/components/AISection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import CookieConsent from "@/components/CookieConsent";
import PersonalProjects from "./PersonalProject";
import PageLoader from "./PageLoader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageLoader />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <LeadershipSection />
        <AISection />
        <PersonalProjects />
        <ContactSection />
      </main>
      <Footer />
      <ChatbotWidget />
      <CookieConsent />
    </div>
  );
}
