import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedTableProps {
  className?: string;
  children: React.ReactNode;
}

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

export function EnhancedTableHead({ className, children }: EnhancedTableProps) {
  return (
    <thead className={cn(
      'bg-muted/50 text-muted-foreground',
      className
    )}>
      {children}
    </thead>
  );
}

export function EnhancedTableBody({ className, children }: EnhancedTableProps) {
  return (
    <tbody className={cn(
      'divide-y',
      className
    )}>
      {children}
    </tbody>
  );
}

export function EnhancedTableRow({ className, children }: EnhancedTableProps) {
  return (
    <tr className={cn(
      'transition-colors hover:bg-muted/20',
      className
    )}>
      {children}
    </tr>
  );
}

export function EnhancedTableHeader({ className, children }: EnhancedTableProps) {
  return (
    <th className={cn(
      'px-4 py-3 text-left font-medium',
      className
    )}>
      {children}
    </th>
  );
}

export function EnhancedTableCell({ className, children }: EnhancedTableProps) {
  return (
    <td className={cn(
      'px-4 py-3',
      className
    )}>
      {children}
    </td>
  );
}

// 导出增强表格组件
export const enhancedTableComponents = {
  table: EnhancedTable,
  thead: EnhancedTableHead,
  tbody: EnhancedTableBody,
  tr: EnhancedTableRow,
  th: EnhancedTableHeader,
  td: EnhancedTableCell,
};