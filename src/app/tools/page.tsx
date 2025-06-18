'use client';

import React from 'react';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { UnifiedCard } from '@/components/common/unified-card';
import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { TOOLS, TOOL_CATEGORIES } from '@/components/layout/tools/tools-data';
import { ToolLayout } from '@/components/layout/tools/tool-layout';
import { useFilterState } from '@/components/common/filter/use-filter-state';
import type { Tool } from '@/components/layout/tools/tools-data';

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
    filteredTags,
  } = useFilterState(TOOLS);

  // 处理分类切换，同时清空标签选择
  const handleCategoryChange = (category: string) => {
    baseHandleCategoryChange(category);
    handleTagChange(null);
  };

  return (
    <ToolLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">工具箱</h1>
        <p className="text-muted-foreground mt-2">
          这里是工具箱，提供了各种工具，帮助你完成各种任务。
        </p>
      </div>

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
        {filteredTools.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的工具' : '暂无工具数据'}
            </p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} onTagClick={handleTagChange} />
          ))
        )}
      </UnifiedGrid>
    </ToolLayout>
  );
}
