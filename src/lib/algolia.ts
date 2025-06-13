import algoliasearch from 'algoliasearch';
import type { SearchClient, SearchIndex } from 'algoliasearch';

// 这些值应该从环境变量中获取
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || '';
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || '';

// 创建 Algolia 客户端实例
export const searchClient: SearchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
export const adminClient: SearchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

// 获取默认索引
export const searchIndex: SearchIndex = searchClient.initIndex(ALGOLIA_INDEX_NAME);
export const adminIndex: SearchIndex = adminClient.initIndex(ALGOLIA_INDEX_NAME);

// 搜索结果类型
export interface AlgoliaSearchResult {
  objectID: string;
  title: string;
  description?: string;
  url: string;
  type: 'blog' | 'doc' | 'tool';
  category?: string;
  tags?: string[];
  _highlightResult?: {
    title: { value: string };
    description?: { value: string };
  };
}

// 搜索函数
export async function performSearch(query: string): Promise<AlgoliaSearchResult[]> {
  if (!query.trim()) return [];

  try {
    const { hits } = await searchIndex.search<AlgoliaSearchResult>(query, {
      hitsPerPage: 10,
      attributesToHighlight: ['title', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    });

    return hits;
  } catch (error) {
    console.error('Algolia search error:', error);
    return [];
  }
}