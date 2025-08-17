import React from "react";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/features/content";
import { createDocBreadcrumbsServer } from "@/features/docs/lib";
import { ContentDisplay, DocPagination } from "@/features/content";
import { DocsSidebarWrapper } from "@/features/docs/components";
import { TableOfContentsCard } from "@/features/content";

import { AppGrid } from "@/features/layout";
import type { DocContentResult } from "@/features/docs/types";
import ClientMDXRenderer from "@/components/mdx/ClientMDXRenderer";
import { TwikooComment } from "@/features/comment";

type DocPageParams = {
  slug: string[];
};

// 文件顶部只保留一处 import fs 和 import path
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFlattenedDocsOrder } from "@/features/docs/lib";
import { extractHeadings } from "@/features/content";
import {
  resolveDocumentPath,
  getAllDocsStructure,
} from "@/features/docs/components";
// ====== 迁移自 src/utils/text.ts ======
/**
 * 计算文本中的字数
 *
 * @param text 要计算字数的文本
 * @returns 字数统计
 */
function countWords(text: string): number {
  // 移除 Markdown 语法和 HTML 标签
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]*`/g, "") // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换链接为链接文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换图片为图片描述
    .replace(/<[^>]*>/g, "") // 移除 HTML 标签
    .replace(/[#*_~>|-]/g, "") // 移除 Markdown 标记符号
    .replace(/\s+/g, " ") // 将多个空白字符替换为单个空格
    .trim();

  // 中文字符计数
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];

  // 英文单词计数（简单的按空格分割）
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, "") // 移除中文字符
    .split(/\s+/)
    .filter((word) => word.length > 0);

  // 返回中文字符数和英文单词数之和
  return chineseChars.length + englishWords.length;
}
// ====== END ======
// 修复 Prettier 格式错误，将多行类型 import 改为单行
import type { DocFrontmatter, NavDocItem } from "@/features/docs/types";
const DOCS_CONTENT_DIR = "src/content/docs";
const DOCS_INDEX_FILES = ["index.mdx", "index.md"];

// ===== 迁移自 src/lib/content/utils.ts =====

interface ScanOptions {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}

const scanContentDirectory = (options: ScanOptions): { slug: string[] }[] => {
  const {
    contentDir,
    indexFiles = ["index.mdx", "index.md"],
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter = () => true,
  } = options;

  const paths: { slug: string[] }[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (item.name.startsWith(excludePrefix)) continue;

        const newSlug = [...currentSlug, item.name];
        let hasIndex = false;

        for (const indexFile of indexFiles) {
          const indexPath = path.join(itemPath, indexFile);
          if (fs.existsSync(indexPath) && filter(indexPath)) {
            paths.push({ slug: newSlug });
            hasIndex = true;
            break;
          }
        }

        if (!hasIndex) {
          scan(itemPath, newSlug);
        }
      } else if (
        item.isFile() &&
        extensions.some((ext) => item.name.endsWith(ext)) &&
        !item.name.startsWith(excludePrefix) &&
        !indexFiles.includes(item.name) &&
        filter(itemPath)
      ) {
        const fileName = item.name.replace(
          new RegExp(`(${extensions.join("|")})$`),
          "",
        );
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }

  scan(contentDir);
  return paths;
};

// ===== 优化的静态路径生成 =====

// 文档结构缓存，避免重复扫描
let docsStructureCache: { slug: string[] }[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

// 性能监控
const performanceMetrics = {
  pathGenerationTime: 0,
  cacheHits: 0,
  cacheMisses: 0,
  totalPaths: 0,
};

/**
 * 从全局文档结构中提取所有文档路径
 * 使用 getAllDocsStructure 函数获取完整的路径列表
 */
const generateDocPathsFromStructure = (): { slug: string[] }[] => {
  const paths: { slug: string[] }[] = [];
  const seenPaths = new Set<string>(); // 防止重复路径

  try {
    // 使用 getAllDocsStructure 获取完整结构
    const structure = getAllDocsStructure();

    if (!structure || !structure.categories) {
      throw new Error("Invalid structure returned from getAllDocsStructure");
    }

    // 递归提取所有文档路径
    function extractPaths(items: any[], categoryPrefix: string[] = []) {
      if (!Array.isArray(items)) return;

      for (const item of items) {
        try {
          if (item.type === "page" && item.href) {
            // 从 href 中提取路径段
            const href = item.href.replace(/^\/docs\//, "");
            if (href && !seenPaths.has(href)) {
              const slugParts = href.split("/").filter(Boolean); // 过滤空字符串
              if (slugParts.length > 0) {
                paths.push({ slug: slugParts });
                seenPaths.add(href);
              }
            }
          }

          // 如果是目录且有子项，递归处理
          if (item.items && Array.isArray(item.items)) {
            extractPaths(item.items, categoryPrefix);
          }
        } catch (itemError) {
          console.warn(`Error processing item:`, item, itemError);
          continue; // 跳过有问题的项目，继续处理其他项目
        }
      }
    }

    // 处理每个分类
    for (const category of structure.categories) {
      try {
        // 如果分类有 index 文件，添加分类路径
        if (category.hasIndex && category.id && !seenPaths.has(category.id)) {
          paths.push({ slug: [category.id] });
          seenPaths.add(category.id);
        }

        // 提取分类下的所有文档路径
        if (category.docs && Array.isArray(category.docs)) {
          extractPaths(category.docs, [category.id]);
        }
      } catch (categoryError) {
        console.warn(`Error processing category:`, category.id, categoryError);
        continue; // 跳过有问题的分类，继续处理其他分类
      }
    }

    // 验证生成的路径
    const validPaths = paths.filter(({ slug }) => {
      return (
        slug &&
        Array.isArray(slug) &&
        slug.length > 0 &&
        slug.every(
          (segment) => typeof segment === "string" && segment.length > 0,
        )
      );
    });

    if (validPaths.length !== paths.length) {
      console.warn(
        `Filtered out ${paths.length - validPaths.length} invalid paths`,
      );
    }

    return validPaths;
  } catch (error) {
    console.warn(
      "Failed to generate paths from structure, falling back to directory scan:",
      error,
    );
    // 回退到原有的目录扫描方式
    try {
      return scanContentDirectory({
        contentDir: path.join(process.cwd(), "src", "content", "docs"),
        excludePrefix: "_",
      });
    } catch (fallbackError) {
      console.error("Fallback directory scan also failed:", fallbackError);
      return []; // 返回空数组，让 Next.js 在运行时生成页面
    }
  }
};

/**
 * 优化的文档路径生成函数，支持缓存和性能监控
 */
const generateDocPaths = (): { slug: string[] }[] => {
  const startTime = Date.now();
  const now = Date.now();

  // 检查缓存是否有效
  if (docsStructureCache && now - cacheTimestamp < CACHE_TTL) {
    performanceMetrics.cacheHits++;
    return docsStructureCache;
  }

  performanceMetrics.cacheMisses++;

  // 生成新的路径列表
  const paths = generateDocPathsFromStructure();

  // 更新缓存
  docsStructureCache = paths;
  cacheTimestamp = now;

  // 更新性能指标
  performanceMetrics.pathGenerationTime = Date.now() - startTime;
  performanceMetrics.totalPaths = paths.length;

  // 在开发环境下输出性能信息
  if (process.env.NODE_ENV === "development") {
    console.log("Doc paths generation metrics:", {
      generationTime: `${performanceMetrics.pathGenerationTime}ms`,
      totalPaths: performanceMetrics.totalPaths,
      cacheHits: performanceMetrics.cacheHits,
      cacheMisses: performanceMetrics.cacheMisses,
    });
  }

  return paths;
};

// ===== 文档内容缓存 =====

// 文档内容缓存，避免重复读取和解析
const docContentCache = new Map<string, DocContentResult>();
const docCacheTimestamp = new Map<string, number>();
const DOC_CACHE_TTL = 10 * 60 * 1000; // 10分钟缓存
const MAX_CACHE_SIZE = 500; // 最大缓存条目数，避免内存溢出

/**
 * 清理过期的缓存条目
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

  // 如果缓存仍然太大，删除最旧的条目
  if (docContentCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(docCacheTimestamp.entries()).sort(
      ([, a], [, b]) => a - b,
    );

    const toDelete = sortedEntries.slice(
      0,
      sortedEntries.length - MAX_CACHE_SIZE,
    );
    for (const [key] of toDelete) {
      docContentCache.delete(key);
      docCacheTimestamp.delete(key);
    }
  }
}

/**
 * 优化的文档内容获取函数，支持缓存和性能优化
 */
function getDocContent(slug: string[]): DocContentResult {
  const requestedPath = slug.join("/");
  const cacheKey = requestedPath;
  const now = Date.now();

  // 检查缓存是否有效（仅在生产环境使用缓存）
  if (process.env.NODE_ENV === "production") {
    const cachedContent = docContentCache.get(cacheKey);
    const cacheTime = docCacheTimestamp.get(cacheKey);

    if (cachedContent && cacheTime && now - cacheTime < DOC_CACHE_TTL) {
      return cachedContent;
    }
  }

  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join("/");
  let isIndexPage = false;

  if (
    fs.existsSync(absoluteRequestedPath) &&
    fs.statSync(absoluteRequestedPath).isDirectory()
  ) {
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absoluteRequestedPath, indexFile);
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
        isIndexPage = true;
        break;
      }
    }
    if (!filePath) {
      const dirSpecificFlattenedDocs = getFlattenedDocsOrder(requestedPath);
      if (dirSpecificFlattenedDocs.length > 0) {
        const firstDocRelativePath = dirSpecificFlattenedDocs[0].path.replace(
          /^\/docs\//,
          "",
        );
        filePath = path.join(docsContentDir, `${firstDocRelativePath}.mdx`);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(docsContentDir, `${firstDocRelativePath}.md`);
        }
        actualSlugForNav = firstDocRelativePath;
      }
    }
  }

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
    actualSlugForNav = slug.join("/");
    isIndexPage =
      path.basename(filePath || "", path.extname(filePath || "")) === "index";
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Document not found at path: ${requestedPath}`);
  }
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const wordCount = countWords(originalContent);
  const { headings } = extractHeadings(originalContent);
  const mdxContent = originalContent; // 页面层负责渲染
  const topLevelCategorySlug = slug[0];
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, "/")
    .replace(/\.(mdx|md)$/, "");
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null;
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc =
      flattenedDocs.find(
        (doc) =>
          doc.path.startsWith(indexDirNavPath + "/") ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes("/")),
      ) || null;
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(
      (doc) => doc.path === currentNavPath,
    );
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc =
        currentIndex < flattenedDocs.length - 1
          ? flattenedDocs[currentIndex + 1]
          : null;
    }
  }

  // breadcrumbs 由页面层负责生成

  const result: DocContentResult = {
    title: frontmatter.title || path.basename(filePath, path.extname(filePath)),
    content: originalContent,
    frontmatter: frontmatter as DocFrontmatter,
    headings,
    prevDoc,
    nextDoc,
    breadcrumbs: [], // 页面层生成
    mdxContent,
    wordCount,
    date,
    relativePathFromTopCategory,
    topLevelCategorySlug,
    isIndexPage,
  };

  // 更新缓存（仅在生产环境）
  if (process.env.NODE_ENV === "production") {
    docContentCache.set(requestedPath, result);
    docCacheTimestamp.set(requestedPath, Date.now());

    // 定期清理过期缓存
    if (docContentCache.size > MAX_CACHE_SIZE * 0.8) {
      cleanupExpiredCache();
    }
  }

  return result;
}

// ===== 优化的静态生成配置 =====

/**
 * 生成静态路径 - 优化版本
 * 使用 getAllDocsStructure 函数获取完整的路径列表
 * 实现文档结构缓存以提高构建性能
 */
export async function generateStaticParams() {
  try {
    const paths = generateDocPaths();

    // 在开发环境下输出路径统计信息
    if (process.env.NODE_ENV === "development") {
      console.log(`Generated ${paths.length} static paths for docs`);
    }

    return paths;
  } catch (error) {
    console.error("Error generating static params for docs:", error);
    // 返回空数组，让 Next.js 在运行时生成页面
    return [];
  }
}

/**
 * 启用增量静态再生 (ISR)
 * 当文档内容更新时，系统能够增量重新生成相关页面
 */
export const revalidate = 3600; // 1小时重新验证一次

/**
 * 启用动态路径生成
 * 对于未在 generateStaticParams 中预生成的路径，允许动态生成
 */
export const dynamicParams = true;

export default async function DocPage({
  params,
}: {
  params: Promise<DocPageParams>;
}) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug
    : [resolvedParams.slug];

  try {
    // 使用 resolveDocumentPath 进行路径解析和重定向处理
    const pathResolution = resolveDocumentPath(slug);

    // 处理重定向情况
    if (pathResolution.type === "redirect" && pathResolution.redirectTo) {
      // 重定向循环检测：检查是否重定向到自身
      const currentPath = `/docs/${slug.join("/")}`;
      if (pathResolution.redirectTo === currentPath) {
        console.error(
          `Redirect loop detected: ${currentPath} -> ${pathResolution.redirectTo}`,
        );
        notFound();
      }
      redirect(pathResolution.redirectTo);
    }

    // 处理未找到的情况
    if (pathResolution.type === "notfound") {
      notFound();
    }

    const doc: DocContentResult = getDocContent(slug);

    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <AppGrid columns={5} gap="large">
            {/* 左侧边栏 - 全局文档导航 */}
            <aside className="hide-scrollbar sticky top-20 col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:block">
              <div className="space-y-4">
                <DocsSidebarWrapper currentDoc={`/docs/${slug.join("/")}`} />
              </div>
            </aside>

            {/* 主内容区 - 占3列 */}
            <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
              <ContentDisplay
                contentType="docs"
                title={doc.frontmatter.title}
                date={doc.date}
                wordCount={doc.wordCount}
              >
                <ClientMDXRenderer content={doc.content} />
              </ContentDisplay>
              <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />
              <TwikooComment />
            </main>

            {/* 右侧边栏 - TOC */}
            <aside className="sticky top-[80px] col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto xl:block">
              <div className="space-y-4">
                <TableOfContentsCard
                  headings={doc.headings}
                  className="prose-sm"
                />
              </div>
            </aside>
          </AppGrid>
        </div>
      </div>
    );
  } catch (error) {
    // 增强 404 错误处理，记录错误信息用于调试
    console.error(
      `Error loading document at path: /docs/${slug.join("/")}`,
      error,
    );
    notFound();
  }
}
