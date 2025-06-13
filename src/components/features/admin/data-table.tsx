import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/cards/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface TableColumn<T extends object> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableAction<T extends object> {
  label: string;
  onClick: (record: T, index: number) => void;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (record: T) => boolean;
}

interface DataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyText?: string;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

export function DataTable<T extends object>({
  title,
  data,
  columns,
  actions,
  loading = false,
  emptyText = '暂无数据',
  pagination,
}: DataTableProps<T>) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left font-medium text-sm ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="px-4 py-3 text-center font-medium text-sm">操作</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      加载中...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                data.map((record, recordIndex) => (
                  <tr key={recordIndex} className="border-b hover:bg-muted/50">
                    {columns.map((column, columnIndex) => {
                      return (
                        <td
                          key={columnIndex}
                          className={`px-4 py-3 text-sm ${
                            column.align === 'center'
                              ? 'text-center'
                              : column.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {column.render
                            ? column.render(record[column.key], record, recordIndex)
                            : String(record[column.key])}
                        </td>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {actions.map((action, actionIndex) => {
                            const IconComponent = action.icon;
                            const isDisabled = action.disabled?.(record) || false;
                            return (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'outline'}
                                size="sm"
                                onClick={() => action.onClick(record, recordIndex)}
                                disabled={isDisabled}
                                className="flex items-center gap-1"
                              >
                                {IconComponent && <IconComponent className="h-3 w-3" />}
                                {action.label}
                              </Button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {pagination && pagination.total > pagination.pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">共 {pagination.total} 条记录</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
              >
                上一页
              </Button>
              <span className="text-sm">
                第 {pagination.current} 页，共 {Math.ceil(pagination.total / pagination.pageSize)}{' '}
                页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current + 1)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
