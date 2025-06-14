'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedGrid } from '@/components/common/cards/unified-grid';
import { TagFilter } from '@/components/ui/tag-filter';
import { TOOLS, TOOL_CATEGORIES } from '@/components/features/tools/tools-data';
import { useToolFilter, useToolSearch } from '@/components/features/tools/use-tools';
import type { Tool } from '@/types/pages';
import { UnifiedCard } from '@/components/common/cards/unified-card';

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
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const {
    filteredTools,
    selectedCategory,
    selectedTag,
    setSelectedCategory,
    setSelectedTag,
    tagCounts,
  } = useToolFilter(TOOLS);

  const { searchResults } = useToolSearch(filteredTools);

  const formattedTags = tagCounts.map(({ tag, count }) => ({
    name: tag,
    count: count,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold text-foreground dark:text-slate-100 mb-6">工具箱</h1>

          {/* 分类过滤 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TOOL_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* 标签过滤器 */}
          <TagFilter
            tags={formattedTags}
            selectedTag={selectedTag}
            onTagSelectAction={setSelectedTag}
            showCount={true}
            maxVisible={8}
            className="mb-6"
            expanded={tagsExpanded}
            onExpandChange={setTagsExpanded}
          />

          {/* 工具卡片网格 */}
          <UnifiedGrid columns={4} className="mt-8">
            {searchResults.map(tool => (
              <ToolCard key={tool.id} tool={tool} onTagClick={setSelectedTag} />
            ))}
          </UnifiedGrid>
        </div>
      </div>
    </div>
  );
}