'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';

/**
 * MDX Table 组件属性
 */
interface MDXTableProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否使用条纹样式 */
  _striped?: boolean;
  /** 是否使用紧凑模式 */
  _compact?: boolean;
  /** 是否启用悬停高亮 */
  _hover?: boolean;
}

/**
 * MDX Table 组件 - 表格容器
 */
export function MDXTable({ className, _striped, _compact, _hover, ...props }: MDXTableProps) {
  return (
    <div
      className={cn(
        // 基础样式
        'my-6 w-full overflow-hidden',
        'rounded-lg border border-border',
        'bg-card text-card-foreground',
        // 阴影效果
        'shadow-sm dark:shadow-none',
        // 移动端水平滚动
        'overflow-x-auto',
        // 滚动条样式
        'scrollbar-thin scrollbar-thumb-border',
        className
      )}
      {...props}
    />
  );
}

/**
 * MDX TableContent 组件属性
 */
interface MDXTableContentProps extends HTMLAttributes<HTMLTableElement> {
  /** 是否使用条纹样式 */
  _striped?: boolean;
  /** 是否使用紧凑模式 */
  _compact?: boolean;
  /** 是否启用悬停高亮 */
  _hover?: boolean;
}

/**
 * MDX TableContent 组件 - 实际表格内容
 */
export function MDXTableContent({
  className,
  _striped = true,
  _compact = false,
  _hover = true,
  ...props
}: MDXTableContentProps) {
  return (
    <table
      className={cn(
        // 基础样式
        'w-full border-collapse',
        'text-sm',
        // 紧凑模式
        _compact ? 'table-compact' : 'table-default',
        // 条纹样式
        _striped && '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        // 悬停样式
        _hover && '[&_tbody_tr:hover]:bg-muted',
        // 单元格样式
        '[&_th]:border-b [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-medium',
        '[&_td]:border-b [&_td]:border-border [&_td]:px-4 [&_td]:py-3',
        // 表头样式
        '[&_thead_th]:whitespace-nowrap',
        '[&_thead_th:first-child]:rounded-tl-lg',
        '[&_thead_th:last-child]:rounded-tr-lg',
        // sticky 表头
        '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-inherit',
        // 最后一行去除底部边框
        '[&_tr:last-child_td]:border-0',
        // 暗色模式优化
        'dark:[&_th]:bg-muted/20',
        className
      )}
      {...props}
    />
  );
}

/**
 * MDX Table 组合组件
 */
export const MDXTableComponents = {
  // 表格容器
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <MDXTable>
      <MDXTableContent className={className} {...props} />
    </MDXTable>
  ),
  // 表头
  thead: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('text-muted-foreground', '[&_tr]:border-0', className)} {...props} />
  ),
  // 表格主体
  tbody: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn('', className)} {...props} />
  ),
  // 表格行
  tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn('transition-colors', className)} {...props} />
  ),
  // 表头单元格
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th className={cn('font-medium', className)} {...props} />
  ),
  // 数据单元格
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn('', className)} {...props} />
  ),
};
