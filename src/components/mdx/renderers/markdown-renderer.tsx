'use client';

import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXContentProps } from '../types';
import { STYLE_CONFIG } from '../utils/config';
import { BaseComponents } from './components';

/**
 * 服务端MDX渲染器
 */
const ServerMarkdownRenderer = async ({ content, options = {} }: MDXContentProps) => {
  const { components: customComponents = {} } = options;

  try {
    // 编译 MDX 内容
    const compiled = await serialize(content);

    return (
      <div className={STYLE_CONFIG.BASE_CLASSES.prose}>
        <MDXRemote
          source={compiled}
          components={{ ...BaseComponents, ...customComponents }}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to compile MDX:', error);
    return <div>Error rendering content</div>;
  }
};

/**
 * 客户端MDX渲染器
 */
const ClientMarkdownRenderer = ({ content, options = {} }: MDXContentProps) => {
  const { components: customComponents = {} } = options;

  return (
    <div className={STYLE_CONFIG.BASE_CLASSES.prose}>
      <MDXRemote
        source={content}
        components={{ ...BaseComponents, ...customComponents }}
      />
    </div>
  );
};

/**
 * 智能选择合适的渲染器
 */
export const MarkdownRenderer = (props: MDXContentProps) => {
  const isClient = typeof window !== 'undefined';
  return isClient ? <ClientMarkdownRenderer {...props} /> : <ServerMarkdownRenderer {...props} />;
};

// 为了保持向后兼容性，导出 MDXRenderer 作为别名
export const MDXRenderer = MarkdownRenderer;

export default MarkdownRenderer;