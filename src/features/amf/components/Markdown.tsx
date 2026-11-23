import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div
      className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
        prose-headings:scroll-mt-20 prose-h3:mt-8 prose-h3:mb-3
        prose-table:block prose-table:overflow-x-auto prose-table:w-full prose-table:text-sm
        prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:align-top
        prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:font-normal
        prose-strong:text-foreground"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
