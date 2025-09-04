/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

import { MDXBlockquote } from "@/features/content/components/mdx/mdx-blockquote";
import { MDXCode } from "@/features/content/components/mdx/mdx-code";
import { MDXImg } from "@/features/content/components/mdx/mdx-img";
import { MDXLink } from "@/features/content/components/mdx/mdx-link";
import { MDXPre } from "@/features/content/components/mdx/mdx-pre";

export const MDXComponents = {
  a: MDXLink,
  blockquote: MDXBlockquote,
  code: MDXCode,
  img: MDXImg,
  pre: MDXPre,
};

export const useMDXComponents = () => MDXComponents;

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
