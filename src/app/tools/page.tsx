'use client';

import React from 'react';
import { UnifiedGrid } from '@/components/common/cards/unified-grid';
import { UnifiedCard } from '@/components/common/cards/unified-card';
import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { TOOLS, TOOL_CATEGORIES } from '@/components/features/tools/tools-data';
import { useToolFilter, useToolSearch } from '@/components/features/tools/use-tools';
import type { Tool } from '@/types/pages';

/**
 * 工具页面组件
 * @see src/types/pages.ts - 使用 Tool 和 ToolCategory 类型
 * @see src/hooks/use-tools.ts - 使用 useToolFilter 和 useToolSearch hooks
 * @see src/config/tools.ts - 使用工具和分类配置
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

export default function ToolsPage() {
  const {
    filteredTools,
    selectedCategory,
    selectedTag,
    setSelectedCategory,
    setSelectedTag,
    tagCounts,
  } = useToolFilter(TOOLS);

  const { searchResults } = useToolSearch(filteredTools);

  // 处理分类切换
  const handleCategoryClick = (categoryId: string) => {
    // 如果点击当前选中的分类，则切换到全部状态
    if (categoryId === selectedCategory) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(categoryId);
    }
    setSelectedTag(null); // 清除已选标签
  };

  // 处理标签点击（包括卡片标签）
  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // 处理卡片标签点击
  const handleCardTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  // 格式化标签数据
  const formattedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      name: tag,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold text-foreground dark:text-slate-100 mb-6">工具箱</h1>

          {/* 使用统一的筛选组件 */}
          <UnifiedFilter
            categories={TOOL_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryClick}
            tags={formattedTags}
            selectedTag={selectedTag}
            onTagChange={handleTagClick}
            onCardTagClick={handleCardTagClick}
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
              searchResults.map(tool => (
                <ToolCard key={tool.id} tool={tool} onTagClick={handleCardTagClick} />
              ))
            )}
          </UnifiedGrid>
        </div>
      </div>
    </div>
  );
}