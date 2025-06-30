/**
 * MDX 配置中心
 * 统一管理所有 MDX 相关配置、类型和工具函数
 * @module config/mdx
 */

// 导出所有基础类型
export type { MDXOptions, MDXComponents } from '@/types';

// 导出样式相关配置
export { typographyConfig, MDXStyles } from './styles';

// 导出组件相关配置
export {
  MDXComponentsMapping,
  defaultComponentProps,
  useMDXComponents,
  type MDXComponentContextType,
} from './components';

// 导入核心配置
import { typographyConfig } from './styles';
import { MDXComponentsMapping } from './components';

// === 直接补充 parser.ts 的核心常量 ===
import type { MDXOptions } from '@/types';

export const frontmatterConfig = {
  required: ['title'] as const,
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
  validate: {
    title: (v: unknown): v is string => typeof v === 'string' && v.length > 0,
    date: (v: unknown): v is string | Date =>
      v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))),
    tags: (v: unknown): v is string[] => Array.isArray(v) && v.every(t => typeof t === 'string'),
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
 * 默认配置对象
 * 包含所有 MDX 相关的配置项
 */
const MDXConfig = {
  options: MDXBaseOptions,
  typography: typographyConfig,
  components: MDXComponentsMapping,
} as const;

export default MDXConfig;

/**
 * MDX 环境配置
 * 包含运行时环境信息和本地化设置
 */
export const MDX_ENV = {
  /** 是否为开发环境 */
  isDevelopment: process.env.NODE_ENV === 'development',
  /** 是否为生产环境 */
  isProduction: process.env.NODE_ENV === 'production',
  /** 默认语言环境 */
  defaultLocale: 'zh-CN',
  /** 支持的语言列表 */
  supportedLocales: ['zh-CN', 'en-US'] as const,
} as const;

/**
 * MDX 验证工具集
 * 提供 frontmatter 和内容的验证功能
 */
export const MDXValidators = {
  /**
   * 验证必需的 frontmatter 字段是否存在
   * @param frontmatter - 要验证的 frontmatter 对象
   * @returns 是否包含所有必需字段
   */
  validateRequired: (frontmatter: Record<string, unknown>) => {
    return frontmatterConfig.required.every((field: string) => field in frontmatter);
  },

  /**
   * 验证 frontmatter 字段类型是否正确
   * @param frontmatter - 要验证的 frontmatter 对象
   * @returns 字段类型是否都符合要求
   */
  validateFieldTypes: (frontmatter: Record<string, unknown>) => {
    const typeChecks = {
      title: (v: unknown): v is string => typeof v === 'string',
      date: (v: unknown): v is string | Date =>
        v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))),
      tags: (v: unknown): v is string[] => Array.isArray(v) && v.every(t => typeof t === 'string'),
      draft: (v: unknown): v is boolean => typeof v === 'boolean',
    } as const;

    return Object.entries(typeChecks).every(([field, check]: [string, (v: unknown) => boolean]) => {
      return !(field in frontmatter) || check(frontmatter[field]);
    });
  },
};

/**
 * MDX 工具函数集
 * 提供常用的 MDX 内容处理工具
 */
export const MDXUtils = {
  /**
   * 格式化日期为本地化字符串
   * @param date - 要格式化的日期
   * @returns 格式化后的日期字符串
   */
  formatDate: (date: string | Date) => {
    return new Date(date).toLocaleDateString(MDX_ENV.defaultLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * 计算内容的预计阅读时间
   * @param content - 要计算的文本内容
   * @returns 预计阅读时间（分钟）
   */
  calculateReadingTime: (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
};
