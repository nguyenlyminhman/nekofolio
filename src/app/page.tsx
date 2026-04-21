import type { Metadata } from "next";
import HomePage from "@/components/home-page";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Portfolio of Nguyen Ly Minh Man, a Senior Full Stack Engineer focused on scalable systems, microservices, and AI-enabled platforms.",
  openGraph: {
    title: "Nguyen Ly Minh Man | Senior Full Stack Engineer",
    description:
      "Explore projects, architecture expertise, leadership impact, and AI innovation work across fintech and cloud systems.",
    type: "website",
    url: "https://nguyenlyminhman.dev",
    siteName: "Nguyen Ly Minh Man Portfolio",
  },
};

export default function Page() {
  return <HomePage />;
}
