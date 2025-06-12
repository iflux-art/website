'use client';

import React from 'react';
import { TableOfContents } from '@/components/ui/table-of-contents';
import type { Heading } from '@/types/docs';

export interface AdaptiveSidebarProps {
  /**
   * 文档标题列表
   */
  headings: Array<Heading>;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 自适应侧边栏组件
 * 
 * 封装了 TableOfContents 组件，提供自适应定位功能
 */
export function AdaptiveSidebar({ headings, className }: AdaptiveSidebarProps) {
  return (
    <TableOfContents
      headings={headings}
      className={className}
      adaptive={true}
      adaptiveOffset={80}
    />
  );
}