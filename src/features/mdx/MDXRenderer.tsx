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
    typeof content !== 'string' ? content : null
  );

  // 合并自定义组件
  const { components: customComponents = {} } = options;
  const components = { ...MDXComponents, ...customComponents };

  React.useEffect(() => {
    if (typeof content === 'string') {
      serialize(content, {
        parseFrontmatter: MDX_DEFAULT_OPTIONS.compile.parseFrontmatter,
        mdxOptions: {
          development: MDX_DEFAULT_OPTIONS.compile.development,
        },
      }).then(setSerializedContent);
    } else {
      setSerializedContent(content);
    }
  }, [content]);

  if (!content) {
    return null;
  }

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
    console.error('Error rendering MDX:', error);
    return <div className="text-red-500">Error rendering content</div>;
  }
};

export default MDXRenderer;
