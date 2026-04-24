import { ListTree } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/docs";

interface DocsTocProps {
  headings: Heading[];
}

export function DocsToc({ headings }: DocsTocProps) {
  if (!headings.length) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="space-y-1.5">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <ListTree className="h-3.5 w-3.5" />
        On this page
      </p>
      {headings.map((heading) => (
        <a
          className={cn(
            "block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            heading.level === 3 && "ml-4 text-xs"
          )}
          href={`#${heading.id}`}
          key={heading.id}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
