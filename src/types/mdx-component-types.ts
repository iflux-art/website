/**
 * MDX 组件类型定义
 * 包含MDX组件相关的类型定义
 */

import type { BaseComponentProps } from "@/types/base-types";
import type React from "react";

/** 列表类型 */
export type ListType = "unordered" | "ordered" | "checklist" | "stepper";

/** 列表图标类型 */
export type ListIconType = "bullet" | "check" | "chevron" | "circle" | "none";

/** 列表通用样式属性 */
export interface MDXListStyleProps {
  /** 图标类型 */
  icon?: ListIconType;
  /** 图标颜色 */
  iconColor?: string;
  /** 间距大小 */
  gap?: "sm" | "md" | "lg";
  /** 是否为嵌套列表 */
  nested?: boolean;
  /** 自定义类名 */
  className?: string;
}

/** 列表组件属性 */
export type MDXListProps =
  | (MDXListStyleProps &
      React.HTMLAttributes<HTMLUListElement> & {
        /** 列表类型 */
        type?: ListType;
      })
  | (MDXListStyleProps &
      React.OlHTMLAttributes<HTMLOListElement> & {
        type: "ordered";
      });

/** 列表项组件属性 */
export interface MDXListItemProps
  extends MDXListStyleProps,
    React.HTMLAttributes<HTMLLIElement> {
  /** 列表项序号 */
  step?: number;
  /** 列表类型 */
  type?: ListType;
  /** 是否为嵌套列表项 */
  nested?: boolean;
}

/** 表格组件属性 */
export interface MDXTableProps extends BaseComponentProps {
  /** 表格标题 */
  caption?: string;
  /** 是否紧凑显示 */
  compact?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否可排序 */
  sortable?: boolean;
}

/** 表格行组件属性 */
export interface MDXTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /** 是否为表头行 */
  header?: boolean;
  /** 行数据 */
  data?: Record<string, unknown>;
}

/** 表格单元格组件属性 */
export interface MDXTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  /** 是否为表头单元格 */
  header?: boolean;
  /** 单元格对齐方式 */
  align?: "left" | "center" | "right";
  /** 单元格宽度 */
  width?: string | number;
}

/** 数学公式组件属性 */
export interface MDXMathProps extends BaseComponentProps {
  /** 公式内容 */
  children: string;
  /** 公式类型 */
  type?: "inline" | "block";
  /** 是否显示编号 */
  numbered?: boolean;
}

/** 图表组件属性 */
export interface MDXChartProps extends BaseComponentProps {
  /** 图表类型 */
  type: "line" | "bar" | "pie" | "scatter";
  /** 图表数据 */
  data: Record<string, unknown>[];
  /** 图表配置 */
  options?: Record<string, unknown>;
  /** 图表高度 */
  height?: number;
  /** 图表宽度 */
  width?: number;
}
