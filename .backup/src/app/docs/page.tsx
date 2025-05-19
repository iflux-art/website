import React from 'react';

import { getDocCategories, getRecentDocs } from '@/lib/docs';
import { DocCategoryCard } from '@/components/features/content/category/doc-category-card';
import { RecentDocsList } from '@/components/features/docs/recent-docs-list';

export default function DocsPage() {
  // 获取文档分类和最新文档
  const categories = getDocCategories();
  const recentDocs = getRecentDocs();
  
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <DocCategoryCard key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">最新文档</h2>
        <RecentDocsList docs={recentDocs} />
      </div>
    </main>
  );
}

// 使用lib/docs中的getDocCategories函数

// 使用lib/docs中的getRecentDocs函数