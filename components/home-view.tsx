import Link from "next/link";

import {
  AiIcon,
  ArchiveIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  BoltIcon,
  BookIcon,
  CompassIcon,
  FolderIcon,
  HistoryIcon,
  KeyIcon,
  LayoutIcon,
  MailIcon,
  ReportIcon,
  SettingsIcon,
  SparklesIcon,
  WorkflowIcon
} from "@/components/icons";
import type { DocItem } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

interface HomeViewProps {
  topSections: DocItem[];
  totalDocs: number;
}

const SECTION_ICONS: Record<string, typeof FolderIcon> = {
  "/navigation-menu": CompassIcon,
  "/manage": FolderIcon,
  "/main": LayoutIcon,
  "/reports": ReportIcon,
  "/self-service": WorkflowIcon,
  "/settings": SettingsIcon,
  "/audit-log": HistoryIcon,
  "/license": KeyIcon,
  "/notification": BellIcon,
  "/archive": ArchiveIcon,
  "/exchange-monitoring": MailIcon,
  "/appendix": BookIcon
};

const HIGHLIGHTS = [
  {
    eyebrow: "New",
    title: "Storage Optimisation, faster",
    body:
      "ROT detection runs incrementally and produces actionable summaries per workspace owner.",
    path: "/main/dashboard/storage-optimization"
  },
  {
    eyebrow: "Updated",
    title: "Oversharing severity model",
    body:
      "Severity now weighs label sensitivity, share scope and recency of access together.",
    path: "/appendix/severity-allocations"
  },
  {
    eyebrow: "Guide",
    title: "Self-service provisioning",
    body:
      "Set up templates so business users can provision sites and teams within your guardrails.",
    path: "/self-service/templates"
  }
];

export function HomeView({ topSections, totalDocs }: HomeViewProps) {
  return (
    <main
      className="content content-home mx-auto w-full max-w-[1100px] px-6 pt-10 pb-20 lg:px-8"
      style={{ minWidth: 0 }}
    >
      {/* Hero */}
      <section className="max-w-[880px] pt-2 pb-7">
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
          <span>Proventeq365 · User documentation</span>
        </div>

        <h1
          className="m-0 mb-4 font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.8vw, 56px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "var(--fg)"
          }}
        >
          Everything you need to run
          <br />
          <em
            className="not-italic bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, var(--accent-primary) 0%, color-mix(in oklab, var(--accent-primary) 70%, #000) 100%)"
            }}
          >
            Proventeq<span style={{ fontFeatureSettings: '"tnum" 1' }}>365</span>
          </em>{" "}
          with confidence.
        </h1>

        <p
          className="m-0 mb-7 max-w-[640px]"
          style={{ fontSize: "17px", lineHeight: 1.6, color: "var(--fg-2)" }}
        >
          Guides, references and runbooks for managing the Microsoft 365 content lifecycle —
          governance, oversharing, storage optimisation and self-service.
        </p>

        <div className="mt-3.5 flex flex-wrap gap-2">
          <Link className="hero-chip" href="/navigation-menu">
            <BoltIcon size={12} /> Quick start
          </Link>
          <a
            className="hero-chip"
            href="/llms.txt"
            rel="noreferrer"
            target="_blank"
          >
            <AiIcon size={12} /> AI-friendly · llms.txt
            <ArrowUpRightIcon size={10} />
          </a>
          <Link className="hero-chip" href="/appendix">
            <SparklesIcon size={12} /> What&apos;s new
          </Link>
        </div>
      </section>

      {/* Browse by area */}
      <section>
        <div
          className="mt-9 mb-3.5 flex items-baseline justify-between border-b pb-2.5"
          style={{ borderColor: "var(--line)" }}
        >
          <h2
            className="m-0 font-semibold"
            style={{ fontSize: "18px", letterSpacing: "-0.005em", color: "var(--fg)" }}
          >
            Browse by area
          </h2>
          <span style={{ fontSize: "12px", color: "var(--fg-3)" }}>
            {topSections.length} sections · {totalDocs} articles
          </span>
        </div>

        <div className="grid gap-3 [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(2,1fr)] max-[600px]:[grid-template-columns:1fr]">
          {topSections.slice(0, 8).map((section) => {
            const Icon = SECTION_ICONS[section.url] ?? FolderIcon;
            return (
              <Link className="section-card group" href={section.url} key={section.url}>
                <div className="section-card-icon">
                  <Icon size={16} />
                </div>
                <div className="section-card-title">{section.title}</div>
                <div className="section-card-desc">{section.description}</div>
                <span className="section-card-arrow">
                  <ArrowRightIcon size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* What's new */}
      <section className="mt-1">
        <div
          className="mt-9 mb-3.5 flex items-baseline justify-between border-b pb-2.5"
          style={{ borderColor: "var(--line)" }}
        >
          <h2
            className="m-0 font-semibold"
            style={{ fontSize: "18px", letterSpacing: "-0.005em", color: "var(--fg)" }}
          >
            What&apos;s new
          </h2>
        </div>
        <div className="grid gap-3 [grid-template-columns:repeat(3,minmax(0,1fr))] max-[900px]:[grid-template-columns:1fr]">
          {HIGHLIGHTS.map((h) => (
            <Link className="highlight-card" href={h.path} key={h.path}>
              <div className="highlight-eyebrow">{h.eyebrow}</div>
              <div className="highlight-title">{h.title}</div>
              <div className="highlight-body">{h.body}</div>
              <div className="highlight-cta">
                Read article <ArrowRightIcon size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI banner */}
      <section className="ai-banner">
        <div className="ai-banner-mark" aria-hidden="true">
          <SparklesIcon size={18} />
        </div>
        <div>
          <div className="ai-banner-title">
            Built for humans <span>and</span> for AI.
          </div>
          <div className="ai-banner-body">
            Every article is exposed as clean Markdown and indexed in <code>llms.txt</code>. Use
            <strong> Copy as Markdown</strong> on any page to drop it into Microsoft 365 Copilot,
            ChatGPT or Claude — the answer comes back grounded in the same source you read.
          </div>
        </div>
        <div className="flex gap-2 max-[820px]:col-span-full">
          <a
            className="btn btn-primary"
            href="/llms.txt"
            rel="noreferrer"
            target="_blank"
          >
            View llms.txt
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="foot">
        <div className="foot-cols">
          <div className="foot-col">
            <div className="foot-brand">
              <span className="brand-mark">
                <span className="brand-mark-inner" />
              </span>
              <span>Proventeq365</span>
            </div>
            <p className="foot-tag">
              The control plane for the Microsoft 365 content lifecycle.
            </p>
          </div>
          <div className="foot-col">
            <div className="foot-title">Product</div>
            <a href="https://www.proventeq.com/proventeq365" rel="noreferrer" target="_blank">Platform</a>
            <a href="https://www.proventeq.com/proventeq365/migration-accelerator" rel="noreferrer" target="_blank">Migration Accelerator</a>
            <a href="https://www.proventeq.com/proventeq365/governance-compliance" rel="noreferrer" target="_blank">Governance & Compliance</a>
            <a href="https://www.proventeq.com/proventeq365/copilot-readiness" rel="noreferrer" target="_blank">Copilot Readiness</a>
          </div>
          <div className="foot-col">
            <div className="foot-title">Help</div>
            <Link href="/navigation-menu">Quick start</Link>
            <a href="https://support.proventeq.com" rel="noreferrer" target="_blank">Open a ticket</a>
            <Link href="/appendix">Appendix</Link>
          </div>
          <div className="foot-col">
            <div className="foot-title">For AI tools</div>
            <a href="/llms.txt" rel="noreferrer" target="_blank">llms.txt</a>
          </div>
        </div>
        <div className="foot-bar">
          <span>© Proventeq Ltd 2026. {siteConfig.name}.</span>
          <span className="foot-bar-meta">
            <span className="dot dot-ok" /> All systems normal
          </span>
        </div>
      </footer>
    </main>
  );
}
