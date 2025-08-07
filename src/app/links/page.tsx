"use client";

import React from "react";
import { AppGrid } from "@/components/layout/app-grid";
import { LinksSidebar } from "@/components/links/links-sidebar";
import { LinksContent } from "@/components/links/links-content";
import { TableOfContents } from "@/components/content/table-of-contents";
import { useLinksData } from "@/hooks/use-links-data";
import { useTagAnchors } from "@/hooks/use-tag-anchors";

// 内联 LinksHeaderProps 类型定义
interface LinksHeaderProps {
  totalItems: number;
  filteredCount: number;
  selectedCategory?: string;
  getCategoryName: (categoryId: string) => string;
}

function LinksHeader({
  totalItems,
  filteredCount,
  selectedCategory,
  getCategoryName,
}: LinksHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">网址</h1>
      {selectedCategory ? (
        <p className="text-muted-foreground">
          显示 {filteredCount} 个网址 · {getCategoryName(selectedCategory)}
        </p>
      ) : (
        <p className="text-muted-foreground">共收录 {totalItems} 个优质网站</p>
      )}
    </div>
  );
}

export default function LinksPage() {
  const {
    items,
    categories,
    selectedCategory,
    filteredItems,
    totalFilteredCount,
    handleCategoryClick,
    getCategoryName,
  } = useLinksData();

  // 生成标签锚点数据供 TableOfContents 使用 - 使用 useMemo 优化性能
  const tagAnchors = useTagAnchors(filteredItems);

  if (!items.length) return null;

  return (
    <div className="container mx-auto py-8">
      <LinksHeader
        filteredCount={filteredItems.length}
        selectedCategory={selectedCategory}
        totalItems={totalFilteredCount}
        getCategoryName={getCategoryName}
      />

      <AppGrid columns={5} className="gap-8">
        {/* 左侧边栏 - 分类导航 */}
        <div className="col-span-1">
          <LinksSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryClick}
            className="hide-scrollbar sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto"
          />
        </div>

        {/* 中间内容区 - 链接内容 */}
        <div className="col-span-3">
          <LinksContent
            items={filteredItems}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* 右侧目录 - 标签导航 */}
        <div className="col-span-1">
          <TableOfContents
            headings={tagAnchors}
            title="标签导航"
            className="hide-scrollbar sticky top-[80px] max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto"
          />
        </div>
      </AppGrid>
    </div>
  );
}
