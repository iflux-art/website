"use client";

import { ThreeColumnLayout } from "@/components/layout";
import { TableOfContentsCard } from "@/components/layout/toc/table-of-contents-card";
import { LinksContent, LinksSidebarCard } from "@/features/links/components";
import { useLinksData } from "@/features/links/hooks";
import { useTagAnchors } from "@/features/links/hooks/use-tag-anchors";

/**
 * 链接导航页面容器组件（客户端）
 * 处理链接数据获取和交互逻辑
 */
export const LinksPageContainer = () => {
  const { categories, selectedCategory, filteredItems, handleCategoryClick } = useLinksData();

  // 生成标签锚点数据供 TableOfContents 使用 - 使用 useMemo 优化性能
  const tagAnchors = useTagAnchors(filteredItems);

  // 左侧边栏内容
  const leftSidebar = (
    <LinksSidebarCard
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryClick}
    />
  );

  // 右侧边栏内容
  const rightSidebar = (
    <TableOfContentsCard headings={tagAnchors} title="标签导航" className="prose-sm" />
  );

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
        layout="double-sidebar"
      >
        <LinksContent items={filteredItems} selectedCategory={selectedCategory} />
      </ThreeColumnLayout>
    </div>
  );
};

export default LinksPageContainer;
