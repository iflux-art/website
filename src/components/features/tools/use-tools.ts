/**
 * 工具页面状态管理 hooks
 * @module hooks/use-tools
 */

import { useState, useMemo } from 'react';
import type { Tool } from '@/shared/types/pages';

/**
 * 工具过滤 hook
 * @param tools - 工具列表
 * @returns 过滤工具相关的状态和方法
 *
 * @example
 * ```tsx
 * // 在工具页面中使用
 * const {
 *   filteredTools,
 *   selectedCategory,
 *   selectedTag,
 *   setSelectedCategory,
 *   setSelectedTag
 * } = useToolFilter(tools);
 * ```
 *
 * @see src/app/tools/page.tsx - 工具页面使用此 hook 管理工具过滤状态
 */
export function useToolFilter(tools: Tool[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 根据分类和标签过滤工具
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchTag = !selectedTag || tool.tags.includes(selectedTag);
      return matchCategory && matchTag;
    });
  }, [tools, selectedCategory, selectedTag]);

  // 获取所有标签及其计数
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tools.forEach(tool => {
      tool.tags.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }));
  }, [tools]);

  return {
    filteredTools,
    selectedCategory,
    selectedTag,
    setSelectedCategory,
    setSelectedTag,
    tagCounts,
  };
}

/**
 * 工具列表 hook
 * @param tools - 工具列表
 * @returns 处理后的工具列表
 *
 * @example
 * ```tsx
 * const { searchResults } = useToolSearch(tools);
 * ```
 *
 * @see src/app/tools/page.tsx - 工具页面使用此 hook 获取工具列表
 */
export function useToolSearch(tools: Tool[]) {
  return {
    searchResults: tools,
  };
}
