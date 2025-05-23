'use client';

import React from 'react';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
  pageTitle?: string;
};

/**
 * 页面布局组件
 * 提供统一的页面容器和动画效果
 */
export function PageLayout({
  children,
  className = '',
  animate = true,
  id,
  pageTitle,
}: PageLayoutProps) {
  return (
    <main id={id} className={`container mx-auto px-4 py-6 md:py-8 flex-grow flex-1 ${className}`}>
      {pageTitle && <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">{pageTitle}</h1>}
      {children}
    </main>
  );
}
