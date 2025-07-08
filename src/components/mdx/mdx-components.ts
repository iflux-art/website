/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

// ===== 静态组件 =====
import { MDXLink } from "./mdx-link";
import { MDXCard } from "./mdx-card";
import { MDXBlockquote } from "./mdx-blockquote";
import { MDXImg } from "./mdx-img";

// ===== 交互组件 =====
import { MDXCallout } from "./mdx-callout";
import { MDXVideo } from "./mdx-video";

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
