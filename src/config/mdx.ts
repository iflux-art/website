/**
 * MDX 配置中心
 * 精简配置，与实际组件保持一致
 */

import { MDXComponents } from "@/components/mdx/mdx-components";
import type { MDXComponents as MDXComponentsType, MDXOptions } from "@/types";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";

// 重新导出组件配置
export { MDXComponents as mdxComponents } from "@/components/mdx/mdx-components";

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

// 导出类型和组件映射
export type { MDXComponentsType, MDXOptions };
export const MDXComponentsMapping = MDXComponents;

/**
 * 默认配置
 */
const defaultMDXConfig = {
  options: {
    compile: {
      parseFrontmatter: true,
      development: process.env.NODE_ENV === "development",
    },
  },
};

export const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
};

export const mdxRehypePlugins = [[rehypePrettyCode, prettyCodeOptions]];

export default defaultMDXConfig;
