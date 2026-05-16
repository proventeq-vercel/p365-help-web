import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PanelLeftCloseIcon
} from "@/components/icons";
import { CopyMarkdownAction, MarkdownPublisher } from "@/components/article-actions";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { HomeView } from "@/components/home-view";
import { MarkdownContent } from "@/components/markdown-content";
import { SidebarCollapseButton, SidebarExpandButton } from "@/components/sidebar-toggle";
import { getDocBySlug, getDocNeighbors, getDocsData } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";
import { renderDocAsMarkdown } from "@/lib/markdown-export";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export const dynamicParams = false;

function breadcrumbsFromSlug(slugSegments: string[]) {
  const crumbs = [{ href: "/", label: "Documentation" }];
  let partial: string[] = [];

  for (const segment of slugSegments) {
    partial = [...partial, segment];
    const href = `/${partial.join("/")}`;
    const doc = getDocBySlug(partial);
    crumbs.push({
      href,
      label: doc?.title ?? segment.replace(/-/g, " ")
    });
  }

  return crumbs;
}

export function generateStaticParams() {
  const { docs } = getDocsData();
  return docs.map((doc) => ({ slug: doc.slugSegments }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.url },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: `${siteConfig.baseUrl}${doc.url}`
    }
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const docsData = getDocsData();
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const isHome = doc.url === "/";
  const crumbs = breadcrumbsFromSlug(slug);
  const { previous, next } = getDocNeighbors(doc.url);
  const articleMarkdown = renderDocAsMarkdown(doc);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": isHome ? "WebSite" : "TechArticle",
    name: doc.title,
    description: doc.description,
    url: `${siteConfig.baseUrl}${doc.url}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: `${siteConfig.baseUrl}${crumb.href}`
      }))
    }
  };

  // Home view: render the marketing landing page, but keep the sidebar.
  if (isHome) {
    return (
      <>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
        <SidebarExpandButton />
        <div
          className="docs-grid grid"
          style={{ minHeight: "calc(100vh - var(--topbar-h))" }}
        >
          <aside
            className="docs-sidebar-aside scrollbar-slim lg:sticky lg:overflow-y-auto"
            style={{
              top: "var(--topbar-h)",
              height: "calc(100vh - var(--topbar-h))",
              borderRight: "1px solid var(--line)",
              background: "var(--bg)"
            }}
          >
            <div className="flex justify-end px-3 pt-3 lg:hidden">
              <SidebarCollapseButton />
            </div>
            <DocsSidebar currentUrl={doc.url} items={docsData.sidebar} />
          </aside>
          <HomeView topSections={docsData.topSections} totalDocs={docsData.docs.length} />
        </div>
      </>
    );
  }

  // Article view.
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <MarkdownPublisher markdown={articleMarkdown} />
      <SidebarExpandButton />
      <div className="docs-grid grid" style={{ minHeight: "calc(100vh - var(--topbar-h))" }}>
        <aside
          className="docs-sidebar-aside scrollbar-slim lg:sticky lg:overflow-y-auto"
          style={{
            top: "var(--topbar-h)",
            height: "calc(100vh - var(--topbar-h))",
            borderRight: "1px solid var(--line)",
            background: "var(--bg)"
          }}
        >
          <div className="flex justify-end px-3 pt-3 lg:hidden">
            <SidebarCollapseButton />
          </div>
          <DocsSidebar currentUrl={doc.url} items={docsData.sidebar} />
        </aside>

        <div
          className="mx-auto grid w-full min-w-0 max-w-[1180px] gap-12 px-6 pt-7 pb-20 lg:px-8 xl:[grid-template-columns:minmax(0,1fr)_var(--toc-w)]"
        >
          <article className="min-w-0" style={{ maxWidth: "var(--content-max)" }}>
            <header className="border-b pb-6" style={{ borderColor: "var(--line)" }}>
              <nav aria-label="Breadcrumb" className="article-eyebrow">
                {crumbs.map((crumb, index) => (
                  <span className="inline-flex items-center gap-1.5" key={crumb.href}>
                    {index === 0 ? (
                      <Link className="inline-flex items-center gap-1" href={crumb.href}>
                        <HomeIcon size={12} />
                        {crumb.label}
                      </Link>
                    ) : index < crumbs.length - 1 ? (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                      <span style={{ color: "var(--fg-2)" }}>{crumb.label}</span>
                    )}
                    {index < crumbs.length - 1 && <ChevronRightIcon size={11} style={{ color: "var(--fg-4)" }} />}
                  </span>
                ))}
              </nav>

              <h1 className="article-title">{doc.title}</h1>
              {doc.description && doc.description !== doc.title && (
                <p className="article-summary">{doc.description}</p>
              )}

              <div className="article-meta">
                <span className="meta-pill">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--accent-swatch)" }}
                  />
                  Updated May 2026
                </span>
                <span className="meta-actions">
                  <CopyMarkdownAction />
                </span>
              </div>
            </header>

            <div className="pt-6">
              <MarkdownContent doc={doc} />
            </div>

            <nav className="mt-7 grid grid-cols-2 gap-3">
              {previous ? (
                <Link className="pn pn-prev" href={previous.url}>
                  <ChevronLeftIcon size={14} />
                  <span>
                    <span className="pn-label">Previous</span>
                    <span className="pn-title">{previous.title}</span>
                  </span>
                </Link>
              ) : (
                <span className="pn pn-disabled" aria-hidden="true">
                  <ChevronLeftIcon size={14} />
                  <span>
                    <span className="pn-label">Previous</span>
                    <span className="pn-title">—</span>
                  </span>
                </span>
              )}
              {next ? (
                <Link className="pn pn-next" href={next.url}>
                  <span>
                    <span className="pn-label">Next</span>
                    <span className="pn-title">{next.title}</span>
                  </span>
                  <ChevronRightIcon size={14} />
                </Link>
              ) : (
                <span className="pn pn-next pn-disabled" aria-hidden="true">
                  <span>
                    <span className="pn-label">Next</span>
                    <span className="pn-title">—</span>
                  </span>
                  <ChevronRightIcon size={14} />
                </span>
              )}
            </nav>
          </article>

          <div className="hidden xl:block">
            <DocsToc headings={doc.headings} />
          </div>
        </div>
      </div>
    </>
  );
}

// Suppress unused-import warning for the icon kept available to layout consumers.
void PanelLeftCloseIcon;
