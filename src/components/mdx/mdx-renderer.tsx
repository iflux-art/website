import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponentsMapping, type MDXComponents } from '@/config/mdx';

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
  const components = {
    ...MDXComponentsMapping,
    ...(options.components || {}),
  };

  if (!content) {
    return null;
  }

  try {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering MDX:', error);
    return (
      <div className="text-destructive p-4 rounded-md bg-destructive/10">
        <h3 className="font-semibold mb-2">Render Error</h3>
        <p>{error instanceof Error ? error.message : 'Failed to render content'}</p>
      </div>
    );
  }
};

export default MDXRenderer;
