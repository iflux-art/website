'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/card';
import { Badge } from '@/components/ui/badge';
import { TagFilter } from '@/components/ui/tag-filter';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { useToolFilter, useToolSearch } from '@/hooks/use-tools';
import type { Tool } from '@/types/pages';
// 仅保留注释

/**
 * 工具页面组件
 * @see src/types/pages.ts - 使用 Tool 和 ToolCategory 类型
 * @see src/hooks/use-tools.ts - 使用 useToolFilter 和 useToolSearch hooks
 * @see src/config/tools.ts - 使用工具和分类配置
 */
function ToolCard({ tool, onTagClick }: { tool: Tool; onTagClick: (tag: string) => void }) {
  const Icon = tool.isInternal ? null : ExternalLink;

  return (
    <Card className="h-full rounded-lg border bg-zinc-50 hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-medium text-card-foreground dark:text-slate-100">
          <span>{tool.name}</span>
          {Icon && <Icon className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 hover:bg-primary/20"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {searchResults.map(tool => (
              <Link key={tool.id} href={tool.path}>
                <ToolCard tool={tool} onTagClick={setSelectedTag} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}