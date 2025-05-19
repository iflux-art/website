import React from 'react';
import { cn } from '@/lib/utils';
import { TypographyProps, HeadingProps } from './mdx-typography.types';

/**
 * 主要排版容器
 * 为MDX内容提供统一的排版样式
 */
export function MDXTypography({ className, children }: TypographyProps) {
  return (
    <div className={cn(
      'prose dark:prose-invert prose-headings:scroll-m-20 max-w-none',
      // 基础文本样式
      'prose-p:text-base prose-p:leading-7 prose-p:my-6',
      // 标题样式
      'prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-4',
      'prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:border-b prose-h2:pb-2 prose-h2:mt-10 prose-h2:mb-4',
      'prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-3',
      'prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-8 prose-h4:mb-3',
      // 列表样式
      'prose-ul:my-6 prose-ul:list-disc prose-ul:pl-10',
      'prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-10',
      'prose-li:my-2',
      // 代码块样式
      'prose-code:rounded prose-code:bg-muted prose-code:p-1 prose-code:text-sm prose-code:font-mono',
      'prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted prose-pre:p-4',
      // 引用块样式
      'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-6 prose-blockquote:italic',
      // 表格样式
      'prose-table:w-full prose-table:border-collapse',
      'prose-th:border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left',
      'prose-td:border prose-td:px-4 prose-td:py-2',
      // 图片样式
      'prose-img:rounded-md prose-img:border prose-img:my-8',
      // 链接样式
      'prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:text-primary/80',
      // 水平线样式
      'prose-hr:my-8 prose-hr:border-muted-foreground/20',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * 标题组件
 */
export function MDXHeading1({ className, children, id, ...props }: HeadingProps) {
  return <h1 id={id} className={cn('text-4xl font-bold tracking-tight mt-8 mb-4 scroll-m-20', className)} {...props}>{children}</h1>;
}

export function MDXHeading2({ className, children, id, ...props }: HeadingProps) {
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
  return <h2 id={headingId} className={cn('text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b scroll-m-20', className)} {...props}>{children}</h2>;
}

export function MDXHeading3({ className, children, id, ...props }: HeadingProps) {
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
  return <h3 id={headingId} className={cn('text-xl font-semibold tracking-tight mt-8 mb-3 scroll-m-20', className)} {...props}>{children}</h3>;
}

export function MDXHeading4({ className, children, id, ...props }: HeadingProps) {
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
  return <h4 id={headingId} className={cn('text-lg font-semibold tracking-tight mt-8 mb-3 scroll-m-20', className)} {...props}>{children}</h4>;
}

/**
 * 段落组件
 */
export function MDXParagraph({ className, children }: TypographyProps) {
  return <p className={cn('leading-7 my-6', className)}>{children}</p>;
}

/**
 * 代码块组件
 */
export function MDXCode({ className, children }: TypographyProps) {
  return <code className={cn('rounded bg-muted px-1.5 py-0.5 text-sm font-mono', className)}>{children}</code>;
}

/**
 * 预格式化文本块组件
 */
export function MDXPre({ className, children }: TypographyProps) {
  return (
    <pre className={cn('mt-6 mb-6 rounded-lg border bg-muted p-4 overflow-x-auto', className)}>
      {children}
    </pre>
  );
}

/**
 * 引用块组件
 */
export function MDXBlockquote({ className, children }: TypographyProps) {
  return (
    <blockquote className={cn('mt-6 mb-6 border-l-4 border-muted-foreground/30 pl-6 italic', className)}>
      {children}
    </blockquote>
  );
}

/**
 * 列表组件
 */
export function MDXUnorderedList({ className, children }: TypographyProps) {
  return <ul className={cn('my-6 list-disc pl-10', className)}>{children}</ul>;
}

export function MDXOrderedList({ className, children }: TypographyProps) {
  return <ol className={cn('my-6 list-decimal pl-10', className)}>{children}</ol>;
}

export function MDXListItem({ className, children }: TypographyProps) {
  return <li className={cn('my-2', className)}>{children}</li>;
}

/**
 * 表格组件
 */
export function MDXTable({ className, children }: TypographyProps) {
  return <table className={cn('w-full border-collapse my-8', className)}>{children}</table>;
}

export function MDXTableHead({ className, children }: TypographyProps) {
  return <thead className={cn('bg-muted', className)}>{children}</thead>;
}

export function MDXTableBody({ className, children }: TypographyProps) {
  return <tbody className={cn('', className)}>{children}</tbody>;
}

export function MDXTableRow({ className, children }: TypographyProps) {
  return <tr className={cn('', className)}>{children}</tr>;
}

export function MDXTableHeader({ className, children }: TypographyProps) {
  return <th className={cn('border px-4 py-2 text-left', className)}>{children}</th>;
}

export function MDXTableCell({ className, children }: TypographyProps) {
  return <td className={cn('border px-4 py-2', className)}>{children}</td>;
}

/**
 * 图片容器
 */
export function MDXImageContainer({ className, children }: TypographyProps) {
  return <div className={cn('my-8', className)}>{children}</div>;
}

/**
 * 水平线
 */
export function MDXHorizontalRule({ className }: Omit<TypographyProps, 'children'>) {
  return <hr className={cn('my-8 border-muted-foreground/20', className)} />;
}

/**
 * 导出所有MDX排版组件
 */
export const mdxTypographyComponents = {
  h1: MDXHeading1,
  h2: MDXHeading2,
  h3: MDXHeading3,
  h4: MDXHeading4,
  p: MDXParagraph,
  code: MDXCode,
  pre: MDXPre,
  blockquote: MDXBlockquote,
  ul: MDXUnorderedList,
  ol: MDXOrderedList,
  li: MDXListItem,
  table: MDXTable,
  thead: MDXTableHead,
  tbody: MDXTableBody,
  tr: MDXTableRow,
  th: MDXTableHeader,
  td: MDXTableCell,
  hr: MDXHorizontalRule,
};
