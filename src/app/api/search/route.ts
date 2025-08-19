import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loadAllCategoriesData } from '@/features/links/lib/categories';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'fast-glob';
import matter from 'gray-matter';

interface SearchResult {
  type: 'link' | 'blog' | 'doc';
  title: string;
  description?: string;
  url?: string;
  path?: string;
  tags?: string[];
}

interface LinkItem {
  title: string;
  description?: string;
  url?: string;
  tags?: string[];
}

// 内存缓存
let cache: {
  blogs: SearchResult[];
  docs: SearchResult[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

async function scanContentFiles(contentType: 'blog' | 'docs') {
  const basePath = path.join(process.cwd(), `src/content/${contentType}`);
  const files = await glob('**/*.mdx', { cwd: basePath });

  const results: SearchResult[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(basePath, file);
      const content = await fs.readFile(filePath, 'utf-8');

      try {
        const { data: frontmatter } = matter(content);
        if (frontmatter?.title && typeof frontmatter.title === 'string') {
          results.push({
            type: contentType === 'blog' ? 'blog' : 'doc',
            title: frontmatter.title,
            description:
              typeof frontmatter.description === 'string' ? frontmatter.description : undefined,
            path: `/${contentType}/${file.replace(/\.mdx$/, '')}`,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : undefined,
          });
        }
      } catch {
        // Skip files with invalid frontmatter format
        continue;
      }
    } catch {
      // Skip files that cannot be read
      continue;
    }
  }

  return results;
}

async function getCachedContent() {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache;
  }

  const [blogs, docs] = await Promise.all([scanContentFiles('blog'), scanContentFiles('docs')]);

  cache = { blogs, docs, timestamp: now };
  return cache;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';
    const type = searchParams.get('type') ?? 'all';

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const { blogs, docs } = await getCachedContent();
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    // 搜索链接
    if (type === 'all' || type === 'links') {
      const links = await loadAllCategoriesData();
      const linkResults = links
        .filter((item: LinkItem) => {
          const searchText =
            `${item.title} ${item.description} ${item.tags?.join(' ')}`.toLowerCase();
          return searchText.includes(queryLower);
        })
        .map((item: LinkItem) => ({
          type: 'link' as const,
          title: item.title,
          description: item.description,
          url: item.url,
          tags: item.tags,
        }))
        .slice(0, 5);

      results.push(...linkResults);
    }

    // 搜索博客
    if (type === 'all' || type === 'blog') {
      const blogResults = blogs
        .filter(post => {
          const searchText =
            `${post.title} ${post.description} ${post.tags?.join(' ')}`.toLowerCase();
          return searchText.includes(queryLower);
        })
        .slice(0, 5);

      results.push(...blogResults);
    }

    // 搜索文档
    if (type === 'all' || type === 'doc') {
      const docResults = docs
        .filter(doc => {
          const searchText = `${doc.title} ${doc.description}`.toLowerCase();
          return searchText.includes(queryLower);
        })
        .slice(0, 5);

      results.push(...docResults);
    }

    // 按匹配度排序
    results.sort((a, b) => {
      const aScore = a.title.toLowerCase().includes(queryLower) ? 1 : 0;
      const bScore = b.title.toLowerCase().includes(queryLower) ? 1 : 0;
      return bScore - aScore;
    });

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
