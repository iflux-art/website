'use client';

import React from 'react';

export interface MDXFriendLinkGridProps {
  /**
   * 子元素
   */
  children: React.ReactNode;
}

/**
 * MDX 友情链接网格组件
 * 
 * 专门用于在 MDX 文件中显示友情链接卡片网格
 */
export function MDXFriendLinkGrid({
  children,
}: MDXFriendLinkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {children}
    </div>
  );
}
