'use client';

import React, { useMemo } from 'react';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { UnifiedCard } from '@/components/common/cards/unified-card';
import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { TOOLS, TOOL_CATEGORIES } from '@/components/layout/tools/tools-data';
import { useToolSearch } from '@/hooks/use-tools';
import { PageLayout, PageTitle } from '@/components/layout/page-layout';
import { useFilterState } from '@/hooks/use-filter-state';
import type { Tool } from '@/components/layout/tools/pages';

/**
 * 工具卡片组件
 */
function ToolCard({ tool, onTagClick }: { tool: Tool; onTagClick: (tag: string) => void }) {
  return (
    <UnifiedCard
      type="resource"
      variant="default"
      title={tool.name}
      description={tool.description}
      href={tool.path}
      tags={tool.tags}
      isExternal={!tool.isInternal}
      onTagClick={onTagClick}
    />
  );
}

/**
 * 工具页面组件
 */
export default function ToolsPage() {
  const {
    filteredItems: filteredTools,
    selectedCategory,
    selectedTag,
    handleCategoryChange: baseHandleCategoryChange,
    handleTagChange,
  } = useFilterState(TOOLS);

  // 处理分类切换，同时清空标签选择
  const handleCategoryChange = (category: string) => {
    baseHandleCategoryChange(category);
    handleTagChange(null);
  };

  // 根据当前选中的分类过滤标签
  const filteredTags = useMemo(() => {
    const currentTools = selectedCategory
      ? TOOLS.filter((tool) => tool.category === selectedCategory)
      : TOOLS;

    // 收集当前分类下的所有标签
    const tags = new Map<string, number>();
    currentTools.forEach((tool) => {
      tool.tags.forEach((tag) => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });

    // 转换为排序后的数组
    return Array.from(tags.entries())
      .map(([tag, count]) => ({
        name: tag,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedCategory, TOOLS]);

  const { searchResults } = useToolSearch(filteredTools);

  return (
    <PageLayout>
      <PageTitle>工具箱</PageTitle>

      {/* 使用统一的筛选组件 */}
      <UnifiedFilter
        categories={TOOL_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        tags={filteredTags}
        selectedTag={selectedTag}
        onTagChange={handleTagChange}
        onCardTagClick={handleTagChange}
        categoryButtonClassName="rounded-full"
        className="mb-6"
      />

      {/* 工具卡片网格 */}
      <UnifiedGrid columns={4} className="mt-8">
        {searchResults.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的工具' : '暂无工具数据'}
            </p>
          </div>
        ) : (
          searchResults.map((tool) => (
            <ToolCard key={tool.name} tool={tool} onTagClick={handleTagChange} />
          ))
        )}
      </UnifiedGrid>
    </PageLayout>
  );
}
