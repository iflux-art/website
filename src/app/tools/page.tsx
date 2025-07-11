"use client";

import React from "react";
import { AppGrid } from "@/components/layout/app-grid";
import { UnifiedFilter } from "@/components/common/unified-filter";
import { TOOLS, TOOL_CATEGORIES } from "@/config/tools";
import { ToolLayout } from "@/components/layout/tool-layout";
import { useFilterState } from "@/hooks/state/use-filter-state";
import { ToolCard } from "@/components/common/card/tool-card";

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
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          工具箱
        </h1>
        <p className="mt-2 text-muted-foreground">
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
      <AppGrid columns={4} className="mt-8">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.name}
            title={tool.name}
            description={tool.description}
            href={tool.path}
            tags={tool.tags}
            isExternal={!tool.isInternal}
            onTagClick={handleTagChange}
          />
        ))}
      </AppGrid>
    </ToolLayout>
  );
}
