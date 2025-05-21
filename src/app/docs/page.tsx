import React from 'react';

import { getDocCategories } from '@/lib/docs';
import { DocsList } from '@/components/features/docs/category/docs-list';

export default function DocsPage() {
  // 获取文档分类（在服务器端执行）
  const categories = getDocCategories();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">文档中心</h1>

      {/* 使用客户端组件渲染文档列表 */}
      <DocsList categories={categories} />
    </main>
  );
}