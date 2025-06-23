/**
 * MDX 配置中心
 * 统一管理所有 MDX 相关配置、类型和工具函数
 * @module config/mdx
 */

// 导出所有基础类型
export * from './types';

// 导出样式相关配置
export { typographyConfig, MDXStyles } from './styles';

// 导出解析器配置和类型
export {
  MDXBaseOptions,
  MDXParserConfig,
  frontmatterConfig,
  type FrontmatterField,
  type MDXParseResult,
  type MDXValidateOptions,
} from './parser';

// 导出组件相关配置
export {
  MDXComponentsMapping,
  defaultComponentProps,
  MDXComponentContext,
  useMDXComponents,
  type MDXComponentContextType,
} from './components';

// 导入核心配置
import { MDXBaseOptions, frontmatterConfig } from './parser';
import { typographyConfig } from './styles';
import { MDXComponentsMapping } from './components';

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
    return frontmatterConfig.required.every((field) => field in frontmatter);
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
      tags: (v: unknown): v is string[] =>
        Array.isArray(v) && v.every((t) => typeof t === 'string'),
      draft: (v: unknown): v is boolean => typeof v === 'boolean',
    } as const;

    return Object.entries(typeChecks).every(([field, check]) => {
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
