import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Bot, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} Documentation`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: `${siteConfig.name} Documentation`,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    siteName: siteConfig.name
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Documentation`,
    description: siteConfig.description
  }
};

const initialThemeScript = `
(() => {
  try {
    const storageKey = "p365-help-theme";
    const stored = localStorage.getItem(storageKey);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = stored === "dark" || stored === "light" ? stored : (systemPrefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen`}>
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
        <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="brand-gradient h-1 w-full" />
          <div className="page-shell flex h-16 items-center justify-between gap-4">
            <Link className="group flex items-center gap-3" href="/">
              <span className="flex items-center rounded-lg bg-[#0f2c3d] px-2.5 py-1.5 shadow-sm ring-1 ring-black/5">
                <Image
                  alt="Proventeq logo"
                  className="h-5 w-auto"
                  height={28}
                  priority
                  src="/proventeq-logo.svg"
                  width={150}
                />
              </span>
              <span className="hidden text-sm font-semibold sm:inline">P365 Help Center</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <a
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href="https://www.proventeq.com"
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Proventeq
              </a>
              <a className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href="/llms.txt">
                <Bot className="h-3.5 w-3.5" />
                llms.txt
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(52,161,160,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(50%_50%_at_50%_0%,rgba(52,161,160,0.2),rgba(0,0,0,0))]" />
          {children}
        </main>
      </body>
    </html>
  );
}
