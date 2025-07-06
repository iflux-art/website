import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXStyles } from "@/config/mdx/styles";
import { MDXComponentsMapping, type MDXComponents } from "@/config/mdx";

interface MDXRendererProps {
  content: string;
  options?: {
    components?: Partial<MDXComponents>;
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
  ) as Record<string, React.ComponentType<Record<string, unknown>>>;

  if (!content) {
    return null;
  }

  try {
    return (
      <div className={MDXStyles.prose}>
        <MDXRemote source={content} components={components} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MDX:", error);
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <h3 className="mb-2 font-semibold">Render Error</h3>
        <p>
          {error instanceof Error ? error.message : "Failed to render content"}
        </p>
      </div>
    );
  }
};

export default MDXRenderer;
