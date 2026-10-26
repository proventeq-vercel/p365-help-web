import { DOCS_BASE, getDocsData, resolveMarkdownHref } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

// Every page's Markdown in reading order, for AI assistants that ingest the
// whole help center in one request. Images are dropped; links are made absolute.
export function GET() {
  const pages = getDocsData()
    .docs.filter((doc) => doc.url !== DOCS_BASE)
    .map((doc) => {
      const body = doc.content
        .replace(/^#\s+.+\n+/, "")
        .replace(/!\[[^\]]*\]\([^)]*\)\n?/g, "")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, text: string, href: string) => {
          const resolved = resolveMarkdownHref(doc, href);
          return `[${text}](${resolved.startsWith("/") ? siteConfig.baseUrl + resolved : resolved})`;
        });
      return [
        `# ${doc.title}`,
        "",
        `URL: ${siteConfig.baseUrl}${doc.url}`,
        `Updated: ${doc.updated}`,
        "",
        `> ${doc.description}`,
        "",
        body.trim(),
        ""
      ].join("\n");
    });

  return new Response([`# Proventeq365 Help Center — full text`, "", ...pages].join("\n---\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
