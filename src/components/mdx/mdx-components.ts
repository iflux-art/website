/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXCode } from "@/components/mdx/mdx-code";
import { MDXImg } from "@/components/mdx/mdx-img";
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXPre } from "@/components/mdx/mdx-pre";

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
