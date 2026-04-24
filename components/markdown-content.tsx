import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import type { DocItem } from "@/lib/docs";
import { resolveMarkdownHref, resolveMarkdownImageSrc } from "@/lib/docs";

interface MarkdownContentProps {
  doc: DocItem;
}

export function MarkdownContent({ doc }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-slate max-w-none text-base leading-7",
        "dark:prose-invert dark:prose-p:text-slate-200 dark:prose-li:text-slate-200 dark:prose-headings:text-slate-100 dark:prose-strong:text-slate-100 dark:prose-code:text-slate-100",
        "prose-headings:scroll-mt-24 prose-a:text-primary dark:prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-table:rounded-lg prose-table:border"
      )}
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
        img({ src, alt, ...props }) {
          const srcValue = typeof src === "string" ? src : undefined;
          const resolvedSrc = resolveMarkdownImageSrc(doc, srcValue);
          return <img alt={alt ?? ""} loading="lazy" src={resolvedSrc} {...props} />;
        },
        table({ className, ...props }) {
          return <table className={cn("w-full text-sm", className)} {...props} />;
        },
        th({ className, ...props }) {
          return <th className={cn("border px-3 py-2 text-left font-semibold", className)} {...props} />;
        },
        td({ className, ...props }) {
          return <td className={cn("border px-3 py-2 align-top", className)} {...props} />;
        },
        h2({ className, ...props }) {
          return <h2 className={cn("border-b pb-2", className)} {...props} />;
        },
        code({ className, children, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className={cn("block overflow-x-auto rounded-md bg-muted p-4 text-sm", className)} {...props}>
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
