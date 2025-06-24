/**
 * MDX 核心类型定义
 * 统一管理所有 MDX 相关类型
 */
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentType, ReactNode } from 'react';
import type { ImageProps } from 'next/image';
import type { BaseComponentProps, BaseFrontmatter } from './common';

// ==================== MDX 特定类型 ====================

/** 自定义组件属性 */
export interface CustomComponentProps extends BaseComponentProps {
  /**
   * 自定义data属性
   * @remarks 使用Record类型避免索引签名冲突
   */
  dataAttributes?: Record<`data-${string}`, unknown>;
}

/** MDX Frontmatter 扩展 */
export interface MDXFrontmatter extends BaseFrontmatter {
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 目录层级 */
  tocDepth?: number;
  /** 是否显示目录 */
  showToc?: boolean;
  /** 自定义样式类 */
  customClass?: string;
}

/** MDX 内容类型 */
export interface MDXContent {
  /** MDX 源代码 */
  source: string;
  /** frontmatter 数据 */
  frontmatter?: MDXFrontmatter;
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

/** MDX 组件映射类型 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MDXComponents = Record<string, ComponentType<any>>;

/** MDX配置选项 */
export interface MDXOptions {
  /** 组件映射配置 */
  components?: MDXComponents;
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

// ==================== MDX 组件类型 ====================

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

// ==================== 类型保护函数 ====================

/** 检查值是否为有效的 MDX 内容 */
export const isMDXContent = (value: unknown): value is MDXContent => {
  if (!value || typeof value !== 'object') return false;
  const content = value as Partial<MDXContent>;
  return typeof content.source === 'string';
};
