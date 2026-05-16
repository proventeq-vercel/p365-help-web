import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/code-block";
import { HashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { DocItem } from "@/lib/docs";
import { resolveMarkdownHref, resolveMarkdownImageSrc } from "@/lib/docs";

interface MarkdownContentProps {
  doc: DocItem;
}

export function MarkdownContent({ doc }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      className={cn("docs-prose")}
      rehypePlugins={[rehypeSlug]}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a({ href, children, ...props }) {
          const hrefValue = typeof href === "string" ? href : undefined;
          const resolvedHref = resolveMarkdownHref(doc, hrefValue);

          if (resolvedHref.startsWith("#")) {
            return (
              <a href={resolvedHref} {...props}>
                {children}
              </a>
            );
          }

          const isInternalRoute = resolvedHref.startsWith("/");
          if (isInternalRoute) {
            return (
              <Link href={resolvedHref} {...props}>
                {children}
              </Link>
            );
          }

          return (
            <a href={resolvedHref} rel="noreferrer noopener" target="_blank" {...props}>
              {children}
            </a>
          );
        },
        img({ src, alt, title, className, ...props }) {
          const srcValue = typeof src === "string" ? src : undefined;
          const resolvedSrc = resolveMarkdownImageSrc(doc, srcValue);
          const tooltip = typeof title === "string" && title.trim().length > 0 ? title : undefined;

          return (
            <img
              alt={alt ?? ""}
              className={cn("docs-img", className)}
              loading="lazy"
              src={resolvedSrc}
              title={tooltip}
              {...props}
            />
          );
        },
        h1() {
          // The page title is rendered by the article header — suppress the
          // first-class h1 in the markdown body to avoid duplication.
          return null;
        },
        h2({ children, id, ...props }) {
          return (
            <h2 className="art-h2" id={id} {...props}>
              {id && (
                <a className="art-anchor" href={`#${id}`} aria-label="Anchor">
                  <HashIcon size={12} />
                </a>
              )}
              {children}
            </h2>
          );
        },
        h3({ children, ...props }) {
          return (
            <h3 className="art-h3" {...props}>
              {children}
            </h3>
          );
        },
        p({ children, ...props }) {
          return (
            <p className="art-p" {...props}>
              {children}
            </p>
          );
        },
        ul({ children, ...props }) {
          return (
            <ul className="art-list" {...props}>
              {children}
            </ul>
          );
        },
        ol({ children, ...props }) {
          return (
            <ol className="art-list art-list-ol" {...props}>
              {children}
            </ol>
          );
        },
        blockquote({ children, ...props }) {
          return (
            <blockquote className="art-quote" {...props}>
              {children}
            </blockquote>
          );
        },
        table({ children, ...props }) {
          return (
            <div className="art-table-wrap">
              <table {...props}>{children}</table>
            </div>
          );
        },
        pre({ children }) {
          // react-markdown nests <code> inside <pre> — extract it.
          const childArray = Array.isArray(children) ? children : [children];
          const codeChild = childArray.find((c): c is React.ReactElement<{ className?: string; children?: string }> =>
            typeof c === "object" && c !== null && "props" in c
          );
          const className = codeChild?.props?.className ?? "";
          const langMatch = /language-([\w-]+)/.exec(className);
          const code = String(codeChild?.props?.children ?? "").replace(/\n$/, "");
          return <CodeBlock code={code} language={langMatch?.[1]} className={className} />;
        },
        code({ className, children, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="art-code-inline" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {doc.content}
    </ReactMarkdown>
  );
}
