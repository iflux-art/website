'use client';

import React from 'react';
import Link from 'next/link';
import { MDX_STYLE_CONFIG } from '../config';
import type { MDXLinkProps } from '../types';

/**
 * 判断是否为外部链接
 */
const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
};

/**
 * MDX 链接渲染组件
 * - 自动处理内部/外部链接
 * - 添加安全属性
 * - 支持自定义样式
 */
export const MDXLink = ({ href, children, className, external, ...props }: MDXLinkProps) => {
  if (!href) return null;

  const isExternal = external ?? isExternalLink(href);
  const linkClassName = `${MDX_STYLE_CONFIG.link} ${className || ''}`;

  if (isExternal) {
    return (
      <a href={href} className={linkClassName} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName} {...props}>
      {children}
    </Link>
  );
};
