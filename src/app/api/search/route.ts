import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { TOOLS } from '@/components/layout/tools/tools-data';
import { links } from '@/components/layout/links/common/links-data';

// 辅助函数
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function findContentMatches(content: string, query: string, maxMatches: number = 3): string[] {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matches: string[] = [];

  let startIndex = 0;
  while (matches.length < maxMatches) {
    const index = lowerContent.indexOf(lowerQuery, startIndex);
    if (index === -1) break;

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    let context = content.substring(start, end);

    if (start > 0) context = '...' + context;
    if (end < content.length) context = context + '...';

    matches.push(highlightText(context, query));
    startIndex = index + query.length;
  }

  return matches;
}
interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: 'doc' | 'blog' | 'tool' | 'link';
  score: number;
  highlights?: {
    title?: string;
    content?: string[];
  };
}

// 递归读取目录下的所有 .md 和 .mdx 文件
async function getAllFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dirPath, entry.name);
      return entry.isDirectory() ? getAllFiles(res) : res;
    })
  );
  return files.flat().filter((file) => /\.(md|mdx)$/.test(file));
}

async function searchDocs(query: string): Promise<SearchResult[]> {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  const files = await getAllFiles(docsDir);
  const results: SearchResult[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data, content: markdown } = matter(content);
    const relativePath = path.relative(docsDir, file);
    const url = `/docs/${relativePath.replace(/\.(md|mdx)$/, '')}`;

    let score = 0;
    const highlights: { title?: string; content?: string[] } = {};

    // 搜索标题
    if (data.title?.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
      highlights.title = highlightText(data.title, query);
    }

    // 搜索描述
    if (data.description?.toLowerCase().includes(query.toLowerCase())) {
      score += 5;
    }

    // 搜索内容
    const contentMatches = findContentMatches(markdown, query);
    if (contentMatches.length > 0) {
      score += contentMatches.length;
      highlights.content = contentMatches;
    }

    if (score > 0) {
      results.push({
        title: data.title || '',
        path: url,
        excerpt: data.description || markdown.slice(0, 160) + '...',
        type: 'doc',
        score,
        highlights,
      });
    }
  }

  return results;
}

async function searchBlog(query: string): Promise<SearchResult[]> {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const files = await getAllFiles(blogDir);
  const results: SearchResult[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data, content: markdown } = matter(content);
    const relativePath = path.relative(blogDir, file);
    const url = `/blog/${relativePath.replace(/\.(md|mdx)$/, '')}`;

    let score = 0;
    const highlights: { title?: string; content?: string[] } = {};

    // 搜索标题
    if (data.title?.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
      highlights.title = highlightText(data.title, query);
    }

    // 搜索描述
    if (data.description?.toLowerCase().includes(query.toLowerCase())) {
      score += 5;
    }

    // 搜索标签
    if (data.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) {
      score += 3;
    }

    // 搜索内容
    const contentMatches = findContentMatches(markdown, query);
    if (contentMatches.length > 0) {
      score += contentMatches.length;
      highlights.content = contentMatches;
    }

    if (score > 0) {
      results.push({
        title: data.title || '',
        path: url,
        excerpt: data.description || markdown.slice(0, 160) + '...',
        type: 'blog',
        score,
        highlights,
      });
    }
  }

  return results;
}

function searchTools(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const tool of TOOLS) {
    let score = 0;
    const highlights: { title?: string; content?: string[] } = {};

    // 搜索名称
    if (tool.name.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
      highlights.title = highlightText(tool.name, query);
    }

    // 搜索描述
    if (tool.description.toLowerCase().includes(query.toLowerCase())) {
      score += 5;
      highlights.content = [highlightText(tool.description, query)];
    }

    // 搜索标签
    if (tool.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) {
      score += 3;
    }

    if (score > 0) {
      results.push({
        title: tool.name,
        path: tool.path,
        excerpt: tool.description,
        type: 'tool',
        score,
        highlights,
      });
    }
  }

  return results;
}

function searchLinks(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const item of links.items) {
    let score = 0;
    const highlights: { title?: string; content?: string[] } = {};

    // 搜索标题
    if (item.title.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
      highlights.title = highlightText(item.title, query);
    }

    // 搜索描述
    if (item.description.toLowerCase().includes(query.toLowerCase())) {
      score += 5;
      highlights.content = [highlightText(item.description, query)];
    }

    // 搜索标签
    if (item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) {
      score += 3;
    }

    if (score > 0) {
      results.push({
        title: item.title,
        path: item.url,
        excerpt: item.description,
        type: 'link',
        score,
        highlights,
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    let results: SearchResult[] = [];

    // 根据类型参数决定搜索范围
    if (!type || type === 'doc') {
      results = results.concat(await searchDocs(query));
    }
    if (!type || type === 'blog') {
      results = results.concat(await searchBlog(query));
    }
    if (!type || type === 'tool') {
      results = results.concat(searchTools(query));
    }
    if (!type || type === 'link') {
      results = results.concat(searchLinks(query));
    }

    // 按分数排序并限制结果数量
    results = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      // 确保保留 score 属性
      .map((result) => ({
        ...result,
      }));

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
