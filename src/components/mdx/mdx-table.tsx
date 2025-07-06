'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';
import { MDXStyles } from '@/config/mdx/styles';

const MDXTableComponents = {
  // 表格容器
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <table className={cn(MDXStyles.table.container, 'my-6', className)} {...props} />
  ),
  // 表头
  thead: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn(MDXStyles.table.header, className)} {...props} />
  ),
  // 表格主体
  tbody: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn('', className)} {...props} />
  ),
  // 表格行
  tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn(MDXStyles.table.row, className)} {...props} />
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

export const MDXTable = {
  ...MDXTableComponents,
};

export { MDXTableComponents };
