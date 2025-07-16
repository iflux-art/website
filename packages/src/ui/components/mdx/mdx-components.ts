/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

// ===== 静态组件 =====
import { MDXLink } from "packages/src/ui/components/mdx/mdx-link";
import { MDXBlockquote } from "packages/src/ui/components/mdx/mdx-blockquote";
import { MDXImg } from "packages/src/ui/components/mdx/mdx-img";

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
export const useMDXComponents = () => {
  return {
    components: MDXComponents,
    defaultProps: defaultComponentProps,
  };
};

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
