import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink, RefreshCw } from "lucide-react";
// 内联 TableColumn 类型定义
export interface TableColumn<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, record: T, index: number) => React.ReactNode;
}
// 内联 LinksItem 类型定义
export interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: "image" | "text";
  tags: string[];
  featured?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  visits?: number;
  isActive?: boolean;
}

export const getTableColumns = (
  getCategoryName: (categoryId: string) => string,
): TableColumn<LinksItem>[] => [
  {
    key: "icon",
    title: "图标",
    width: "44px", // 更窄
    render: (value, record, _index) => {
      const icon = record.icon;
      const iconType = record.iconType;
      const isImage = typeof icon === "string" && /^https?:\/\//.test(icon);
      return (
        <div className="mx-auto flex h-10 w-10 items-center justify-center">
          {iconType === "image" || isImage ? (
            <img src={icon} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <span className="text-sm font-bold">{icon}</span>
          )}
        </div>
      );
    },
  },
  {
    key: "title",
    title: "标题",
    width: "450px",
    render: (value, record, _index) => (
      <div>
        <div className="font-medium">{String(value)}</div>
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {record.url}
        </div>
      </div>
    ),
  },
  {
    key: "category",
    title: "分类",
    width: "120px",
    render: (value, _record, _index) =>
      value ? getCategoryName(value as string) : "-",
  },
  {
    key: "tags",
    title: "标签",
    width: "350px",
    render: (value, _record, _index) => {
      const tags = value as string[];
      if (!tags?.length) return null;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="px-2 text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="px-2 text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "featured",
    title: "状态",
    width: "100px",
    render: (value, _record, _index) =>
      (value as boolean) ? (
        <Badge variant="default" className="px-2 text-xs">
          精选
        </Badge>
      ) : (
        <Badge variant="outline" className="px-2 text-xs">
          普通
        </Badge>
      ),
  },
];

export const getTableActions = (
  onEdit: (record: LinksItem) => void,
  onDelete: (record: LinksItem) => void,
) => [
  {
    label: "访问",
    onClick: (record: LinksItem) => window.open(record.url, "_blank"),
    icon: ExternalLink,
    variant: "outline" as const,
  },
  {
    label: "编辑",
    onClick: onEdit,
    icon: Edit,
    variant: "outline" as const,
  },
  {
    label: "删除",
    onClick: onDelete,
    icon: Trash2,
    variant: "destructive" as const,
  },
];

export const getPageActions = (onAdd: () => void, onRefresh: () => void) => [
  {
    label: "添加网址",
    onClick: onAdd,
    icon: Plus,
  },
  {
    label: "刷新数据",
    onClick: onRefresh,
    icon: RefreshCw,
    variant: "outline" as const,
  },
];
