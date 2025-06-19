'use client';

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDX_STYLE_CONFIG, MDX_DEFAULT_OPTIONS } from './config';
import { MDXComponents } from './components';
import type { MDXRendererProps } from './types';

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
  const [serializedContent, setSerializedContent] = React.useState<MDXRemoteSerializeResult | null>(
    null
  );

  // 合并自定义组件
  const { components: customComponents = {} } = options;
  const components = { ...MDXComponents, ...customComponents };

  // 当内容是字符串时进行序列化
  React.useEffect(() => {
    if (typeof content === 'string') {
      serialize(content, {
        parseFrontmatter: MDX_DEFAULT_OPTIONS.compile.parseFrontmatter,
        mdxOptions: {
          development: MDX_DEFAULT_OPTIONS.compile.development,
        },
      }).then(setSerializedContent);
    }
  }, [content]);

  try {
    return (
      <div className={MDX_STYLE_CONFIG.prose}>
        {typeof content === 'string' ? (
          serializedContent ? (
            <MDXRemote {...serializedContent} components={components} />
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <MDXRemote {...content} components={components} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Failed to render MDX content:', error);
    return <div className="text-red-500">Failed to render content</div>;
  }
};

export default MDXRenderer;
