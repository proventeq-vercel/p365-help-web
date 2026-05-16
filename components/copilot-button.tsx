"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { CheckIcon, SparklesIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COPILOT_URL = "https://m365.cloud.microsoft/chat";

/**
 * Open-in-Copilot button. On article pages, copies the page's markdown to the
 * clipboard (the MarkdownPublisher sets it on `window.__p365CurrentMarkdown`)
 * then opens Microsoft 365 Copilot in a new tab. M365 Copilot has no public
 * deep-link with a prefilled prompt, so clipboard + new tab is the cleanest
 * pattern.
 */
export function CopilotButton() {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const pathname = usePathname();
  const isArticle = pathname !== "/";

  function handleClick() {
    const md = typeof window !== "undefined" ? window.__p365CurrentMarkdown : "";
    if (md && navigator.clipboard) {
      const prefix =
        "I'm reading the Proventeq365 help article below. Please answer my next question using this as context.\n\n---\n\n";
      navigator.clipboard.writeText(prefix + md).catch(() => {});
      setState("copied");
      setTimeout(() => setState("idle"), 2400);
    }
    window.open(COPILOT_URL, "_blank", "noopener,noreferrer");
  }

  const label =
    state === "copied"
      ? "Copied — paste in Copilot"
      : isArticle
        ? "Send to Copilot"
        : "Open in Copilot";

  return (
    <button
      className={cn("ai-btn", state === "copied" && "is-copied")}
      onClick={handleClick}
      title={isArticle ? "Copy this page as Markdown and open Microsoft 365 Copilot" : "Open Microsoft 365 Copilot"}
      type="button"
    >
      {state === "copied" ? <CheckIcon size={14} /> : <SparklesIcon size={14} />}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

declare global {
  interface Window {
    __p365CurrentMarkdown?: string;
  }
}
