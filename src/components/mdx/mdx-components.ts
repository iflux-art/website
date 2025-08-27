/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXImg } from "@/components/mdx/mdx-img";
import { MDXLink } from "@/components/mdx/mdx-link";

export const MDXComponents = {
  a: MDXLink,
  blockquote: MDXBlockquote,
  img: MDXImg,
};

export const useMDXComponents = () => MDXComponents;

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
