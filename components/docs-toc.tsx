import { AiIcon, ArrowUpRightIcon } from "@/components/icons";
import { CopyMarkdownAction } from "@/components/article-actions";
import type { Heading } from "@/lib/docs";

interface DocsTocProps {
  headings: Heading[];
}

export function DocsToc({ headings }: DocsTocProps) {
  return (
    <aside className="toc" aria-label="On this page">
      {headings.length > 0 && (
        <>
          <div className="toc-title">On this page</div>
          <ul>
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
          <div className="toc-divider" />
        </>
      )}
    </aside>
  );
}
