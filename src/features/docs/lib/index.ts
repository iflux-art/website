/**
 * 文档相关工具函数
 */

import fs from "node:fs";
import path from "node:path";
import type {
  DocCategory,
  DocContentResult,
  DocListItem,
  NavDocItem,
  SidebarItem,
} from "@/features/docs/types";
import type { BreadcrumbItem } from "@/features/navbar/types";
import { sync as globSync } from "glob";
import matter from "gray-matter";
import { getDocContent } from "./doc-content";
import { generateDocPaths } from "./doc-paths";

// 导出路径解析工具函数
export {
  isValidDocPath,
  resolveDocPath,
  isRedirectLoop,
  normalizeDocPath,
  type PathResolutionResult,
} from "./doc-path-resolver";

// 从全局helpers导出字数统计函数
export { countWords } from "./word-count";

interface DocMetaItem {
  title: string;
  path?: string;
  description?: string;
  category?: string;
  href?: URL;
  collapsed?: boolean;
  items?: string[] | Record<string, DocMetaItem | string>;
  type?: "separator" | "page" | "menu";
  display?: "hidden" | "normal";
  order?: number;
  index?: boolean;
  hidden?: boolean;
}

/**
 * 从meta配置中获取标题
 */
function getTitleFromMeta(meta: Record<string, unknown>, key: string): string | null {
  // 修复：添加空值检查
  if (
    meta[key] &&
    typeof meta[key] === "object" &&
    meta[key] !== null &&
    "title" in meta[key] &&
    meta[key].title
  ) {
    return meta[key].title as string;
  }
  return null;
}

/**
 * 获取目录 title（优先 _meta.json 的 title 字段，没有则 fallback slug）
 */
export function getDirectoryTitle(dirSlug: string[]): string {
  const docsDir = path.join(process.cwd(), "src", "content", "docs");
  if (dirSlug.length === 0) return "文档";

  // 上级目录 _meta.json
  const parent = dirSlug.slice(0, -1);
  const metaPath = path.join(docsDir, ...parent, "_meta.json");

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
    const keyIndex = dirSlug.length - 1;
    // 修复：添加边界检查
    if (keyIndex >= 0 && dirSlug[keyIndex]) {
      const key = dirSlug[keyIndex];
      // 修复：添加空值检查
      if (key) {
        const title = getTitleFromMeta(meta, key);
        if (title) return title;
      }
    }
  }

  // 修复：添加边界检查
  const lastIndex = dirSlug.length - 1;
  // 修复：添加空值检查
  if (lastIndex >= 0 && dirSlug[lastIndex]) {
    return dirSlug[lastIndex];
  }
  return "";
}

/**
 * 从meta配置中查找文档
 */
function findDocFromMeta(
  meta: Record<string, unknown>,
  docsDir: string,
  dirSlug: string[]
): string[] | null {
  const keys = Object.keys(meta).filter(key => typeof meta[key] === "object");
  for (const key of keys) {
    // 检查是否有对应的 md/mdx 文件
    const mdx = path.join(docsDir, `${key}.mdx`);
    const md = path.join(docsDir, `${key}.md`);
    if (fs.existsSync(mdx) || fs.existsSync(md)) {
      return [...dirSlug, key];
    }
  }
  return null;
}

/**
 * 从文件系统中查找第一个文档
 */
function findFirstDocFromFiles(docsDir: string, dirSlug: string[]): string[] | null {
  const files = globSync("*.{md,mdx}", { cwd: docsDir });
  if (files.length > 0) {
    const sortedFiles = files.sort();
    // 修复：添加边界检查
    const firstFile = sortedFiles[0];
    if (firstFile) {
      const first = firstFile.replace(/\.(md|mdx)$/, "");
      return [...dirSlug, first];
    }
  }
  return null;
}

/**
 * 获取目录下的第一篇文档 slug（不含扩展名）
 * 优先 _meta.json 顺序，否则按文件名排序
 */
export function getFirstDocInDirectory(dirSlug: string[]): string[] | null {
  const docsDir = path.join(process.cwd(), "src", "content", "docs", ...dirSlug);

  // 1. 优先 _meta.json 顺序
  const metaPath = path.join(docsDir, "_meta.json");
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
    const result = findDocFromMeta(meta, docsDir, dirSlug);
    if (result) return result;
  }

  // 2. 没有 _meta.json 或未命中，按文件名排序
  return findFirstDocFromFiles(docsDir, dirSlug);
}

/**
 * 服务端专用：生成 docs 面包屑，label 优先 _meta.json title，href 跳转目录下第一文档
 */
export function createDocBreadcrumbsServer(
  slug: string[],
  currentTitle?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  // 根目录
  items.push({ label: getDirectoryTitle([]), href: "/docs" });
  for (let i = 0; i < slug.length; i++) {
    const dir = slug.slice(0, i + 1);
    const isLast = i === slug.length - 1;
    // 只在最后一级用 currentTitle，否则用目录 title
    const label = isLast && currentTitle ? currentTitle : getDirectoryTitle(dir);
    if (!isLast) {
      const firstDoc = getFirstDocInDirectory(dir);
      if (firstDoc) {
        items.push({ label, href: `/docs/${firstDoc.join("/")}` });
      } else {
        items.push({ label });
      }
    } else {
      // 最后一级只加一次 label，无 href
      items.push({ label });
    }
  }
  return items;
}

/**
 * 递归计算目录中的文档数量 (不含 index.mdx 和 _ 开头的)
 */
function countDocsRecursively(dir: string): number {
  if (!(fs.existsSync(dir) && fs.statSync(dir).isDirectory())) {
    return 0;
  }

  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (
      item.name.startsWith("_") ||
      item.name.startsWith(".") ||
      item.name === "index.mdx" ||
      item.name === "index.md"
    ) {
      continue;
    }

    if (item.isDirectory()) {
      count += countDocsRecursively(itemPath);
    } else if (item.isFile() && (item.name.endsWith(".mdx") || item.name.endsWith(".md"))) {
      count += 1;
    }
  }
  return count;
}

/**
 * 获取根目录meta配置
 */
function getRootMetaConfig(docsDir: string): Record<string, DocMetaItem | string> {
  const rootMetaPath = path.join(docsDir, "_meta.json");
  if (fs.existsSync(rootMetaPath)) {
    try {
      return JSON.parse(fs.readFileSync(rootMetaPath, "utf8")) as Record<
        string,
        DocMetaItem | string
      >;
    } catch {
      // Failed to parse root _meta.json file
    }
  }
  return {};
}

/**
 * 获取有序的分类名称列表
 */
function getOrderedCategoryNames(
  dirs: fs.Dirent[],
  rootMeta: Record<string, DocMetaItem | string>
): string[] {
  const orderedCategoryNames: string[] = [];

  // Add categories from rootMeta first, in their defined order
  Object.keys(rootMeta).forEach(key => {
    if (dirs.some(dir => dir.name === key && dir.isDirectory())) {
      orderedCategoryNames.push(key);
    }
  });

  // Add remaining directories not in rootMeta, sorted alphabetically
  dirs.forEach(dir => {
    if (
      dir.isDirectory() &&
      !dir.name.startsWith("_") &&
      !dir.name.startsWith(".") &&
      !orderedCategoryNames.includes(dir.name)
    ) {
      orderedCategoryNames.push(dir.name);
    }
  });

  // Sort the ones not in meta alphabetically if needed, but they are added after meta ones
  const nonMetaDirs = orderedCategoryNames.slice(
    Object.keys(rootMeta).filter(k => orderedCategoryNames.includes(k)).length
  );
  nonMetaDirs.sort((a, b) => a.localeCompare(b));

  return [...Object.keys(rootMeta).filter(k => orderedCategoryNames.includes(k)), ...nonMetaDirs];
}

/**
 * 创建单个文档分类
 */
function createDocCategory(
  categoryId: string,
  rootMeta: Record<string, DocMetaItem | string>,
  docsDir: string
): DocCategory {
  const categoryDir = path.join(docsDir, categoryId);
  const docCount = countDocsRecursively(categoryDir);
  let title = categoryId;
  let description = "";

  const rootMetaEntry = rootMeta[categoryId];
  if (rootMetaEntry) {
    if (typeof rootMetaEntry === "string") {
      title = rootMetaEntry;
    } else {
      title = rootMetaEntry.title ?? categoryId;
      description = rootMetaEntry.description ?? "";
    }
  }

  // Category-level _meta.json can override title/description
  const categoryMetaPath = path.join(categoryDir, "_meta.json");
  if (fs.existsSync(categoryMetaPath)) {
    try {
      const catMetaContent = fs.readFileSync(categoryMetaPath, "utf8");
      const catMeta: DocMetaItem = JSON.parse(catMetaContent) as DocMetaItem;
      const { title: metaTitle, description: metaDescription } = catMeta;
      if (metaTitle) title = metaTitle;
      if (metaDescription) description = metaDescription;
    } catch {
      // Error parsing _meta.json for category
    }
  }

  return {
    id: categoryId,
    name: categoryId,
    title: title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, " "),
    slug: categoryId,
    description: description ?? `${title} 相关文档和教程`,
    count: docCount,
  };
}

/**
 * 获取文档分类
 */
export function getDocCategories(): DocCategory[] {
  const docsDir = path.join(process.cwd(), "src", "content", "docs");
  if (!fs.existsSync(docsDir)) return [];

  const categories: DocCategory[] = [];
  const rootMeta = getRootMetaConfig(docsDir);
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true });
  const finalOrderedCategoryNames = getOrderedCategoryNames(dirs, rootMeta);

  finalOrderedCategoryNames.forEach(categoryId => {
    const category = createDocCategory(categoryId, rootMeta, docsDir);
    categories.push(category);
  });

  return categories;
}

/**
 * 处理单个文件并创建文档项
 */
function processDocFile(
  item: fs.Dirent,
  categoryId: string,
  categoryDir: string
): DocListItem | null {
  if (
    !(item.isFile() && (item.name.endsWith(".mdx") || item.name.endsWith(".md"))) ||
    item.name.startsWith("_") ||
    item.name === "index.mdx" ||
    item.name === "index.md"
  ) {
    return null;
  }

  const filePath = path.join(categoryDir, item.name);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);
  const slug = item.name.replace(/\.(mdx|md)$/, "");

  if (data.published === false) {
    return null;
  }

  return {
    slug,
    category: categoryId,
    title: (data.title ?? slug) as string,
    description: (data.description ?? data.excerpt ?? "") as string,
    date: data.date as string | undefined,
    path: `${categoryId}/${slug}`,
  };
}

/**
 * 从单个分类中收集文档
 */
function collectDocsFromCategory(category: fs.Dirent, docsDir: string): DocListItem[] {
  const docs: DocListItem[] = [];

  if (!category.isDirectory() || category.name.startsWith("_") || category.name.startsWith(".")) {
    return docs;
  }

  const categoryId = category.name;
  const categoryDir = path.join(docsDir, categoryId);
  const items = fs.readdirSync(categoryDir, { withFileTypes: true });

  items.forEach(item => {
    const docItem = processDocFile(item, categoryId, categoryDir);
    if (docItem) {
      docs.push(docItem);
    }
  });

  return docs;
}

/**
 * 获取最新文档
 */
export function getRecentDocs(limit = 4): DocListItem[] {
  const docsDir = path.join(process.cwd(), "src", "content", "docs");
  if (!fs.existsSync(docsDir)) return [];

  const allDocs: DocListItem[] = [];
  const categories = fs.readdirSync(docsDir, { withFileTypes: true });

  categories.forEach(category => {
    const docs = collectDocsFromCategory(category, docsDir);
    allDocs.push(...docs);
  });

  return allDocs
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    .slice(0, limit);
}

/**
 * 加载meta配置
 */
function loadMetaConfig(currentAbsolutePath: string): Record<string, DocMetaItem | string> {
  const metaFilePath = path.join(currentAbsolutePath, "_meta.json");
  if (!fs.existsSync(metaFilePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(metaFilePath, "utf8")) as Record<
      string,
      DocMetaItem | string
    >;
  } catch {
    // Error parsing _meta.json in directory
    return {};
  }
}

/**
 * 收集目录中的项目
 */
function collectDirectoryItems(currentAbsolutePath: string): { name: string; isDir: boolean }[] {
  const itemsInDir = fs.readdirSync(currentAbsolutePath, {
    withFileTypes: true,
  });
  const collectedItems: { name: string; isDir: boolean }[] = [];

  itemsInDir.forEach(dirItem => {
    // Skip system files/dirs and index files (Requirement 4 for sidebar)
    if (
      dirItem.name.startsWith("_") ||
      dirItem.name.startsWith(".") ||
      dirItem.name === "index.mdx" ||
      dirItem.name === "index.md"
    ) {
      return;
    }

    if (dirItem.isDirectory()) {
      collectedItems.push({ name: dirItem.name, isDir: true });
    } else if (
      dirItem.isFile() &&
      (dirItem.name.endsWith(".md") || dirItem.name.endsWith(".mdx"))
    ) {
      collectedItems.push({
        name: dirItem.name.replace(/\.(md|mdx)$/, ""),
        isDir: false,
      });
    }
  });

  return collectedItems;
}

/**
 * 根据meta配置获取排序名称
 */
function getSortedItemNames(
  metaConfig: Record<string, DocMetaItem | string>,
  collectedItems: { name: string; isDir: boolean }[],
  metaExists: boolean
): string[] {
  if (metaExists) {
    // Requirement 3: Strict order by _meta.json if it exists.
    // Filter collectedItems to only those present in metaConfig keys.
    return Object.keys(metaConfig).filter(key => {
      const metaEntry = metaConfig[key];
      // Exclude items marked as hidden in meta
      if (typeof metaEntry === "object" && metaEntry.display === "hidden") {
        return false;
      }
      return collectedItems.some(ci => ci.name === key);
    });
  } else {
    // Requirement 3: Filename ascending order if no _meta.json
    return collectedItems.map(ci => ci.name).sort((a, b) => a.localeCompare(b));
  }
}

/**
 * 从文件中读取frontmatter标题
 */
function getTitleFromFrontmatter(
  rootDocsDir: string,
  currentRelativePath: string,
  itemName: string
): string {
  let mdFilePath = path.join(rootDocsDir, currentRelativePath, `${itemName}.mdx`);
  if (!fs.existsSync(mdFilePath)) {
    mdFilePath = path.join(rootDocsDir, currentRelativePath, `${itemName}.md`);
  }
  if (fs.existsSync(mdFilePath)) {
    try {
      const fileContent = fs.readFileSync(mdFilePath, "utf8");
      const { data: frontmatter } = matter(fileContent);
      if (frontmatter.title) {
        return frontmatter.title as string;
      }
    } catch {
      // Error reading frontmatter for file
    }
  }
  return itemName;
}

/**
 * 创建目录项参数接口
 */
interface CreateItemParams {
  itemName: string;
  itemSpecificConfig: DocMetaItem;
  itemFsRelativePath: string;
  rootDocsDir: string;
  currentRelativePath: string;
}

/**
 * 创建目录项
 */
function createDirectoryItem(params: CreateItemParams): SidebarItem {
  const { itemName, itemSpecificConfig, itemFsRelativePath, rootDocsDir, currentRelativePath } =
    params;
  const children = getDocDirectoryStructure(rootDocsDir, itemFsRelativePath);
  const normalizedRelativePath = currentRelativePath.replace(/\\/g, "/");
  const defaultHref = `/docs/${
    normalizedRelativePath ? `${normalizedRelativePath}/` : ""
  }${itemName}`;

  return {
    title: itemSpecificConfig.title ?? itemName,
    path: itemSpecificConfig.href?.toString() ?? defaultHref,
    href: itemSpecificConfig.href?.toString(),
    items: children,
    collapsed: itemSpecificConfig.collapsed,
    type: itemSpecificConfig.type ?? "menu",
    isExternal:
      !!itemSpecificConfig.href &&
      (itemSpecificConfig.href.toString().startsWith("http://") ||
        itemSpecificConfig.href.toString().startsWith("https://")),
    filePath: itemFsRelativePath.replace(/\\/g, "/"),
  };
}

/**
 * 创建文件项
 */
function createFileItem(params: CreateItemParams): SidebarItem {
  const { itemName, itemSpecificConfig, itemFsRelativePath, rootDocsDir, currentRelativePath } =
    params;
  const normalizedRelativePath = currentRelativePath.replace(/\\/g, "/");
  const defaultHref = `/docs/${
    normalizedRelativePath ? `${normalizedRelativePath}/` : ""
  }${itemName}`;

  let title = itemSpecificConfig.title ?? itemName;
  if (!itemSpecificConfig.title) {
    // Only read frontmatter if title not in meta
    title = getTitleFromFrontmatter(rootDocsDir, currentRelativePath, itemName);
  }

  return {
    title,
    path: itemSpecificConfig.href?.toString() ?? defaultHref,
    href: itemSpecificConfig.href?.toString() ?? defaultHref,
    type: itemSpecificConfig.type ?? "page",
    isExternal:
      !!itemSpecificConfig.href &&
      (itemSpecificConfig.href.toString().startsWith("http://") ||
        itemSpecificConfig.href.toString().startsWith("https://")),
    filePath: itemFsRelativePath.replace(/\\/g, "/"),
  };
}

/**
 * 获取文档目录结构 (核心函数，用于 Sidebar 和上下翻页)
 * @param rootDocsDir - e.g., path.join(process.cwd(), 'src', 'content', 'docs')
 * @param currentRelativePath - e.g., 'category' or 'category/subcategory'
 * @returns Array of SidebarItem, sorted according to rules.
 */
export function getDocDirectoryStructure(
  rootDocsDir: string,
  currentRelativePath = ""
): SidebarItem[] {
  const currentAbsolutePath = path.join(rootDocsDir, currentRelativePath);

  if (!(fs.existsSync(currentAbsolutePath) && fs.statSync(currentAbsolutePath).isDirectory())) {
    return [];
  }

  const metaConfig = loadMetaConfig(currentAbsolutePath);
  const metaExists = Object.keys(metaConfig).length > 0;
  const collectedItems = collectDirectoryItems(currentAbsolutePath);
  const sortedItemNames = getSortedItemNames(metaConfig, collectedItems, metaExists);

  return sortedItemNames
    .map(itemName => {
      const itemMetaEntry = metaConfig[itemName];
      // 修复：确保 itemSpecificConfig 总是符合 DocMetaItem 类型
      const itemSpecificConfig: DocMetaItem =
        typeof itemMetaEntry === "string"
          ? { title: itemMetaEntry }
          : (itemMetaEntry ?? { title: itemName });

      const actualItem = collectedItems.find(ci => ci.name === itemName);
      if (!actualItem) return null; // Should not happen

      const itemFsRelativePath = path.join(currentRelativePath, itemName); // Relative to rootDocsDir
      const isDirectory = actualItem.isDir;

      if (isDirectory) {
        return createDirectoryItem({
          itemName,
          itemSpecificConfig,
          itemFsRelativePath,
          rootDocsDir,
          currentRelativePath,
        });
      } else {
        return createFileItem({
          itemName,
          itemSpecificConfig,
          itemFsRelativePath,
          rootDocsDir,
          currentRelativePath,
        });
      }
    })
    .filter(Boolean) as SidebarItem[];
}

/**
 * 获取文档分类的侧边栏结构
 * This function serves as the main entry point for generating sidebar data for a given category.
 * @param category The name of the category directory (e.g., "guides", "api")
 * @returns An array of SidebarItem objects for the specified category.
 */
export function getDocSidebar(category: string): SidebarItem[] {
  const docsContentDir = path.join(process.cwd(), "src", "content", "docs");
  // The initial call to getDocDirectoryStructure uses the category name as the currentRelativePath
  try {
    const result = getDocDirectoryStructure(docsContentDir, category);
    return Array.isArray(result) ? result : [];
  } catch {
    // Error getting doc sidebar for category
    return [];
  }
}

/**
 * 检查项目是否应该跳过
 */
function shouldSkipItem(item: SidebarItem): boolean {
  return item.type === "separator" || item.isExternal || !item.href;
}

/**
 * 处理具有子项目的项目
 */
function processItemWithChildren(
  item: SidebarItem,
  _flatList: NavDocItem[],
  recurseItems: (items: SidebarItem[]) => void
): void {
  if (item.items && item.items.length > 0) {
    recurseItems(item.items);
  }
}

/**
 * 处理页面项目
 */
function processPageItem(
  item: SidebarItem,
  topLevelCategory: string,
  flatList: NavDocItem[]
): void {
  if (item.type === "page" || (item.type === "menu" && item.href)) {
    // Ensure path starts with /docs/ and normalize
    let itemPath = item.href;
    if (itemPath && !itemPath.startsWith("/docs/")) {
      itemPath = `/docs/${topLevelCategory}/${itemPath.replace(/^\//, "")}`;
    }
    if (itemPath) {
      itemPath = itemPath.replace(/\\/g, "/");

      // Ensure it's not an accidental link to an index page
      if (!itemPath.endsWith("/index")) {
        flatList.push({ title: item.title, path: itemPath });
      }
    }
  }
}

/**
 * 处理菜单项目的子项
 */
function processMenuChildren(
  item: SidebarItem,
  recurseItems: (items: SidebarItem[]) => void
): void {
  if (item.items && item.items.length > 0 && item.type === "menu") {
    recurseItems(item.items);
  }
}

/**
 * Flattens the sidebar structure for a category into a list of navigable documents,
 * respecting the order defined by getDocDirectoryStructure.
 * index.mdx files are NOT included as they are not in the sidebar.
 * @param category The category name.
 * @returns A flat list of NavDocItem.
 */
export function getFlattenedDocsOrder(topLevelCategory: string): NavDocItem[] {
  // Get the complete sidebar structure for the top-level category
  const sidebarItems = getDocSidebar(topLevelCategory);
  const flatList: NavDocItem[] = [];

  function recurse(items: SidebarItem[]): void {
    if (!(items && Array.isArray(items))) {
      return;
    }

    for (const item of items) {
      if (shouldSkipItem(item)) {
        processItemWithChildren(item, flatList, recurse);
        continue;
      }

      // Process page items and menu items that are also pages
      processPageItem(item, topLevelCategory, flatList);

      // Recursively process children of a menu
      processMenuChildren(item, recurse);
    }
  }

  recurse(sidebarItems);
  return flatList;
}

/**
 * 从特性中获取文档内容
 * @param slug 文档路径数组
 * @returns 文档内容结果
 */
export function getDocContentFromFeatures(slug: string[]): DocContentResult {
  return getDocContent(slug);
}

/**
 * 从特性中生成文档路径
 * @returns 文档路径数组
 */
export function generateDocPathsFromFeatures(): { slug: string[] }[] {
  return generateDocPaths();
}
