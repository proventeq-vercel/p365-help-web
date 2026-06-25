import { DOCS_BASE, getDocsData } from "@/lib/docs";

export interface SearchDocument {
  id: string;
  url: string;
  title: string;
  description: string;
  section: string;
  headings: string;
  text: string;
}

/**
 * Converts a Markdown body to a plain-text string suitable for full-text
 * indexing. Fenced code blocks are dropped (they add noise and bloat the
 * index), while inline code, link text and table cells are preserved.
 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[ \t]*[#>]+/gm, " ")
    .replace(/[*_~]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds the client-side search corpus from the wiki docs. Each entry carries
 * the fields MiniSearch indexes (title, headings, description, text) plus the
 * stored fields the result list renders (url, section).
 */
export function getSearchDocuments(): SearchDocument[] {
  const { docs, bySlug } = getDocsData();

  return docs
    .filter((doc) => doc.url !== DOCS_BASE)
    .map((doc) => {
      const sectionDoc = doc.slugSegments.length > 1 ? bySlug.get(doc.slugSegments[0]) : undefined;

      return {
        id: doc.url,
        url: doc.url,
        title: doc.title,
        description: doc.description,
        section: sectionDoc && sectionDoc.url !== doc.url ? sectionDoc.title : "",
        headings: doc.headings.map((heading) => heading.text).join(" "),
        text: toPlainText(doc.content)
      } satisfies SearchDocument;
    });
}
