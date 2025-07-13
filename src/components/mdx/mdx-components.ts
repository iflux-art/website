/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

// ===== 静态组件 =====
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXImg } from "@/components/mdx/mdx-img";

/**
 * 静态组件映射
 */
const staticComponents = {
  a: MDXLink,
  blockquote: MDXBlockquote,
  img: MDXImg,
};

/**
 * 合并后的MDX组件映射
 */
export const MDXComponents = {
  ...staticComponents,
};

export type MDXComponentsType = typeof MDXComponents;
