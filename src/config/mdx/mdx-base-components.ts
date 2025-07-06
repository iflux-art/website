/**
 * MDX 基础组件配置
 * 包含所有标准HTML元素的MDX组件映射
 */

import type { MDXComponents } from "@/types";
import { MDXImage } from "@/components/mdx/mdx-image";
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXCodeBlock } from "@/components/mdx/mdx-code-block";
import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXCodeInline } from "@/components/mdx/mdx-codeInline";
import { MDXTableComponents } from "@/components/mdx/mdx-table";

/**
 * 基础HTML组件映射
 */
export const baseMDXComponents: MDXComponents = {
  // 标准HTML元素映射
  img: MDXImage,
  a: MDXLink,
  pre: MDXCodeBlock,
  blockquote: MDXBlockquote,
  code: MDXCodeInline,
  table: MDXTableComponents.table,
  thead: MDXTableComponents.thead,
  tbody: MDXTableComponents.tbody,
  tr: MDXTableComponents.tr,
  th: MDXTableComponents.th,
  td: MDXTableComponents.td,
};
