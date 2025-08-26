/**
 * 链接管理表格配置
 *
 * 提供链接管理界面的表格列定义、操作按钮和页面操作配置。
 * 包含图标显示、标签渲染、状态显示等功能。
 *
 * @author 系统重构
 * @since 2024
 */

import { Badge } from "@/components/ui/badge";
import type { LinksItem } from "@/features/links/types";
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

// 内联 TableColumn 类型定义
export interface TableColumn<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

/**
 * 获取表格列配置
 *
 * @param getCategoryName - 根据分类 ID 获取分类名称的函数
 * @returns 表格列配置数组
 */
export const getTableColumns = (
  getCategoryName: (categoryId: string) => string
): TableColumn<LinksItem>[] => [
  {
    key: "icon",
    title: "图标",
    width: "44px", // 更窄
    render: (_value, record, _index) => {
      const { icon } = record;
      const { iconType } = record;
      const isImage = typeof icon === "string" && /^https?:\/\//.test(icon);
      return (
        <div className="mx-auto flex h-10 w-10 items-center justify-center">
          {iconType === "image" || isImage ? (
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              unoptimized
            />
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
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">{record.url}</div>
      </div>
    ),
  },
  {
    key: "category",
    title: "分类",
    width: "120px",
    render: (value, _record, _index) => (value ? getCategoryName(value as string) : "-"),
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

/**
 * 获取表格行操作配置
 *
 * @param onEdit - 编辑操作回调函数
 * @param onDelete - 删除操作回调函数
 * @returns 操作按钮配置数组
 */
export const getTableActions = (
  onEdit: (record: LinksItem) => void,
  onDelete: (record: LinksItem) => void
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

/**
 * 获取页面级操作配置
 *
 * @param onAdd - 添加操作回调函数
 * @param onRefresh - 刷新操作回调函数
 * @returns 页面操作按钮配置数组
 */
export const getPageActions = (onAdd: () => void) => [
  {
    label: "添加网址",
    onClick: onAdd,
    icon: Plus,
  },
];
