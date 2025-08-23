import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { countWords } from './word-count';
import { getFlattenedDocsOrder } from './doc-paths';
import { extractHeadings } from '@/features/content';
import type { NavDocItem, DocContentResult } from '@/features/docs/types';

const DOCS_CONTENT_DIR = 'src/content/docs';
const DOCS_INDEX_FILES = ['index.mdx', 'index.md'];
const DOC_CACHE_TTL = 10 * 60 * 1000; // 10分钟缓存
const MAX_CACHE_SIZE = 500; // 最大缓存条目数

const docContentCache = new Map<string, DocContentResult>();
const docCacheTimestamp = new Map<string, number>();

/**
 * 清理过期的缓存
 */
function cleanupExpiredCache() {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [key, timestamp] of docCacheTimestamp.entries()) {
    if (now - timestamp > DOC_CACHE_TTL) {
      expiredKeys.push(key);
    }
  }

  for (const key of expiredKeys) {
    docContentCache.delete(key);
    docCacheTimestamp.delete(key);
  }

  // 如果缓存大小超过限制，清理最早的缓存
  if (docContentCache.size > MAX_CACHE_SIZE) {
    const oldestKey = [...docCacheTimestamp.entries()].sort((a, b) => a[1] - b[1])[0][0];
    docContentCache.delete(oldestKey);
    docCacheTimestamp.delete(oldestKey);
  }
}

/**
 * 获取文档内容
 * @param slug 文档路径数组
 * @returns 文档内容结果
 */
export function getDocContent(slug: string[]): DocContentResult {
  const requestedPath = slug.join('/');
  const cacheKey = requestedPath;
  const now = Date.now();

  // 生产环境使用缓存
  if (process.env.NODE_ENV === 'production') {
    if (docContentCache.has(cacheKey) && docCacheTimestamp.has(cacheKey)) {
      const timestamp = docCacheTimestamp.get(cacheKey)!;
      if (now - timestamp < DOC_CACHE_TTL) {
        return docContentCache.get(cacheKey)!;
      }
    }
  }

  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join('/');
  let isIndexPage = false;

  // 检查是否是目录下的index文件
  if (fs.existsSync(absoluteRequestedPath) && fs.statSync(absoluteRequestedPath).isDirectory()) {
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absoluteRequestedPath, indexFile);
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
        isIndexPage = true;
        break;
      }
    }
  }

  // 检查是否是直接的文件路径
  if (!filePath) {
    const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
    if (fs.existsSync(possiblePathMdx)) {
      filePath = possiblePathMdx;
    } else {
      const possiblePathMd = `${absoluteRequestedPath}.md`;
      if (fs.existsSync(possiblePathMd)) {
        filePath = possiblePathMd;
      }
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Document not found at path: ${requestedPath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  const date = frontmatter.date
    ? new Date((frontmatter.date as string | number | Date) ?? '').toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const wordCount = countWords(originalContent);
  const { headings } = extractHeadings(originalContent);
  const topLevelCategorySlug = slug[0];
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null;
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc =
      flattenedDocs.find(
        doc =>
          doc.path.startsWith(indexDirNavPath + '/') ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes('/'))
      ) ?? null;
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(doc => doc.path === currentNavPath);
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc = currentIndex < flattenedDocs.length - 1 ? flattenedDocs[currentIndex + 1] : null;
    }
  }

  const result: DocContentResult = {
    title: (frontmatter.title ?? path.basename(filePath, path.extname(filePath))) as string,
    content: originalContent,
    frontmatter: {
      title: frontmatter.title as string,
      description: frontmatter.description as string | undefined,
      date: frontmatter.date
        ? new Date(frontmatter.date as string | number | Date).toISOString()
        : undefined,
      tags: frontmatter.tags as string[] | undefined,
      toc: frontmatter.toc as boolean | undefined,
    },
    headings,
    prevDoc,
    nextDoc,
    breadcrumbs: [],
    mdxContent: originalContent,
    wordCount,
    date,
    relativePathFromTopCategory: path
      .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
      .replace(/\\/g, '/')
      .replace(/\.(mdx|md)$/, ''),
    topLevelCategorySlug,
    isIndexPage,
  };

  // 生产环境缓存结果
  if (process.env.NODE_ENV === 'production') {
    docContentCache.set(cacheKey, result);
    docCacheTimestamp.set(cacheKey, now);
    cleanupExpiredCache();
  }

  return result;
}
