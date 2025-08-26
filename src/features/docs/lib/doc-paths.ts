import fs from "node:fs";
import path from "node:path";
import { getAllDocsStructure } from "@/features/docs/components";
import type { NavDocItem, SidebarItem } from "@/features/docs/types";
import { getDocSidebar } from "./index";

interface ScanOptions {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}

const DOCS_INDEX_FILES = ["index.mdx", "index.md"];
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

let docsStructureCache: { slug: string[] }[] | null = null;
let cacheTimestamp = 0;

const performanceMetrics = {
  pathGenerationTime: 0,
  cacheHits: 0,
  cacheMisses: 0,
  totalPaths: 0,
};

/**
 * 扫描文档目录结构
 */
export const scanContentDirectory = (options: ScanOptions): { slug: string[] }[] => {
  const {
    contentDir,
    indexFiles = DOCS_INDEX_FILES,
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter,
  } = options;

  const paths: { slug: string[] }[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      if (item.startsWith(excludePrefix)) continue;

      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scan(itemPath, [...currentSlug, item]);
      } else if (extensions.includes(path.extname(item))) {
        if (filter && !filter(itemPath)) continue;
        if (indexFiles.includes(item)) continue;

        const slug = [...currentSlug, item.replace(/\.(mdx|md)$/, "")];
        paths.push({ slug });
      }
    }
  }

  scan(contentDir);
  return paths;
};

/**
 * 从文档结构生成路径
 */
export const generateDocPathsFromStructure = (): { slug: string[] }[] => {
  const paths: { slug: string[] }[] = [];
  const seenPaths = new Set<string>();

  try {
    const structure = getAllDocsStructure();
    if (!structure?.categories) return [];

    function traverse(items: SidebarItem[], currentSlug: string[] = []) {
      if (!(items && Array.isArray(items))) {
        return;
      }

      for (const item of items) {
        if (item.type === "menu" && item.items && item.items.length > 0) {
          traverse(item.items, [...currentSlug, item.title]);
        } else if (item.type === "page") {
          const pathKey = [...currentSlug, item.title].join("/");
          if (!seenPaths.has(pathKey)) {
            seenPaths.add(pathKey);
            paths.push({ slug: [...currentSlug, item.title] });
          }
        }
      }
    }

    // 遍历所有分类
    for (const category of structure.categories) {
      if (category.docs) {
        traverse(category.docs, [category.id]);
      }
    }

    return paths;
  } catch (error) {
    console.error("Error generating doc paths from structure:", error);
    return [];
  }
};

/**
 * 生成文档路径(带缓存)
 */
export const generateDocPaths = (): { slug: string[] }[] => {
  const startTime = Date.now();
  const now = Date.now();

  if (docsStructureCache && now - cacheTimestamp < CACHE_TTL) {
    performanceMetrics.cacheHits++;
    return docsStructureCache;
  }

  performanceMetrics.cacheMisses++;
  const paths = generateDocPathsFromStructure();

  docsStructureCache = paths;
  cacheTimestamp = now;
  performanceMetrics.pathGenerationTime = Date.now() - startTime;
  performanceMetrics.totalPaths = paths.length;

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `Generated ${paths.length} doc paths in ${performanceMetrics.pathGenerationTime}ms`
    );
  }

  return paths;
};

/**
 * 检查是否为有效的导航项
 */
function isValidNavigationItem(item: SidebarItem): boolean {
  return item.type !== "separator" && !item.isExternal && !!item.href;
}

/**
 * 标准化路径
 */
function normalizeItemPath(item: SidebarItem, topLevelCategory: string): string {
  let itemPath = item.href;
  if (!itemPath) {
    return "";
  }
  if (!itemPath.startsWith("/docs/")) {
    // This case should ideally not happen if hrefs from getDocDirectoryStructure are well-formed
    itemPath = `/docs/${topLevelCategory}/${itemPath.replace(/^\//, "")}`;
  }
  return itemPath.replace(/\\/g, "/");
}

/**
 * 检查是否为index页面
 */
function isIndexPage(itemPath: string): boolean {
  return itemPath.endsWith("/index");
}

/**
 * 处理单个导航项
 */
function processNavigationItem(
  item: SidebarItem,
  topLevelCategory: string,
  flatList: NavDocItem[]
): void {
  if (!isValidNavigationItem(item)) {
    // Skip separators, external links, or items without href for navigation list
    // However, if a menu item (category) has an href, it might be a link to its own overview page (not index.mdx)
    // and its children should still be processed.
    if (item.items && item.items.length > 0) {
      recurseNavigationItems(item.items, topLevelCategory, flatList);
    }
    return;
  }

  // Process page items and menu items that are also pages
  if (item.type === "page" || (item.type === "menu" && item.href)) {
    const itemPath = normalizeItemPath(item, topLevelCategory);

    // Ensure it's not an accidental link to an index page that should be hidden from prev/next
    // (getDocDirectoryStructure already filters index.mdx from items for sidebar)
    // This check might be redundant if getDocDirectoryStructure is perfect.
    if (!isIndexPage(itemPath)) {
      flatList.push({ title: item.title, path: itemPath });
    }
  }

  // Recursively process children of a menu
  if (item.items && item.items.length > 0 && item.type === "menu") {
    recurseNavigationItems(item.items, topLevelCategory, flatList);
  }
}

/**
 * 递归处理导航项列表
 */
function recurseNavigationItems(
  items: SidebarItem[],
  topLevelCategory: string,
  flatList: NavDocItem[]
): void {
  if (!(items && Array.isArray(items))) {
    return;
  }

  for (const item of items) {
    processNavigationItem(item, topLevelCategory, flatList);
  }
}

/**
 * 获取扁平化的文档顺序
 * @param topLevelCategory 顶级分类
 * @returns 扁平化的文档项目列表
 */
export function getFlattenedDocsOrder(topLevelCategory: string): NavDocItem[] {
  const sidebarItems = getDocSidebar(topLevelCategory);
  const flatList: NavDocItem[] = [];

  recurseNavigationItems(sidebarItems, topLevelCategory, flatList);
  return flatList;
}
