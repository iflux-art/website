import React from "react";
import { cn } from "@/lib/utils";
import Copy from "@/components/ui/markdown/copy";

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
  language?: string;
  filename?: string;
}

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  'data-filename'?: string;
  children: React.ReactNode;
}

export function CodeBlock({
  className,
  children,
  language,
  filename,
}: CodeBlockProps) {
  // 提取语言类名
  const languageClass = language ? `language-${language}` : "";

  return (
    <div className="relative my-6 rounded-lg border bg-muted overflow-hidden">
      {/* 文件名和语言标签 */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2 text-sm text-muted-foreground">
          {filename && <span>{filename}</span>}
          {language && <span className="text-xs uppercase">{language}</span>}
        </div>
      )}

      {/* 代码内容 */}
      <div className="relative">
        <pre
          className={cn(
            "overflow-x-auto p-4 text-sm leading-relaxed",
            languageClass,
            className
          )}
        >
          <code className={languageClass}>{children}</code>
        </pre>

        {/* 复制按钮 */}
        <div className="absolute right-3 top-3 h-7 w-7 rounded-md border bg-background p-1 hover:bg-accent hover:text-accent-foreground">
          <Copy
            content={
              React.isValidElement(children)
                ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
                : String(children || '')
            }
          />
        </div>
      </div>
    </div>
  );
}

// 导出代码块组件
export const codeBlockComponents = {
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("overflow-x-auto", className)} {...props} />
  ),
  code: ({ className, ...props }: CodeProps) => {
    // 从className中提取语言信息
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : undefined;

    // 从props中提取文件名信息
    const filename = props["data-filename"] as string | undefined;

    // 检查父元素是否为<p>标签
    const parentIsParagraph =
      (props as unknown as { parentElement?: HTMLElement }).parentElement?.tagName.toLowerCase() === "p";

    // 如果父元素是<p>标签，直接返回代码块，否则包装在CodeBlock组件中
    return parentIsParagraph ? (
      <pre className={cn("overflow-x-auto my-6", className)}>
        <code>{props.children}</code>
      </pre>
    ) : (
      <CodeBlock language={language} filename={filename} className={className}>
        {props.children}
      </CodeBlock>
    );
  },
};
