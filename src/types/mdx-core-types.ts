/**
 * MDX 核心类型定义
 * 包含MDX基础类型和配置
 */

import type { ComponentType } from "react";
import type { BaseComponentProps } from "@/types/base-types";
import type { BaseFrontmatter } from "@/types/data-types";

// ==================== MDX 核心类型 ====================

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
}

/** MDX渲染器属性 */
export interface MDXRendererProps {
  /** MDX内容 */
  content: string;
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
    placeholder: "blur" | "empty";
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
    /** 是否自动换行 */
    wrap: boolean;
  };
}

// ==================== MDX 工具类型 ====================

/** MDX样式配置类型 */
export interface MDXStyleConfig {
  prose: string;
  table: {
    wrapper: string;
  };
  image: {
    wrapper: string;
    img: string;
    caption: string;
    group?: {
      wrapper: string;
      item: string;
    };
    zoom?: {
      overlay: string;
      content: string;
      img: string;
    };
  };
  link: {
    base: string;
    external?: string;
    icon?: string;
    underline?: string;
  };
  codeBlock: string;
  codeInline?: {
    base: string;
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
}

/** 排版配置类型 */
export interface TypographyConfig {
  css: {
    [key: string]: string | number | Record<string, string | number>;
  };
}

// ==================== MDX 工具函数 ====================

/** MDX内容类型守卫 */
export const isMDXContent = (value: unknown): value is MDXContent => {
  return (
    typeof value === "object" &&
    value !== null &&
    "source" in value &&
    typeof (value as MDXContent).source === "string"
  );
};
