import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookIcon,
  MailIcon,
  WorkflowIcon
} from "@/components/icons";
import { DOCS_BASE } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Choose a product to get help with — Proventeq365 documentation, the Migrator user guide, or open a support request.",
  alternates: { canonical: "/" }
};

interface LandingTile {
  title: string;
  description: string;
  href: string;
  external: boolean;
  cta: string;
  Icon: typeof BookIcon;
}

const TILES: LandingTile[] = [
  {
    title: "Proventeq365",
    description:
      "Product help and user documentation for managing the Microsoft 365 content lifecycle — governance, oversharing, storage optimisation and self-service.",
    href: DOCS_BASE,
    external: false,
    cta: "Open documentation",
    Icon: BookIcon
  },
  {
    title: "Migrator",
    description:
      "User guide for the Proventeq Migration product. Plan, configure and run content migrations to Microsoft 365 and SharePoint.",
    href: "https://support.proventeq.com/hc/en-us/categories/115000417905-User-Guide",
    external: true,
    cta: "Open user guide",
    Icon: WorkflowIcon
  },
  {
    title: "Support",
    description:
      "Can't find an answer? Open a ticket and our support team will get back to you.",
    href: "https://support.proventeq.com/hc/en-us/requests/new",
    external: true,
    cta: "Submit a request",
    Icon: MailIcon
  }
];

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.baseUrl
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <main
        className="mx-auto flex w-full max-w-[1100px] flex-col px-6 pt-16 pb-24 lg:px-8"
        style={{ minHeight: "calc(100vh - var(--topbar-h))" }}
      >
        {/* Hero */}
        <section className="max-w-[760px] pb-12 text-center mx-auto">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.06em]"
            style={{ color: "var(--fg-3)" }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--accent-swatch)",
                boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent-swatch) 14%, transparent)"
              }}
            />
            <span>Proventeq · Help center</span>
          </div>

          <h1
            className="m-0 mb-4 font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 4.6vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "var(--fg)"
            }}
          >
            How can we help you today?
          </h1>

          <p
            className="m-0 mx-auto max-w-[560px]"
            style={{ fontSize: "17px", lineHeight: 1.6, color: "var(--fg-2)" }}
          >
            Pick the product you need help with, or reach out to our support team directly.
          </p>
        </section>

        {/* Tiles */}
        <section className="grid gap-4 [grid-template-columns:repeat(3,minmax(0,1fr))] max-[900px]:[grid-template-columns:1fr]">
          {TILES.map((tile) => {
            const { Icon } = tile;
            const Arrow = tile.external ? ArrowUpRightIcon : ArrowRightIcon;

            const inner = (
              <>
                <div className="section-card-icon">
                  <Icon size={18} />
                </div>
                <div className="section-card-title" style={{ fontSize: "16px" }}>
                  {tile.title}
                </div>
                <div className="section-card-desc" style={{ WebkitLineClamp: 4 }}>
                  {tile.description}
                </div>
                <div
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {tile.cta}
                  <Arrow size={13} />
                </div>
                <span className="section-card-arrow">
                  <Arrow size={14} />
                </span>
              </>
            );

            return tile.external ? (
              <a
                className="section-card group"
                href={tile.href}
                key={tile.title}
                rel="noreferrer"
                style={{ minHeight: "220px" }}
                target="_blank"
              >
                {inner}
              </a>
            ) : (
              <Link
                className="section-card group"
                href={tile.href}
                key={tile.title}
                style={{ minHeight: "220px" }}
              >
                {inner}
              </Link>
            );
          })}
        </section>
      </main>
    </>
  );
}
