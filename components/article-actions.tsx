"use client";

import { useState } from "react";

import { CheckIcon, CopyIcon, SparklesIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COPILOT_URL = "https://m365.cloud.microsoft/chat";
const COPILOT_PREFIX =
  "I'm reading the Proventeq365 help article below. Please answer my next question using this as context.\n\n---\n\n";

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

export function OpenInCopilotAction({ variant = "meta" }: { variant?: "meta" | "toc" }) {
  const [pinged, setPinged] = useState(false);

  function handleClick() {
    const md = readMarkdown();
    if (md && navigator.clipboard) {
      navigator.clipboard.writeText(COPILOT_PREFIX + md).catch(() => {});
      setPinged(true);
      setTimeout(() => setPinged(false), 2200);
    }
    window.open(COPILOT_URL, "_blank", "noopener,noreferrer");
  }

  const Icon = pinged ? CheckIcon : SparklesIcon;
  const label = pinged ? "Copied — paste in Copilot" : "Open in M365 Copilot";

  if (variant === "toc") {
    return (
      <button onClick={handleClick} type="button">
        <Icon size={11} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      className={cn("meta-action meta-action-primary")}
      onClick={handleClick}
      type="button"
    >
      <Icon size={12} />
      <span>{label}</span>
    </button>
  );
}

/**
 * Publishes the current page's Markdown on `window.__p365CurrentMarkdown` so
 * that the Copy / Open-in-Copilot actions (which can live anywhere in the page,
 * including the topbar) read consistent content for the current page.
 */
export function MarkdownPublisher({ markdown }: { markdown: string }) {
  if (typeof window !== "undefined") {
    window.__p365CurrentMarkdown = markdown;
  }
  return null;
}
