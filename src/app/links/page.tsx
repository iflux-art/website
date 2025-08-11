"use client";

import React from "react";
import { AppGrid } from "@/components/layout/app-grid";
import { LinksSidebar, LinksContent } from "@/features/links/components";
import { TableOfContents } from "@/components/content/table-of-contents";
import { useLinksData } from "@/features/links/hooks";
import { useTagAnchors } from "@/hooks/use-tag-anchors";

export default function LinksPage() {
  const {
    items,
    categories,
    selectedCategory,
    filteredItems,
    handleCategoryClick,
  } = useLinksData();

  // 生成标签锚点数据供 TableOfContents 使用 - 使用 useMemo 优化性能
  const tagAnchors = useTagAnchors(filteredItems);

  if (!items.length) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <AppGrid columns={5} gap="large">
          {/* 左侧边栏 - 分类导航 */}
          <aside className="hide-scrollbar sticky top-20 col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:block">
            <LinksSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryClick}
            />
          </aside>

          {/* 主内容区 - 链接内容 */}
          <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
            <LinksContent
              items={filteredItems}
              selectedCategory={selectedCategory}
            />
          </main>

          {/* 右侧边栏 - 标签导航 */}
          <aside className="sticky top-[80px] col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-hidden xl:block">
            <TableOfContents
              headings={tagAnchors}
              title="标签导航"
              adaptive={true}
              adaptiveOffset={80}
              className="prose-sm"
            />
          </aside>
        </AppGrid>
      </div>
    </div>
  );
}
