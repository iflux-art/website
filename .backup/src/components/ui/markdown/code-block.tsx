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

  // 语法高亮样式类
  const syntaxHighlightClasses = {
    // 关键字
    keyword: "text-purple-500 dark:text-purple-400",
    // 字符串
    string: "text-green-500 dark:text-green-400",
    // 数字
    number: "text-blue-500 dark:text-blue-400",
    // 注释
    comment: "text-gray-500 dark:text-gray-400 italic",
    // 函数
    function: "text-yellow-500 dark:text-yellow-400",
    // 变量
    variable: "text-red-500 dark:text-red-400",
    // 类型
    type: "text-teal-500 dark:text-teal-400",
    // 属性
    property: "text-pink-500 dark:text-pink-400",
    // 标点符号
    punctuation: "text-gray-600 dark:text-gray-300",
    // 运算符
    operator: "text-yellow-600 dark:text-yellow-300",
  };

  return (
    <div className="relative my-6 rounded-lg border bg-muted overflow-hidden shadow-sm">
      {/* macOS 风格的标题栏 */}
      <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-muted border-b">
        {/* 三个圆点 */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 opacity-90 dark:opacity-80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 opacity-90 dark:opacity-80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 opacity-90 dark:opacity-80"></div>
        </div>

        {/* 文件名和语言标签 */}
        <div className="flex-1 flex justify-center">
          {filename && (
            <span className="text-xs font-medium text-muted-foreground mx-auto truncate max-w-[150px] sm:max-w-xs">
              {filename}
            </span>
          )}
        </div>

        {/* 语言标签和复制按钮 */}
        <div className="flex items-center space-x-2">
          {language && (
            <span className="hidden sm:inline-block text-xs uppercase text-muted-foreground">
              {language}
            </span>
          )}
          <Copy
            content={
              React.isValidElement(children)
                ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
                : String(children || '')
            }
          />
        </div>
      </div>

      {/* 代码内容 */}
      <div className="relative">
        <pre
          className={cn(
            "overflow-x-auto p-3 sm:p-4 text-sm leading-relaxed",
            languageClass,
            className
          )}
        >
          <code className={cn(
            "font-mono",
            languageClass,
            // 添加语法高亮基础样式
            "[&_.token.keyword]:text-purple-500 [&_.token.keyword]:dark:text-purple-400",
            "[&_.token.string]:text-green-500 [&_.token.string]:dark:text-green-400",
            "[&_.token.number]:text-blue-500 [&_.token.number]:dark:text-blue-400",
            "[&_.token.comment]:text-gray-500 [&_.token.comment]:dark:text-gray-400 [&_.token.comment]:italic",
            "[&_.token.function]:text-yellow-500 [&_.token.function]:dark:text-yellow-400",
            "[&_.token.variable]:text-red-500 [&_.token.variable]:dark:text-red-400",
            "[&_.token.type]:text-teal-500 [&_.token.type]:dark:text-teal-400",
            "[&_.token.property]:text-pink-500 [&_.token.property]:dark:text-pink-400",
            "[&_.token.punctuation]:text-gray-600 [&_.token.punctuation]:dark:text-gray-300",
            "[&_.token.operator]:text-yellow-600 [&_.token.operator]:dark:text-yellow-300",
          )}>
            {children}
          </code>
        </pre>
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

    // 如果有language类，说明这是一个代码块，应该使用CodeBlock组件
    // 否则，这是一个内联代码，应该使用普通的code标签
    if (language) {
      return (
        <CodeBlock language={language} filename={filename} className={className}>
          {props.children}
        </CodeBlock>
      );
    } else {
      // 内联代码
      return <code className={className} {...props} />;
    }
  },
};
