'use client';

import React from 'react';
import { ThreeColumnLayout } from '@/features/layout';
import { LinksContent, LinksSidebarCard } from '@/features/links/components';
import { TableOfContentsCard } from '@/features/content';
import { useLinksData } from '@/features/links/hooks';
import { useTagAnchors } from '@/features/links/hooks/use-tag-anchors';

// 由于使用了客户端 hooks，这里不能导出 metadata
// 在实际项目中应该考虑使用 generateMetadata 函数或服务端组件

const LinksPage = () => {
  const { categories, selectedCategory, filteredItems, handleCategoryClick } = useLinksData();

  // 生成标签锚点数据供 TableOfContents 使用
  const tagAnchors = useTagAnchors(filteredItems);

  // 左侧边栏内容 - 分类导航
  const leftSidebar = (
    <LinksSidebarCard
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryClick}
    />
  );

  // 右侧边栏内容 - 标签导航
  const rightSidebar = (
    <TableOfContentsCard headings={tagAnchors} title="标签导航" className="prose-sm" />
  );

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
        {/* 页面主内容 */}
        <div className="space-y-6">
          {/* 链接内容 */}
          <LinksContent items={filteredItems} selectedCategory={selectedCategory} />
        </div>
      </ThreeColumnLayout>
    </div>
  );
};

export default LinksPage;
