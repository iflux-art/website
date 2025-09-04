import fs from "node:fs";
import path from "node:path";
import type { DocContentResult, NavDocItem } from "@/features/docs/types";
import { extractHeadings } from "@/features/content/lib";
import matter from "gray-matter";
import { getFlattenedDocsOrder } from "./doc-paths";
import { countWords } from "./word-count";

const DOCS_CONTENT_DIR = "src/content/docs";
const DOCS_INDEX_FILES = ["index.mdx", "index.md"];
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
    const sortedEntries = [...docCacheTimestamp.entries()].sort((a, b) => a[1] - b[1]);
    // 修复：添加边界检查
    if (sortedEntries.length > 0 && sortedEntries[0]) {
      const oldestKey = sortedEntries[0][0];
      if (oldestKey) {
        docContentCache.delete(oldestKey);
        docCacheTimestamp.delete(oldestKey);
      }
    }
  }
}

/**
 * 检查是否为index页面并获取文件路径
 */
function findIndexFilePath(absoluteRequestedPath: string): string | undefined {
  if (fs.existsSync(absoluteRequestedPath) && fs.statSync(absoluteRequestedPath).isDirectory()) {
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absoluteRequestedPath, indexFile);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
  }
  return undefined;
}

/**
 * 获取直接文件路径
 */
function findDirectFilePath(absoluteRequestedPath: string): string | undefined {
  const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
  if (fs.existsSync(possiblePathMdx)) {
    return possiblePathMdx;
  }

  const possiblePathMd = `${absoluteRequestedPath}.md`;
  if (fs.existsSync(possiblePathMd)) {
    return possiblePathMd;
  }

  return undefined;
}

/**
 * 获取文档文件路径
 */
function getDocumentFilePath(absoluteRequestedPath: string): {
  filePath: string;
  isIndexPage: boolean;
} {
  // 检查是否是目录下的index文件
  const indexFilePath = findIndexFilePath(absoluteRequestedPath);
  if (indexFilePath) {
    return { filePath: indexFilePath, isIndexPage: true };
  }

  // 检查是否是直接的文件路径
  const directFilePath = findDirectFilePath(absoluteRequestedPath);
  if (directFilePath) {
    return { filePath: directFilePath, isIndexPage: false };
  }

  throw new Error(`Document not found at path: ${path.basename(absoluteRequestedPath)}`);
}

/**
 * 格式化日期
 */
function formatDate(dateValue: string | number | Date | undefined): string | null {
  if (!dateValue) return null;

  return new Date(dateValue).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 获取导航文档
 */
function getNavigationDocs(
  isIndexPage: boolean,
  actualSlugForNav: string,
  flattenedDocs: NavDocItem[]
): { prevDoc: NavDocItem | null; nextDoc: NavDocItem | null } {
  if (isIndexPage) {
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    const nextDoc =
      flattenedDocs.find(
        doc =>
          doc.path.startsWith(`${indexDirNavPath}/`) ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes("/"))
      ) ?? null;

    return { prevDoc: null, nextDoc };
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(doc => doc.path === currentNavPath);

    if (currentIndex === -1) {
      return { prevDoc: null, nextDoc: null };
    }

    const prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
    const nextDoc =
      currentIndex < flattenedDocs.length - 1 ? flattenedDocs[currentIndex + 1] : null;

    // 修复：确保返回值符合类型要求
    return {
      prevDoc: prevDoc !== undefined ? prevDoc : null,
      nextDoc: nextDoc !== undefined ? nextDoc : null,
    };
  }
}

/**
 * 获取文档内容
 * @param slug 文档路径数组
 * @returns 文档内容结果
 */
export function getDocContent(slug: string[]): DocContentResult {
  const requestedPath = slug.join("/");
  const cacheKey = requestedPath;
  const now = Date.now();

  // 生产环境使用缓存
  if (process.env.NODE_ENV === "production") {
    if (docContentCache.has(cacheKey) && docCacheTimestamp.has(cacheKey)) {
      const timestamp = docCacheTimestamp.get(cacheKey);
      if (timestamp && now - timestamp < DOC_CACHE_TTL) {
        const cachedContent = docContentCache.get(cacheKey);
        if (cachedContent) {
          return cachedContent;
        }
      }
    }
  }

  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);
  const actualSlugForNav = slug.join("/");

  const { filePath, isIndexPage } = getDocumentFilePath(absoluteRequestedPath);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  const date = formatDate(frontmatter.date as string | number | Date | undefined);
  const updatedAt = formatDate(frontmatter.update as string | number | Date | undefined);

  const wordCount = countWords(originalContent);
  const { headings } = extractHeadings(originalContent);
  // 修复：添加空值检查并提供默认值
  const topLevelCategorySlug = slug[0] ?? "";
  // 修复：添加空值检查
  const flattenedDocs = topLevelCategorySlug ? getFlattenedDocsOrder(topLevelCategorySlug) : [];
  const { prevDoc, nextDoc } = getNavigationDocs(isIndexPage, actualSlugForNav, flattenedDocs);

  const result: DocContentResult = {
    title: (frontmatter.title ?? path.basename(filePath, path.extname(filePath))) as string,
    content: originalContent,
    frontmatter: {
      title: frontmatter.title as string,
      description: frontmatter.description as string | undefined,
      date: frontmatter.date
        ? new Date(frontmatter.date as string | number | Date).toISOString()
        : undefined,
      update: frontmatter.update
        ? new Date(frontmatter.update as string | number | Date).toISOString()
        : undefined,
      tags: frontmatter.tags as string[] | undefined,
      toc: frontmatter.toc as boolean | undefined,
    },
    headings,
    // 修复：添加空值检查
    prevDoc: prevDoc ?? null,
    nextDoc: nextDoc ?? null,
    breadcrumbs: [],
    mdxContent: originalContent,
    wordCount,
    date,
    update: updatedAt,
    relativePathFromTopCategory: topLevelCategorySlug
      ? path
          .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
          .replace(/\\/g, "/")
          .replace(/\.(mdx|md)$/, "")
      : "",
    // 修复：添加空值检查
    topLevelCategorySlug: topLevelCategorySlug ?? "",
    isIndexPage,
  };

  // 生产环境缓存结果
  if (process.env.NODE_ENV === "production") {
    docContentCache.set(cacheKey, result);
    docCacheTimestamp.set(cacheKey, now);
    cleanupExpiredCache();
  }

  return result;
}
