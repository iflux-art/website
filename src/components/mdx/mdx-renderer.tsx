// 使用临时文件来确保内容正确

import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXContentProps } from './types';
import { STYLE_CONFIG } from './utils/config';
import { BaseComponents } from './renderers/components';

/**
 * MDX内容渲染器
 */
export const MDXRenderer = async ({ content, options = {} }: MDXContentProps) => {
  const { components: customComponents = {} } = options;

  try {
    return (
      <div className={STYLE_CONFIG.BASE_CLASSES.prose}>
        <MDXRemote
          source={content}
          components={{ ...BaseComponents, ...customComponents }}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to compile MDX:', error);
    return <div>Error rendering content</div>;
  }
};

export default MDXRenderer;