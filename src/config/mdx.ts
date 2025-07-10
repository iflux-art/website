/**
 * MDX 配置中心
 * 精简配置，与实际组件保持一致
 */

import { MDXComponents } from "@/components/mdx/mdx-components";
export const MDXComponentsMapping = MDXComponents;
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";

export type { MDXComponentsType } from "@/types/mdx-types";

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
