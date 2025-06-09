import { FC, memo, ReactNode } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMemo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 组件属性类型定义
interface ComponentProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

// 自定义组件类型
interface CustomComponents {
  [key: string]: FC<ComponentProps>;
}

interface MarkdownRendererProps {
  source: MDXRemoteSerializeResult;
  components?: CustomComponents;
}

// 默认代码块组件
const CodeBlock: FC<CodeBlockProps> = memo(({ className, children }) => {
  const language = className ? className.replace('language-', '') : 'text';
  
  return (
    <SyntaxHighlighter
      language={language}
      style={materialDark}
      PreTag="div"
    >
      {children || ''}
    </SyntaxHighlighter>
  );
});

CodeBlock.displayName = 'CodeBlock';

// 基础Markdown组件映射
const baseComponents: CustomComponents = {
  code: CodeBlock,
  // 表格组件
  table: ({ children }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="m-0 border-t border-border p-0 even:bg-muted">{children}</tr>
  ),
  tbody: ({ children }) => (
    <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
  ),
  thead: ({ children }) => (
    <thead>{children}</thead>
  ),
};

export const MarkdownRenderer: FC<MarkdownRendererProps> = memo(({ source, components = {} }) => {
  // 合并自定义组件和基础组件
  const mergedComponents = useMemo(
    () => ({
      ...baseComponents,
      ...components,
    }),
    [components]
  );

  return (
    <div className="markdown-content">
      <MDXRemote
        {...source}
        components={mergedComponents}
      />
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;