/**
 * MDX 组件类型定义
 * 包含MDX组件相关的类型定义
 */

import type { BaseComponentProps } from "@/types/base-types";

// MDXImgProps
export interface MDXImgProps extends React.ComponentPropsWithoutRef<"img"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// MDXLinkProps
export interface MDXLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  openInNewTab?: boolean;
  showExternalIcon?: boolean;
}

// Blockquote
export type BlockquoteVariant = "default" | "info" | "elegant";
export interface MDXBlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  citation?: string;
  author?: string;
  variant?: BlockquoteVariant;
}

// Callout
export type CalloutType = "info" | "success" | "warning" | "error";
export interface MDXCalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Card
export interface MDXCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

// Video
export interface MDXVideoProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

/** 代码块组件属性 */
export interface CodeBlockProps extends BaseComponentProps {
  /** 文件名 */
  filename?: string;
  /** 代码语言 */
  language?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
}

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

/** 引用块组件属性 */
export interface MDXBlockquoteProps extends BaseComponentProps {
  /** 引用来源 */
  cite?: string;
  /** 引用类型 */
  type?: "default" | "warning" | "error" | "info" | "success";
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认展开状态 */
  defaultOpen?: boolean;
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

/** 代码高亮组件属性 */
export interface MDXCodeHighlightProps extends BaseComponentProps {
  /** 代码语言 */
  language?: string;
  /** 代码主题 */
  theme?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 高亮行号 */
  highlightLines?: number[];
  /** 是否可复制 */
  copyable?: boolean;
  /** 文件名 */
  filename?: string;
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
