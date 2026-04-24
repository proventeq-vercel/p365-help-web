import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ChevronRight, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { MarkdownContent } from "@/components/markdown-content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocBySlug, getDocNeighbors, getDocsData } from "@/lib/docs";
import { getSectionUiMeta } from "@/lib/docs-ui";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export const dynamicParams = false;

function breadcrumbsFromSlug(slugSegments: string[]) {
  const crumbs = [{ href: "/", label: "Home" }];
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
    alternates: {
      canonical: doc.url
    },
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

  const crumbs = breadcrumbsFromSlug(slug);
  const { previous, next } = getDocNeighbors(doc.url);
  const isHome = doc.url === "/";
  const currentMeta = getSectionUiMeta(doc.url);
  const CurrentIcon = currentMeta.icon;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
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

  return (
    <div className="page-shell py-6">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_240px]">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="rounded-2xl border bg-card/90 p-3 shadow-sm backdrop-blur pastel-ring">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sections</p>
            <DocsSidebar currentUrl={doc.url} items={docsData.sidebar} />
          </div>
        </aside>

        <main className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <span className="flex items-center gap-2" key={crumb.href}>
                <Link className="inline-flex items-center gap-1 hover:text-foreground" href={crumb.href}>
                  {index === 0 ? <Home className="h-3.5 w-3.5" /> : null}
                  {crumb.label}
                </Link>
                {index < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            ))}
          </nav>

          <section className={cn("mb-4 rounded-2xl border p-4 shadow-sm pastel-ring", currentMeta.cardClass)}>
            <div className="flex flex-wrap items-start gap-3">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", currentMeta.iconBadgeClass)}>
                <CurrentIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold">{doc.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                AI-friendly docs
              </span>
            </div>
          </section>

          <article className="rounded-2xl border bg-card/95 p-5 shadow-sm sm:p-8 pastel-ring">
            <MarkdownContent doc={doc} />
          </article>

          {isHome && docsData.topSections.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Quick access</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {docsData.topSections.map((sectionDoc) => {
                  const sectionMeta = getSectionUiMeta(sectionDoc.url);
                  const SectionIcon = sectionMeta.icon;

                  return (
                    <Card className={cn("transition-shadow hover:shadow-md pastel-ring", sectionMeta.cardClass)} key={sectionDoc.url}>
                      <CardHeader className="pb-3">
                        <span
                          className={cn("mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg", sectionMeta.iconBadgeClass)}
                        >
                          <SectionIcon className="h-4 w-4" />
                        </span>
                        <CardTitle className="text-base">
                          <Link className="hover:text-primary" href={sectionDoc.url}>
                            {sectionDoc.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{sectionDoc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" href={sectionDoc.url}>
                          Open section
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              className={cn(
                "rounded-xl border bg-card p-4 text-sm transition-colors pastel-ring",
                previous ? "hover:bg-muted" : "pointer-events-none opacity-50"
              )}
              href={previous?.url ?? "#"}
            >
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </p>
              <p className="mt-1 font-medium">{previous?.title ?? "No previous page"}</p>
            </Link>
            <Link
              className={cn(
                "rounded-xl border bg-card p-4 text-right text-sm transition-colors pastel-ring",
                next ? "hover:bg-muted" : "pointer-events-none opacity-50"
              )}
              href={next?.url ?? "#"}
            >
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </p>
              <p className="mt-1 font-medium">{next?.title ?? "No next page"}</p>
            </Link>
          </div>
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-20 rounded-2xl border bg-card/90 p-4 shadow-sm backdrop-blur pastel-ring">
            <DocsToc headings={doc.headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
