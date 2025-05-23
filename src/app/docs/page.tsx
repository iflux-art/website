'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { CategoryGrid as DocsList } from '@/components/ui/category-grid';
import { PageLayout } from '@/components/layout/page-layout/page-layout';
import { useDocCategories } from '@/hooks/use-docs';

export default function DocsPage() {
  const pathname = usePathname();

  // 使用客户端钩子获取文档分类
  const { categories, loading, error } = useDocCategories();

  // 调试信息
  useEffect(() => {
    console.log('文档页面路径:', pathname);
    console.log('文档分类加载状态:', loading);
    console.log('文档分类数量:', categories.length);
    if (error) {
      console.error('文档分类加载错误:', error);
    }
  }, [pathname, loading, categories.length, error]);

  return (
    <PageLayout pageTitle="文档中心" className="py-10">
      {loading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-xl shadow-sm"></div>
            ))}
          </div>
        </div>
      ) : (
        <DocsList categories={categories} />
      )}
    </PageLayout>
  );
}
