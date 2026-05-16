import type { DocItem } from "@/lib/docs";

/**
 * Renders a DocItem back to a Markdown string that's safe to drop into an AI
 * chat (Copilot, ChatGPT, Claude) as context. Strips the YAML frontmatter,
 * keeps the body, and adds a small "from" line so the LLM knows the source.
 */
export function renderDocAsMarkdown(doc: DocItem): string {
  const body = doc.content.replace(/^---\n[\s\S]*?\n---\n+/m, "").trim();
  const sourceLine = `_Source: ${doc.url} — Proventeq365 Help Center_`;
  return `# ${doc.title}\n\n${sourceLine}\n\n${body}\n`;
}
