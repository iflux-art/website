/**
 * @file metadata.ts
 * @description Next.js 元数据配置文件
 *
 * 本文件聚合所有元数据配置，包括：
 * - 基础站点信息（标题、描述等）
 * - PWA相关配置
 * - iOS设备特定配置
 * - Windows平台特定配置
 * - 图标配置
 *
 * @usage
 * 在 layout.tsx 中使用：
 * ```typescript
 * import { metadata, viewport, splashScreens } from '@/config/metadata';
 *
 * export { metadata, viewport };
 * ```
 */

export {
  generateMetadata,
  generateViewport,
  generateArticleMetadata,
  generateProfileMetadata,
} from "@/lib/metadata";
export type {
  PageType,
  IconConfig,
  VerificationConfig,
  JsonLdConfig,
  SocialConfig,
  GenerateMetadataOptions,
} from "@/types/metadata-types";
export { SITE_METADATA } from "@/config/site";
