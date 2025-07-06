/**
 * MDX 扩展组件配置
 * 包含所有自定义扩展的MDX组件映射
 */

import type { MDXComponents } from "@/types";
import {
  PrimaryCode,
  SecondaryCode,
  SuccessCode,
  WarningCode,
  ErrorCode,
} from "@/components/mdx/mdx-codeInline";
import { MDXTabs } from "@/components/mdx/mdx-tabs";
import { MDXAccordion } from "@/components/mdx/mdx-accordion";
import { MDXVideo } from "@/components/mdx/mdx-video";
import { MDXImageZoom } from "@/components/mdx/mdx-image-zoom";
import { MDXCodeDemo } from "@/components/mdx/mdx-code-demo";

/**
 * 扩展组件映射
 */
export const extendedMDXComponents: MDXComponents = {
  // 代码样式变体
  "code.primary": PrimaryCode,
  "code.secondary": SecondaryCode,
  "code.success": SuccessCode,
  "code.warning": WarningCode,
  "code.error": ErrorCode,

  // 功能扩展组件
  Tabs: MDXTabs,
  Accordion: MDXAccordion,
  Video: MDXVideo,
  ImageZoom: MDXImageZoom,
  CodeDemo: MDXCodeDemo,
};
