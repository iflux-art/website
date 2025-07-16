import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "packages/src/ui/components/shared-ui/card";
import { Button } from "packages/src/ui/components/shared-ui/button";

// 内联 DataTableProps 类型定义
export interface DataTableColumn<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (record: T, index: number) => void;
  disabled?: (record: T) => boolean;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export interface DataTablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  pagination?: DataTablePagination;
}

export function DataTable<T extends object>({
  title,
  data,
  columns,
  actions,
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
                    className={`px-4 py-3 text-left text-sm font-medium ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    操作
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0
                ? null
                : data.map((record, recordIndex) => (
                    <tr
                      key={recordIndex}
                      className="border-b hover:bg-muted/50"
                    >
                      {columns.map((column, columnIndex) => {
                        return (
                          <td
                            key={columnIndex}
                            className={`px-4 py-3 text-sm ${
                              column.align === "center"
                                ? "text-center"
                                : column.align === "right"
                                  ? "text-right"
                                  : "text-left"
                            }`}
                          >
                            {column.render
                              ? column.render(
                                  record[column.key],
                                  record,
                                  recordIndex,
                                )
                              : String(record[column.key])}
                          </td>
                        );
                      })}
                      {actions && actions.length > 0 && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {actions.map((action, actionIndex) => {
                              const IconComponent = action.icon;
                              const isDisabled =
                                action.disabled?.(record) || false;
                              return (
                                <Button
                                  key={actionIndex}
                                  variant={action.variant || "outline"}
                                  size="sm"
                                  onClick={() =>
                                    action.onClick(record, recordIndex)
                                  }
                                  disabled={isDisabled}
                                  className="flex items-center gap-1"
                                >
                                  {IconComponent && (
                                    <IconComponent className="h-3 w-3" />
                                  )}
                                  {action.label}
                                </Button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {pagination && pagination.total > pagination.pageSize && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-muted-foreground">
              共 {pagination.total} 条记录
            </div>
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
                第 {pagination.current} 页，共{" "}
                {Math.ceil(pagination.total / pagination.pageSize)} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current + 1)}
                disabled={
                  pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
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
