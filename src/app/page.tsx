import type { Metadata } from "next";
import HomePage from "@/components/home-page";

export const metadata: Metadata = {
  metadataBase: new URL("https://man-nguyen.com"),

  title: {
    default: "Nguyen Ly Minh Man | Senior Full Stack Engineer",
    template: "%s | Nguyen Ly Minh Man",
  },

  description:
    "Portfolio of Nguyen Ly Minh Man, a Senior Full Stack Engineer specializing in scalable systems, microservices, cloud architecture, and AI-powered platforms.",

  keywords: [
    "Nguyen Ly Minh Man",
    "Senior Full Stack Engineer",
    "NestJS",
    "Spring Boot",
    "Node.js",
    "Java",
    "Microservices",
    "AWS",
    "AI",
    "Portfolio",
  ],

  authors: [
    {
      name: "Nguyen Ly Minh Man",
      url: "https://man-nguyen.com",
    },
  ],

  creator: "Nguyen Ly Minh Man",

  openGraph: {
    title: "Nguyen Ly Minh Man | Senior Full Stack Engineer",
    description:
      "Explore projects, architecture expertise, cloud systems, microservices, and AI innovation work.",
    url: "https://man-nguyen.com",
    siteName: "Nguyen Ly Minh Man Portfolio",
    type: "website",
    locale: "en_US",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nguyen Ly Minh Man Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nguyen Ly Minh Man | Senior Full Stack Engineer",
    description:
      "Portfolio showcasing scalable systems, backend architecture, cloud engineering, and AI-enabled applications.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://man-nguyen.com",
  },
};

export default function Page() {
  return <HomePage />;
}