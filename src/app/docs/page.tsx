import React from 'react';

import { getDocCategories } from '@/lib/docs';
import { DocCategoryCard } from '@/components/features/docs/category/doc-category-card';

export default function DocsPage() {
  // 获取文档分类
  const categories = getDocCategories();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <DocCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}