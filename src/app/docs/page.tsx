'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { BlogLayout } from '@/components/layout/blog-layout';
import { DocsCard } from '@/components/cards';
import { useDocCategories } from '@/hooks/use-docs';

export default function DocsPage() {
  const pathname = usePathname();

  // 使用客户端钩子获取文档分类
  const { categories, loading, error } = useDocCategories();

  // 仅在开发环境下添加调试信息
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.log('文档页面路径:', pathname);
      console.log('文档分类加载状态:', loading);
      console.log('文档分类数量:', categories.length);
      if (error) {
        console.error('文档分类加载错误:', error);
      }
    }, [pathname, loading, categories.length, error]);
  }

  return (
    <BlogLayout title="文档中心" description="探索我们的技术文档和指南">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <DocsCard
            key={category.id}
            title={category.title}
            description={category.description}
            articleCount={category.count}
            href={`/docs/${category.id}`}
          />
        ))}
      </div>
    </BlogLayout>
  );
}
