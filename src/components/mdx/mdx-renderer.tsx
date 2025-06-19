'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMemo } from 'react';
import { MDXComponents } from './mdx-components';

interface MDXRendererProps {
  content: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<{ children?: React.ReactNode }>>;
}

export function MDXRenderer({ content, components: customComponents = {} }: MDXRendererProps) {
  const components = useMemo(
    () => ({
      ...MDXComponents,
      ...customComponents,
    }),
    [customComponents]
  );

  // 确保 content 是有效的序列化结果
  if (!content || typeof content !== 'object') {
    console.warn('Invalid MDX content provided to MDXRenderer');
    return null;
  }

  return <MDXRemote {...content} components={components} />;
}
