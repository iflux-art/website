'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const MDXTableComponents = {
  // 表格容器
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <table
      className={cn(
        'my-6 w-full border-collapse rounded-lg border border-border bg-card text-card-foreground shadow-sm dark:shadow-none overflow-x-auto scrollbar-thin scrollbar-thumb-border',
        className
      )}
      {...props}
    />
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
