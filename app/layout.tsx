import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { ExternalLinkIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

import "@/app/globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} — Help Center`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
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
    const themeKey = "p365-help-theme";
    const stored = localStorage.getItem(themeKey);
    const resolved = stored === "dark" || stored === "light" ? stored : "light";
    document.documentElement.classList.toggle("dark", resolved === "dark");

    const sidebarKey = "p365-help-sidebar-collapsed";
    const collapsed = localStorage.getItem(sidebarKey) === "true";
    document.documentElement.setAttribute("data-sidebar-collapsed", collapsed ? "true" : "false");
  } catch {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
        <header
          className="sticky top-0 z-40 border-b"
          style={{
            height: "var(--topbar-h)",
            background: "color-mix(in oklab, var(--bg-panel) 86%, transparent)",
            backdropFilter: "saturate(160%) blur(14px)",
            WebkitBackdropFilter: "saturate(160%) blur(14px)",
            borderColor: "var(--line)"
          }}
        >
          <div className="topbar-inner">
            <div className="flex items-center gap-3">
              <Link className="flex items-center gap-2.5" href="/" aria-label="Proventeq365 Help center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" aria-hidden="true" className="brand-logo" src="/proventeq-logo.svg" />
                <span className="brand-divider" aria-hidden="true" />
                <span className="brand-tag">Help center</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                className="icon-btn"
                href="https://www.proventeq.com"
                rel="noreferrer"
                target="_blank"
                aria-label="Proventeq.com"
                title="Proventeq.com"
              >
                <ExternalLinkIcon size={16} />
              </a>
            </div>
          </div>
        </header>
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
