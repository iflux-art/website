/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

// ===== 静态组件 =====
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXCard } from "@/components/mdx/mdx-card";
import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXImg } from "@/components/mdx/mdx-img";

// ===== 交互组件 =====
import { MDXCallout } from "@/components/mdx/mdx-callout";
import { MDXVideo } from "@/components/mdx/mdx-video";

/**
 * 静态组件映射
 */
const staticComponents = {
  a: MDXLink,
  Card: MDXCard,
  blockquote: MDXBlockquote,
  img: MDXImg,
};

/**
 * 交互组件映射
 */
const interactiveComponents = {
  Callout: MDXCallout,
  video: MDXVideo,
};

/**
 * 合并后的MDX组件映射
 */
export const MDXComponents = {
  ...staticComponents,
  ...interactiveComponents,
};

export type MDXComponentsType = typeof MDXComponents;
