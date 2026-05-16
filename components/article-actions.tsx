"use client";

import { useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/icons";

declare global {
  interface Window {
    __p365CurrentMarkdown?: string;
  }
}

function readMarkdown(): string {
  if (typeof window === "undefined") return "";
  return window.__p365CurrentMarkdown ?? "";
}

export function CopyMarkdownAction({ variant = "meta" }: { variant?: "meta" | "toc" }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    const md = readMarkdown();
    if (md && navigator.clipboard) {
      navigator.clipboard.writeText(md).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  const Icon = copied ? CheckIcon : CopyIcon;
  const label = copied ? "Copied" : "Copy as Markdown";

  if (variant === "toc") {
    return (
      <button onClick={handleClick} type="button">
        <Icon size={11} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button className="meta-action" onClick={handleClick} type="button">
      <Icon size={12} />
      <span>{label}</span>
    </button>
  );
}

/**
 * Publishes the current page's Markdown on `window.__p365CurrentMarkdown` so
 * that the Copy-as-Markdown action reads the right content for the current
 * page, regardless of where the button is mounted.
 */
export function MarkdownPublisher({ markdown }: { markdown: string }) {
  if (typeof window !== "undefined") {
    window.__p365CurrentMarkdown = markdown;
  }
  return null;
}
