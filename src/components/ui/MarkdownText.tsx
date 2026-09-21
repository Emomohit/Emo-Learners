import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownText({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <div className="overflow-hidden rounded-md border border-border">
                <div className="bg-muted px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {match ? match[1] : "code"}
                </div>
                <pre className="overflow-x-auto p-4 text-xs">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="rounded bg-primary/10 px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="font-medium text-primary underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-4 w-full overflow-y-auto">
              <table className="w-full text-left text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border-b border-border p-2 font-medium" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border-b border-border/50 p-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
