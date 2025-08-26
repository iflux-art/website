/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXImg } from "@/components/mdx/mdx-img";
// ===== 静态组件 =====
import { MDXLink } from "@/components/mdx/mdx-link";

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

// ===== 迁移自 src/config/mdx.ts =====
/**
 * 精简后的默认组件属性
 */
export const defaultComponentProps = {};

/**
 * 获取 MDX 组件配置
 */
export const useMDXComponents = () => ({
  components: MDXComponents,
  defaultProps: defaultComponentProps,
});

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
