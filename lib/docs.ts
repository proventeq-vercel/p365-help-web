import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";
import GithubSlugger from "github-slugger";

import { humanizeSegment } from "@/lib/utils";

export const WIKI_ROOT = path.join(process.cwd(), "wiki");

export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

export interface DocItem {
  title: string;
  description: string;
  url: string;
  slugSegments: string[];
  sourceAbsolutePath: string;
  sourceRelativePath: string;
  content: string;
  headings: Heading[];
}

export interface SidebarItem {
  title: string;
  url: string;
  depth: number;
}

export interface DocsData {
  docs: DocItem[];
  bySlug: Map<string, DocItem>;
  byRelativePath: Map<string, DocItem>;
  sidebar: SidebarItem[];
  topSections: DocItem[];
}

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function getNumericPrefix(name: string) {
  const match = name.match(/^(\d+)[\s\-_.]?/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function cleanSegment(segment: string) {
  const noPrefix = segment.replace(/^\d+[\s\-_.]*/, "");
  const normalized = noPrefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized.length > 0) {
    return normalized;
  }

  return segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function entryRank(entry: fs.Dirent) {
  if (entry.isFile() && /^readme\.md$/i.test(entry.name)) {
    return 0;
  }
  if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
    return 1;
  }
  if (entry.isDirectory()) {
    return 2;
  }
  return 3;
}

function sortEntries(entries: fs.Dirent[]) {
  return [...entries].sort((a, b) => {
    const byPrefix = getNumericPrefix(a.name) - getNumericPrefix(b.name);
    if (byPrefix !== 0) {
      return byPrefix;
    }

    const byRank = entryRank(a) - entryRank(b);
    if (byRank !== 0) {
      return byRank;
    }

    return a.name.localeCompare(b.name);
  });
}

function listMarkdownFiles(root: string): string[] {
  const results: string[] = [];

  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = sortEntries(fs.readdirSync(dir, { withFileTypes: true })).filter(
      (entry) => !entry.name.startsWith(".")
    );

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        results.push(absolutePath);
      }
    }
  };

  walk(root);
  return results;
}

function sourcePathToSlugSegments(sourceRelativePath: string) {
  const parts = sourceRelativePath.split(path.posix.sep);
  const fileName = parts.pop();
  const folderSegments = parts.map(cleanSegment).filter(Boolean);

  if (!fileName) {
    return folderSegments;
  }

  const stem = fileName.replace(/\.md$/i, "");
  if (/^readme$/i.test(stem)) {
    return folderSegments;
  }

  return [...folderSegments, cleanSegment(stem)];
}

function extractFirstHeading(markdown: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) {
    return null;
  }
  return normalizeHeadingText(match[1]);
}

function extractDescription(markdown: string) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("#") || line.startsWith("![")) {
      continue;
    }

    return normalizeHeadingText(line).slice(0, 180);
  }

  return "Documentation page";
}

function normalizeHeadingText(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/#+$/, "")
    .trim();
}

function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const headingText = normalizeHeadingText(match[2]);
    if (!headingText) {
      continue;
    }

    headings.push({
      level,
      text: headingText,
      id: slugger.slug(headingText)
    });
  }

  return headings;
}

function slugKey(slugSegments: string[]) {
  return slugSegments.join("/");
}

function loadDocs(): DocsData {
  const files = listMarkdownFiles(WIKI_ROOT);

  const docs = files.map((absolutePath) => {
    const sourceRelativePath = toPosixPath(path.relative(WIKI_ROOT, absolutePath));
    const slugSegments = sourcePathToSlugSegments(sourceRelativePath);
    const url = slugSegments.length === 0 ? "/" : `/${slugSegments.join("/")}`;

    const raw = fs.readFileSync(absolutePath, "utf-8");
    const parsed = matter(raw);
    const content = parsed.content.trim();
    const titleFromHeading = extractFirstHeading(content);
    const fallbackTitle = slugSegments.length
      ? humanizeSegment(slugSegments[slugSegments.length - 1])
      : "Introduction";

    const title = (parsed.data.title as string | undefined)?.trim() || titleFromHeading || fallbackTitle;
    const description = (parsed.data.description as string | undefined)?.trim() || extractDescription(content);

    return {
      title,
      description,
      url,
      slugSegments,
      sourceAbsolutePath: absolutePath,
      sourceRelativePath,
      content,
      headings: extractHeadings(content)
    } satisfies DocItem;
  });

  const bySlug = new Map<string, DocItem>();
  const byRelativePath = new Map<string, DocItem>();

  for (const doc of docs) {
    bySlug.set(slugKey(doc.slugSegments), doc);
    byRelativePath.set(doc.sourceRelativePath, doc);
  }

  const sidebar: SidebarItem[] = docs
    .filter((doc) => doc.url !== "/")
    .map((doc) => ({
      title: doc.title,
      url: doc.url,
      depth: doc.slugSegments.length
    }));

  const topSections = docs.filter((doc) => doc.slugSegments.length === 1);

  return { docs, bySlug, byRelativePath, sidebar, topSections };
}

export const getDocsData = cache(loadDocs);

export function getDocBySlug(slugSegments: string[]) {
  return getDocsData().bySlug.get(slugKey(slugSegments));
}

export function getDocNeighbors(currentUrl: string) {
  const { docs } = getDocsData();
  const index = docs.findIndex((doc) => doc.url === currentUrl);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: docs[index - 1] ?? null,
    next: docs[index + 1] ?? null
  };
}

function isExternalLink(href: string) {
  return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function encodePathSegments(relativePath: string) {
  return relativePath
    .split(path.posix.sep)
    .map((segment) => encodeURIComponent(segment))
    .join(path.posix.sep);
}

function resolveSourceCandidates(baseSourcePath: string, hrefPath: string) {
  const baseDir = path.posix.dirname(baseSourcePath);
  const normalizedBase = path.posix.normalize(path.posix.join(baseDir, hrefPath));
  const ext = path.posix.extname(normalizedBase).toLowerCase();

  if (normalizedBase.startsWith("..")) {
    return [];
  }

  if (ext === ".md") {
    return [normalizedBase];
  }

  if (!ext) {
    return [`${normalizedBase}.md`, path.posix.join(normalizedBase, "README.md")];
  }

  return [];
}

export function resolveMarkdownHref(doc: DocItem, href?: string) {
  if (!href) {
    return "#";
  }

  if (href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  if (isExternalLink(href)) {
    return href;
  }

  const { byRelativePath } = getDocsData();
  const [hrefPath, hash] = href.split("#");
  const candidates = resolveSourceCandidates(doc.sourceRelativePath, hrefPath);

  for (const candidate of candidates) {
    const target = byRelativePath.get(candidate);
    if (target) {
      return hash ? `${target.url}#${hash}` : target.url;
    }
  }

  return href;
}

export function resolveMarkdownImageSrc(doc: DocItem, src?: string) {
  if (!src) {
    return "";
  }

  if (isExternalLink(src) || src.startsWith("data:") || src.startsWith("/wiki-assets/")) {
    return src;
  }

  if (src.startsWith("/")) {
    const relative = src.replace(/^\/+/, "");
    return `/wiki-assets/${encodePathSegments(relative)}`;
  }

  const srcPath = src.match(/^[^?#]+/)?.[0] ?? src;
  const suffix = src.slice(srcPath.length);
  const baseDir = path.posix.dirname(doc.sourceRelativePath);
  const normalized = path.posix.normalize(path.posix.join(baseDir, srcPath));

  if (normalized.startsWith("..")) {
    return src;
  }

  return `/wiki-assets/${encodePathSegments(normalized)}${suffix}`;
}
