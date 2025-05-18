import React from 'react';
import { cn } from '@/lib/utils';
import Copy from '@/components/markdown/copy';

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
  language?: string;
  filename?: string;
}

export function CodeBlock({ className, children, language, filename }: CodeBlockProps) {
  // 提取语言类名
  const languageClass = language ? `language-${language}` : '';
  
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
        <pre className={cn(
          'overflow-x-auto p-4 text-sm leading-relaxed',
          languageClass,
          className
        )}>
          {children}
        </pre>
        
        {/* 复制按钮 */}
        <div className="absolute right-3 top-3">
          <Copy 
            value={React.isValidElement(children) ? children.props.children : String(children)}
            className="h-7 w-7 rounded-md border bg-background p-1 hover:bg-accent hover:text-accent-foreground"
          />
        </div>
      </div>
    </div>
  );
}

// 导出代码块组件
export const codeBlockComponents = {
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn('overflow-x-auto', className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // 从className中提取语言信息
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : undefined;
    
    // 从props中提取文件名信息
    const filename = props['data-filename'] as string | undefined;
    
    return (
      <CodeBlock language={language} filename={filename} className={className}>
        {props.children}
      </CodeBlock>
    );
  },
};