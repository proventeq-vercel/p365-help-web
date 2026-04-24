import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { SidebarItem } from "@/lib/docs";
import { getSectionUiMeta } from "@/lib/docs-ui";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  items: SidebarItem[];
  currentUrl: string;
}

export function DocsSidebar({ items, currentUrl }: DocsSidebarProps) {
  return (
    <nav aria-label="Documentation sections" className="space-y-1.5">
      {items.map((item) => {
        const isActive = item.url === currentUrl;
        const isTopLevel = item.depth === 1;
        const meta = getSectionUiMeta(item.url);
        const ItemIcon = meta.icon;

        return (
          <Link
            className={cn(
              "group relative flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
              isTopLevel ? "font-medium" : "text-[13px]",
              isActive ? cn(meta.activeClass, "shadow-sm") : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground"
            )}
            href={item.url}
            key={item.url}
            style={{ paddingLeft: `${0.75 + Math.max(item.depth - 1, 0) * 0.85}rem` }}
          >
            {isActive && <span className={cn("absolute left-1 h-5 w-1 rounded-full", meta.pillClass)} />}
            <span
              className={cn(
                "flex items-center justify-center rounded-lg",
                isTopLevel ? cn("h-7 w-7", meta.iconBadgeClass) : "h-5 w-5 text-muted-foreground/90"
              )}
            >
              {isTopLevel ? <ItemIcon className="h-4 w-4" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
