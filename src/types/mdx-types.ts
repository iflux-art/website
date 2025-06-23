/**
 * MDX 核心类型定义
 *
 * 该文件只包含 MDX 核心类型，包括：
 * - Frontmatter 相关类型
 * - MDX 内容和解析结果类型
 * - 配置和选项类型
 */
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentType, ReactNode } from 'react';
import type { ImageProps } from 'next/image';

// ==================== Base Types ====================

/** 基础组件属性 */
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/** 自定义组件属性 */
export interface CustomComponentProps extends BaseComponentProps {
  /**
   * 自定义data属性
   * @remarks 使用Record类型避免索引签名冲突
   */
  dataAttributes?: Record<`data-${string}`, unknown>;
}

// ==================== Frontmatter Types ====================

/** 基础 frontmatter 值类型 */
type PrimitiveFrontmatterValue = string | number | boolean | null;
/** 数组 frontmatter 值类型 */
type ArrayFrontmatterValue = string[] | number[];
/** 日期 frontmatter 值类型 */
type DateFrontmatterValue = Date;
/** 组合 frontmatter 值类型 */
export type FrontmatterValue =
  | PrimitiveFrontmatterValue
  | ArrayFrontmatterValue
  | DateFrontmatterValue;

/** MDX 内容类型 */
export interface MDXContent {
  /** MDX 源代码 */
  source: string;
  /** frontmatter 数据 */
  frontmatter?: BaseFrontmatter;
  /** 编译后的 MDX 结果 */
  compiled?: MDXRemoteSerializeResult;
}

/** MDX渲染器属性 */
export interface MDXRendererProps {
  /** MDX内容 */
  content: MDXRemoteSerializeResult;
  /** MDX配置选项 */
  options?: MDXOptions;
}

/** MDX配置选项 */
export interface MDXOptions {
  /** 组件映射配置 */
  components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  /** 作用域变量 */
  scope?: Record<string, unknown>;
  /** 编译选项 */
  compile: {
    /** 是否解析 frontmatter */
    parseFrontmatter: boolean;
    /** 是否为开发模式 */
    development: boolean;
  };
  /** 图片相关配置 */
  image: {
    /** 默认宽度 */
    defaultWidth: number;
    /** 默认高度 */
    defaultHeight: number;
    /** 是否优先加载 */
    priority: boolean;
    /** 占位符类型 */
    placeholder: 'blur' | 'empty';
    /** 允许的图片域名 */
    domains: string[];
  };
  /** 链接配置 */
  link: {
    /** 在新标签页打开外部链接 */
    openExternalInNewTab: boolean;
    /** 显示外部链接图标 */
    externalIcon: boolean;
    /** 显示下划线 */
    underline: boolean;
  };
  /** 代码块配置 */
  code: {
    /** 显示行号 */
    showLineNumbers: boolean;
    /** 默认语言 */
    defaultLanguage: string;
    /** 主题 */
    theme: string;
    /** 是否自动换行 */
    wrap: boolean;
  };
}

// ==================== Component Types ====================

// 基础组件属性
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

// 自定义组件属性
export interface CustomComponentProps extends BaseComponentProps {
  /**
   * 自定义data属性
   * @remarks 使用Record类型避免索引签名冲突
   */
  dataAttributes?: Record<`data-${string}`, unknown>;
}

/** 图片组件属性 */
export interface MDXImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /** 图片源地址 */
  src: string;
  /** 图片描述文本 */
  alt?: string;
  /** 图片说明文字 */
  caption?: ReactNode;
  /** 是否优先加载 */
  priority?: boolean;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
}

/** 链接组件属性 */
export interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 链接地址 */
  href: string;
  /** 是否为外部链接 */
  external?: boolean;
  /** 外部链接是否在新标签页打开 */
  openInNewTab?: boolean;
}

/** 代码块组件属性 */
export interface CodeBlockProps extends BaseComponentProps {
  /** 文件名 */
  filename?: string;
  /** 代码语言 */
  language?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 高亮的行号 */
  highlightedLines?: number[];
}

/** 列表类型 */
export type ListType = 'unordered' | 'ordered' | 'checklist' | 'stepper';

/** 列表图标类型 */
export type ListIconType = 'bullet' | 'check' | 'chevron' | 'circle' | 'none';

/** 列表通用样式属性 */
export interface MDXListStyleProps {
  /** 图标类型 */
  icon?: ListIconType;
  /** 图标颜色 */
  iconColor?: string;
  /** 间距大小 */
  gap?: 'sm' | 'md' | 'lg';
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
        type: 'ordered';
      });

/** 列表项组件属性 */
export interface MDXListItemProps extends MDXListStyleProps, React.HTMLAttributes<HTMLLIElement> {
  /** 列表项序号 */
  step?: number;
  /** 列表类型 */
  type?: ListType;
  /** 是否为嵌套列表项 */
  nested?: boolean;
}

/** MDX样式配置 */
export interface MDXStyleConfig {
  prose: string;
  table: {
    wrapper: string;
  };
  image: {
    wrapper: string;
    img: string;
    caption: string;
    group: {
      wrapper: string;
      item: string;
    };
    zoom: {
      overlay: string;
      content: string;
      img: string;
    };
  };
  link: {
    base: string;
    external: string;
    icon: string;
    underline: string;
  };
  codeBlock: string;
  codeInline: {
    base: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
}

// ==================== Core MDX Types ====================

/** Frontmatter 基础类型 */
export interface BaseFrontmatter {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description?: string;
  /** 发布日期 */
  date?: string | Date;
  /** 标签列表 */
  tags?: string[];
  /** 是否为草稿 */
  draft?: boolean;
  /** 分类 */
  category?: string;
  /** 作者 */
  author?: string;
  /** 封面图片 */
  image?: string;
  /** 文章别名 */
  slug?: string;
  /** 最后修改时间 */
  lastModified?: string | Date;
  /** 字数统计 */
  wordCount?: number;
  /** SEO 相关字段 */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// ==================== Component Types ====================

// 导出类型保护函数
// 类型保护函数
export const isFrontmatterValue = (value: unknown): value is FrontmatterValue => {
  if (value === null) return true;
  if (['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (value instanceof Date) return true;
  if (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string' || typeof item === 'number')
  )
    return true;
  return false;
};

export const isMDXContent = (value: unknown): value is MDXContent => {
  if (!value || typeof value !== 'object') return false;
  const content = value as Partial<MDXContent>;
  return typeof content.source === 'string';
};
