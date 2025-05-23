'use client';

import React from 'react';

export interface MDXResourceGridProps {
  /**
   * 子元素
   */
  children: React.ReactNode;
}

/**
 * MDX 资源网格组件
 * 
 * 专门用于在 MDX 文件中显示资源卡片网格
 */
export function MDXResourceGrid({
  children,
}: MDXResourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {children}
    </div>
  );
}
