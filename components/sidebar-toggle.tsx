"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "p365-help-sidebar-collapsed";
const TOGGLE_EVENT = "p365-sidebar-toggle";

function readInitialCollapsed(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-sidebar-collapsed") === "true";
}

function useSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState<boolean>(readInitialCollapsed);

  useEffect(() => {
    // Sync from initial DOM attribute after hydration (server-rendered as false).
    setCollapsed(readInitialCollapsed());

    const onToggle = (event: Event) => {
      const detail = (event as CustomEvent<boolean>).detail;
      setCollapsed(detail);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setCollapsed(event.newValue === "true");
      }
    };
    window.addEventListener(TOGGLE_EVENT, onToggle);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(TOGGLE_EVENT, onToggle);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback(() => {
    const current = document.documentElement.getAttribute("data-sidebar-collapsed") === "true";
    const next = !current;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "true" : "false");
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-sidebar-collapsed", next ? "true" : "false");
    window.dispatchEvent(new CustomEvent<boolean>(TOGGLE_EVENT, { detail: next }));
  }, []);

  return [collapsed, toggle];
}

/** Toggle button shown in the sidebar header when expanded. */
export function SidebarCollapseButton({ className }: { className?: string }) {
  const [collapsed, toggle] = useSidebarCollapsed();

  return (
    <button
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
      onClick={toggle}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      type="button"
    >
      <PanelLeftClose className="h-4 w-4" />
    </button>
  );
}

/** Floating button to re-open the sidebar — only visible when collapsed. */
export function SidebarExpandButton() {
  const [collapsed, toggle] = useSidebarCollapsed();

  if (!collapsed) return null;

  return (
    <button
      aria-label="Expand sidebar"
      className="fixed left-3 top-24 z-30 hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
      onClick={toggle}
      title="Expand sidebar"
      type="button"
    >
      <PanelLeftOpen className="h-4 w-4" />
    </button>
  );
}
