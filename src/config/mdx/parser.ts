/**
 * MDX 解析器配置
 * 统一管理所有 MDX 解析相关设置
 */

import type { MDXOptions, BaseFrontmatter } from './types';

/**
 * Front Matter 字段配置
 */
export const frontmatterConfig = {
  // 必需字段
  required: ['title'] as const,

  // 可选字段
  optional: [
    'description',
    'date',
    'tags',
    'draft',
    'category',
    'author',
    'image',
    'slug',
    'lastModified',
    'wordCount',
    'seo',
  ] as const,

  // 字段验证规则
  validate: {
    title: (v: unknown): v is string => typeof v === 'string' && v.length > 0,
    date: (v: unknown): v is string | Date =>
      v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))),
    tags: (v: unknown): v is string[] => Array.isArray(v) && v.every((t) => typeof t === 'string'),
    draft: (v: unknown): v is boolean => typeof v === 'boolean',
    category: (v: unknown): v is string => typeof v === 'string',
    author: (v: unknown): v is string => typeof v === 'string',
    image: (v: unknown): v is string => typeof v === 'string',
    slug: (v: unknown): v is string => typeof v === 'string',
    lastModified: (v: unknown): v is string | Date =>
      v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))),
    wordCount: (v: unknown): v is number => typeof v === 'number' && v >= 0,
    seo: (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null,
  },
} as const;

/**
 * Front Matter 字段类型
 */
export type FrontmatterField =
  | (typeof frontmatterConfig.required)[number]
  | (typeof frontmatterConfig.optional)[number];

/**
 * MDX 基础选项配置
 */
export const MDXBaseOptions: MDXOptions = {
  compile: {
    parseFrontmatter: true,
    development: process.env.NODE_ENV === 'development',
  },
  image: {
    defaultWidth: 1200,
    defaultHeight: 800,
    priority: false,
    placeholder: 'empty',
    domains: [],
  },
  link: {
    openExternalInNewTab: true,
    externalIcon: true,
    underline: true,
  },
  code: {
    showLineNumbers: true,
    defaultLanguage: 'typescript',
    theme: 'github-dark',
    wrap: true,
  },
};

/**
 * MDX 解析器配置
 */
export const MDXParserConfig = {
  // 支持的文件扩展名
  extensions: ['.mdx', '.md'] as const,

  // 开发模式设置
  development: process.env.NODE_ENV === 'development',

  // 解析器选项
  options: {
    format: 'mdx' as const,
    development: process.env.NODE_ENV === 'development',
    parseFrontmatter: true,

    // MDX 特定选项
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: 'mdx' as const,
    },
  },

  // Front Matter 配置
  frontmatter: frontmatterConfig,
};

/**
 * MDX 内容解析函数类型
 */
export type MDXParseResult<T extends BaseFrontmatter = BaseFrontmatter> = {
  frontmatter: T;
  content: string;
};

/**
 * MDX 内容验证选项
 */
export type MDXValidateOptions = {
  // 是否要求必需字段
  requireRequired?: boolean;
  // 是否允许额外字段
  allowExtra?: boolean;
  // 自定义验证函数
  validate?: (frontmatter: BaseFrontmatter) => boolean | string;
};
