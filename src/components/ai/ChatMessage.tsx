import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export function ChatMessage({ role, content, streaming }: ChatMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
        <Brain className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            "prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground/90",
            "prose-strong:text-foreground prose-li:text-foreground/90 prose-a:text-primary",
            "prose-table:text-sm prose-th:text-foreground prose-td:text-foreground/90",
            "prose-code:text-foreground prose-pre:bg-muted"
          )}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <span className="text-muted-foreground">…</span>
          )}
          {streaming && content && (
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
