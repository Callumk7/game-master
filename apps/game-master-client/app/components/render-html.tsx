import { cn } from "callum-util";

export function RenderHtml({
  content,
  className,
}: { content: string; className?: string }) {
  return (
    <div
      className={cn("prose prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
