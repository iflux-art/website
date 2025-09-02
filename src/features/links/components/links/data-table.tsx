import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  DataTableColumn,
  DataTableAction,
  DataTablePagination,
  DataTableProps,
} from "@/types/props-types"; // 导入通用类型

// 获取对齐类名函数
function getAlignClass(align?: "left" | "center" | "right"): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

// 表格头部组件
interface TableHeaderProps<T> {
  columns: DataTableColumn<T>[];
  hasActions: boolean;
}

const TableHeader = <T extends object>({ columns, hasActions }: TableHeaderProps<T>) => (
  <thead>
    <tr className="border-b bg-muted/50">
      {columns.map((column, _index) => (
        <th
          key={String(column.key)}
          className={`px-4 py-3 text-left text-sm font-medium ${getAlignClass(column.align)}`}
          style={{ width: column.width }}
        >
          {column.title}
        </th>
      ))}
      {hasActions && <th className="px-4 py-3 text-center text-sm font-medium">操作</th>}
    </tr>
  </thead>
);

// 表格单元格组件
interface TableCellProps<T> {
  column: DataTableColumn<T>;
  record: T;
  recordIndex: number;
}

const TableCell = <T extends object>({ column, record, recordIndex }: TableCellProps<T>) => (
  <td className={`px-4 py-3 text-sm ${getAlignClass(column.align)}`}>
    {column.render
      ? column.render(record[column.key], record, recordIndex)
      : String(record[column.key])}
  </td>
);

// 操作列组件
interface ActionsColumnProps<T> {
  actions: DataTableAction<T>[];
  record: T;
  recordIndex: number;
}

const ActionsColumn = <T extends object>({
  actions,
  record,
  recordIndex,
}: ActionsColumnProps<T>) => (
  <td className="px-4 py-3 text-center">
    <div className="flex items-center justify-center gap-2">
      {actions.map((action, _actionIndex) => {
        const IconComponent = action.icon;
        const isDisabled = action.disabled?.(record) ?? false;
        return (
          <Button
            key={action.label}
            variant={action.variant ?? "outline"}
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
);

// 表格行组件
interface TableRowProps<T> {
  record: T;
  recordIndex: number;
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
}

const TableRow = <T extends object>({
  record,
  recordIndex,
  columns,
  actions,
}: TableRowProps<T>) => {
  const recordKey =
    "id" in record && typeof record.id === "string" ? record.id : `record-${recordIndex}`;

  return (
    <tr key={recordKey} className="border-b hover:bg-muted/50">
      {columns.map((column, _columnIndex) => (
        <TableCell
          key={String(column.key)}
          column={column}
          record={record}
          recordIndex={recordIndex}
        />
      ))}
      {actions && actions.length > 0 && (
        <ActionsColumn actions={actions} record={record} recordIndex={recordIndex} />
      )}
    </tr>
  );
};

// 分页组件
interface PaginationProps {
  pagination: DataTablePagination;
}

const Pagination = ({ pagination }: PaginationProps) => {
  if (pagination.total <= pagination.pageSize) {
    return null;
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
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
          第 {pagination.current} 页，共 {totalPages} 页
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pagination.onChange(pagination.current + 1)}
          disabled={pagination.current >= totalPages}
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

export const DataTable = <T extends object>({
  title,
  data,
  columns,
  actions,
  pagination,
}: DataTableProps<T>) => {
  const hasActions = Boolean(actions && actions.length > 0);

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
            <TableHeader columns={columns} hasActions={hasActions} />
            <tbody>
              {data.length === 0
                ? null
                : data.map((record, recordIndex) => (
                    <TableRow
                      key={
                        "id" in record && typeof record.id === "string"
                          ? record.id
                          : `record-${recordIndex}`
                      }
                      record={record}
                      recordIndex={recordIndex}
                      columns={columns}
                      actions={actions}
                    />
                  ))}
            </tbody>
          </table>
        </div>
        {pagination && <Pagination pagination={pagination} />}
      </CardContent>
    </Card>
  );
};
