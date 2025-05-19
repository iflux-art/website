import React from 'react';
import { cn } from '@/lib/utils';
import { 
  EnhancedTableProps, 
  EnhancedTableHeadProps, 
  EnhancedTableBodyProps, 
  EnhancedTableRowProps, 
  EnhancedTableHeaderProps, 
  EnhancedTableCellProps 
} from './enhanced-table.types';

/**
 * 增强表格组件
 * 提供美观的表格样式，适用于文档和博客内容
 */
export function EnhancedTable({ className, children }: EnhancedTableProps) {
  return (
    <div className="my-8 w-full overflow-auto rounded-lg border">
      <table className={cn(
        'w-full border-collapse text-sm',
        className
      )}>
        {children}
      </table>
    </div>
  );
}

/**
 * 增强表格头部组件
 */
export function EnhancedTableHead({ className, children }: EnhancedTableHeadProps) {
  return (
    <thead className={cn(
      'bg-muted/50 text-muted-foreground',
      className
    )}>
      {children}
    </thead>
  );
}

/**
 * 增强表格主体组件
 */
export function EnhancedTableBody({ className, children }: EnhancedTableBodyProps) {
  return (
    <tbody className={cn(
      'divide-y',
      className
    )}>
      {children}
    </tbody>
  );
}

/**
 * 增强表格行组件
 */
export function EnhancedTableRow({ className, children }: EnhancedTableRowProps) {
  return (
    <tr className={cn(
      'transition-colors hover:bg-muted/20',
      className
    )}>
      {children}
    </tr>
  );
}

/**
 * 增强表格标题单元格组件
 */
export function EnhancedTableHeader({ className, children }: EnhancedTableHeaderProps) {
  return (
    <th className={cn(
      'px-4 py-3 text-left font-medium',
      className
    )}>
      {children}
    </th>
  );
}

/**
 * 增强表格数据单元格组件
 */
export function EnhancedTableCell({ className, children }: EnhancedTableCellProps) {
  return (
    <td className={cn(
      'px-4 py-3',
      className
    )}>
      {children}
    </td>
  );
}

/**
 * 导出增强表格组件集合
 * 用于在MDX中使用
 */
export const enhancedTableComponents = {
  table: EnhancedTable,
  thead: EnhancedTableHead,
  tbody: EnhancedTableBody,
  tr: EnhancedTableRow,
  th: EnhancedTableHeader,
  td: EnhancedTableCell,
};
