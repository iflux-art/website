import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponentsMapping, type MDXComponentsType } from "@/config/mdx";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
};

interface MDXRendererProps {
  content: string;
  options?: {
    components?: Partial<MDXComponentsType>;
  };
}

/**
 * 统一的 MDX 渲染器组件
 *
 * 功能：
 * 1. 统一管理 MDX 组件
 * 2. 处理客户端渲染
 * 3. 支持自定义组件和配置
 * 4. 错误处理和降级显示
 */
export const MDXRenderer = ({ content, options = {} }: MDXRendererProps) => {
  // 合并并过滤掉 undefined 的组件
  const merged = { ...MDXComponentsMapping, ...(options.components || {}) };
  const components = Object.fromEntries(
    Object.entries(merged).filter(([, comp]) => typeof comp === "function"),
  ) as Record<string, React.ComponentType<any>>;

  if (!content) {
    return null;
  }

  try {
    return (
      <div className="prose w-full max-w-full dark:prose-invert">
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MDX:", error);
    return null;
  }
};

export default MDXRenderer;
