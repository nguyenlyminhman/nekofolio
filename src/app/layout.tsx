import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/index.css";
import Providers from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nguyenlyminhman.dev"),
  title: {
    default: "Nguyen Ly Minh Man | Senior Full Stack Engineer",
    template: "%s | Nguyen Ly Minh Man",
  },
  description:
    "Senior Full Stack Engineer building scalable fintech systems and AI-driven backend architectures with modern cloud-native practices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
