/**
 * 搜索引擎核心功能
 */

import { SearchOptions, SearchResponse } from "../types";

/**
 * 执行搜索
 */
export async function performSearch(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResponse> {
  const { type = "all", limit = 10 } = options;

  if (!query.trim()) {
    return {
      results: [],
      total: 0,
      query,
      type,
    };
  }

  try {
    const searchParams = new URLSearchParams({
      q: query.trim(),
      type,
      ...(limit && { limit: limit.toString() }),
    });

    const response = await fetch(`/api/search?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      results: data.results || [],
      total: data.results?.length || 0,
      query,
      type,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      results: [],
      total: 0,
      query,
      type,
    };
  }
}

/**
 * 搜索建议
 */
export async function getSearchSuggestions(
  query: string,
  _limit: number = 5,
): Promise<string[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  try {
    // 这里可以实现搜索建议的逻辑
    // 暂时返回空数组，后续可以扩展
    return [];
  } catch (error) {
    console.error("Search suggestions error:", error);
    return [];
  }
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
