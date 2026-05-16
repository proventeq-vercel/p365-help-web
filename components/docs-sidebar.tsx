"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";

import {
  AiIcon,
  ArchiveIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  BoltIcon,
  BookIcon,
  ChevronDownIcon,
  CompassIcon,
  FolderIcon,
  HistoryIcon,
  KeyIcon,
  LayoutIcon,
  MailIcon,
  ReportIcon,
  RocketIcon,
  SettingsIcon,
  SparklesIcon,
  WorkflowIcon
} from "@/components/icons";
import type { SidebarItem } from "@/lib/docs";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  items: SidebarItem[];
  currentUrl: string;
}

interface IconProps {
  size?: number;
  className?: string;
}

// Map section URLs to icons.
const SECTION_ICONS: Record<string, ComponentType<IconProps>> = {
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

interface SidebarSection {
  url: string;
  title: string;
  Icon: ComponentType<IconProps>;
  items: SidebarItem[];
}

function groupItems(items: SidebarItem[]): SidebarSection[] {
  const sections: SidebarSection[] = [];
  let current: SidebarSection | null = null;

  for (const item of items) {
    if (item.depth === 1) {
      current = {
        url: item.url,
        title: item.title,
        Icon: SECTION_ICONS[item.url] ?? FolderIcon,
        items: []
      };
      sections.push(current);
    } else if (current) {
      current.items.push(item);
    }
  }

  return sections;
}

const COLLAPSE_STORAGE_KEY = "p365-help-sections-collapsed";

export function DocsSidebar({ items, currentUrl }: DocsSidebarProps) {
  const sections = useMemo(() => groupItems(items), [items]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Load collapsed state from localStorage after hydration; until then, render
  // everything expanded (matches SSR output to avoid mismatch warnings).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      if (raw) setCollapsed(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback((url: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div
      className="flex flex-col gap-3.5 px-3.5 py-4"
      style={{ color: "var(--fg-2)" }}
    >
      {/* Version pill */}
      <div
        className="inline-flex items-center gap-1.5 self-start rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent-primary)",
          border: "1px solid color-mix(in oklab, var(--accent-primary) 16%, transparent)"
        }}
      >
        <SparklesIcon size={12} />
        <span>v4.2 · May 2026</span>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-0.5">
        <Link className="sidebar-quick-link" href="/">
          <RocketIcon size={14} />
          <span>Getting started</span>
        </Link>
        <a
          className="sidebar-quick-link"
          href="/llms.txt"
          rel="noreferrer"
          target="_blank"
        >
          <AiIcon size={14} />
          <span>llms.txt</span>
          <ArrowUpRightIcon size={11} className="ml-auto opacity-55" />
        </a>
        <Link className="sidebar-quick-link" href="/appendix">
          <BoltIcon size={14} />
          <span>What&apos;s new</span>
        </Link>
      </div>

      {/* Sections */}
      <nav aria-label="Documentation sections" className="flex flex-col gap-1">
        {sections.map((section) => {
          const isCollapsed = hydrated && collapsed.has(section.url);
          const SectionIcon = section.Icon;
          const sectionIsActive = currentUrl === section.url;

          return (
            <div className="py-1" key={section.url}>
              <div className="flex items-center">
                <Link
                  className={cn(
                    "sidebar-section-head flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                    sectionIsActive && "is-active"
                  )}
                  href={section.url}
                >
                  <SectionIcon size={13} className="sidebar-section-icon" />
                  <span className="sidebar-section-title flex-1 text-[11px] font-semibold uppercase tracking-wider">
                    {section.title}
                  </span>
                </Link>
                {section.items.length > 0 && (
                  <button
                    aria-expanded={!isCollapsed}
                    aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${section.title}`}
                    className="rounded-md p-1 transition-colors"
                    onClick={() => toggle(section.url)}
                    style={{ color: "var(--fg-3)" }}
                    type="button"
                  >
                    <ChevronDownIcon
                      size={12}
                      className={cn("transition-transform", isCollapsed && "-rotate-90")}
                    />
                  </button>
                )}
              </div>

              {!isCollapsed && section.items.length > 0 && (
                <ul className="m-0 list-none p-0 pt-0.5 pb-1.5">
                  {section.items.map((item) => {
                    const active = item.url === currentUrl;
                    return (
                      <li key={item.url}>
                        <Link
                          className={cn(
                            "sidebar-item relative my-0.5 flex items-center gap-2 rounded-md py-1 pl-[22px] pr-2 text-[13px] transition-colors",
                            active && "is-active"
                          )}
                          href={item.url}
                        >
                          <span className="sidebar-item-rail" aria-hidden="true" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer card */}
      <div className="mt-auto pt-3">
        <div
          className="rounded-[10px] p-3"
          style={{
            background: "var(--bg-sunken)",
            border: "1px solid var(--line)"
          }}
        >
          <div className="text-[13px] font-semibold" style={{ color: "var(--fg)" }}>
            Can&apos;t find an answer?
          </div>
          <div className="mt-0.5 mb-2.5 text-[12px]" style={{ color: "var(--fg-3)" }}>
            Open a ticket with our support team.
          </div>
          <a
            className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-all hover:gap-2"
            href="https://support.proventeq.com"
            rel="noreferrer"
            style={{ color: "var(--accent-primary)" }}
            target="_blank"
          >
            Contact support <ArrowRightIcon size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
