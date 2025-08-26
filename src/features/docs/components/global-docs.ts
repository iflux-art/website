/**
 * 全局文档结构管理
 * 提供文档分类和结构的全局管理功能
 */

import fs from "node:fs";
import path from "node:path";
import { getDocCategories, getDocDirectoryStructure } from "@/features/docs/lib";
import type { DocCategory, SidebarItem } from "@/features/docs/types";

// 常量定义
const DOCS_CONTENT_DIR = path.join(process.cwd(), "src", "content", "docs");
const DOCS_INDEX_FILES = ["index.mdx", "index.md"];

/**
 * 全局文档结构接口
 */
export interface GlobalDocsStructure {
  categories: DocCategoryWithDocs[];
  firstDocPath: string;
  totalDocs: number;
}

/**
 * 带文档的分类接口
 */
export interface DocCategoryWithDocs extends DocCategory {
  docs: SidebarItem[];
  hasIndex: boolean;
  firstDocPath?: string;
}

/**
 * 文档路径解析结果接口
 */
export interface DocPathResolution {
  type: "document" | "category" | "redirect" | "notfound";
  targetPath?: string;
  redirectTo?: string;
  isIndex?: boolean;
}

/**
 * 获取所有文档的完整结构
 * 扫描所有文档分类和文档，构建完整的导航树
 *
 * @returns 全局文档结构
 */
export function getAllDocsStructure(): GlobalDocsStructure {
  const categories = getDocCategories();
  const categoriesWithDocs: DocCategoryWithDocs[] = [];
  let totalDocs = 0;
  let firstDocPath = "";

  for (const category of categories) {
    const categoryDocs = getDocDirectoryStructure(DOCS_CONTENT_DIR, category.id);
    const hasIndex = checkCategoryHasIndex(category.id);
    const firstDoc = findFirstDocInCategory(categoryDocs);

    // 计算该分类下的文档数量
    const docCount = countDocsInSidebarItems(categoryDocs);
    totalDocs += docCount;

    // 确定第一个文档路径
    let categoryFirstDocPath = "";
    if (hasIndex) {
      categoryFirstDocPath = `/docs/${category.id}`;
    } else if (firstDoc) {
      categoryFirstDocPath = firstDoc;
    }

    // 如果这是第一个有效的文档路径，设置为全局第一个文档
    if (!firstDocPath && categoryFirstDocPath) {
      firstDocPath = categoryFirstDocPath;
    }

    categoriesWithDocs.push({
      ...category,
      docs: categoryDocs,
      hasIndex,
      firstDocPath: categoryFirstDocPath,
    });
  }

  return {
    categories: categoriesWithDocs,
    firstDocPath: firstDocPath || "/docs",
    totalDocs,
  };
}

/**
 * 获取第一个可用的文档路径
 * 按照 _meta.json 定义的顺序，优先选择有 index 文件的分类
 *
 * @returns 第一个可用文档的路径
 */
export function getFirstAvailableDoc(): string {
  const structure = getAllDocsStructure();
  return structure.firstDocPath;
}

/**
 * 解析文档路径，处理目录重定向逻辑
 * 检查路径是否为目录，查找 index 文件或第一个子文档
 *
 * @param slugPath - 文档路径数组，如 ['frontend', 'frameworks']
 * @returns 路径解析结果
 */
export function resolveDocumentPath(slugPath: string[]): DocPathResolution {
  if (!slugPath || slugPath.length === 0) {
    return {
      type: "redirect",
      redirectTo: getFirstAvailableDoc(),
    };
  }

  const requestedPath = slugPath.join("/");
  const absolutePath = path.join(DOCS_CONTENT_DIR, requestedPath);

  // 检查路径是否存在
  if (!fs.existsSync(absolutePath)) {
    // 尝试作为文档文件
    const mdxPath = `${absolutePath}.mdx`;
    const mdPath = `${absolutePath}.md`;

    if (fs.existsSync(mdxPath) || fs.existsSync(mdPath)) {
      return {
        type: "document",
        targetPath: `/docs/${requestedPath}`,
      };
    }

    return { type: "notfound" };
  }

  const stats = fs.statSync(absolutePath);

  if (stats.isFile()) {
    return {
      type: "document",
      targetPath: `/docs/${requestedPath}`,
    };
  }

  if (stats.isDirectory()) {
    // 检查是否有 index 文件
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absolutePath, indexFile);
      if (fs.existsSync(indexPath)) {
        return {
          type: "document",
          targetPath: `/docs/${requestedPath}`,
          isIndex: true,
        };
      }
    }

    // 没有 index 文件，查找第一个子文档
    const categoryDocs = getDocDirectoryStructure(DOCS_CONTENT_DIR, requestedPath);
    const firstDoc = findFirstDocInCategory(categoryDocs);

    if (firstDoc) {
      return {
        type: "redirect",
        redirectTo: firstDoc,
      };
    }

    return { type: "notfound" };
  }

  return { type: "notfound" };
}

// ==================== 辅助函数 ====================

/**
 * 检查分类是否有 index 文件
 */
function checkCategoryHasIndex(categoryId: string): boolean {
  const categoryPath = path.join(DOCS_CONTENT_DIR, categoryId);

  for (const indexFile of DOCS_INDEX_FILES) {
    const indexPath = path.join(categoryPath, indexFile);
    if (fs.existsSync(indexPath)) {
      return true;
    }
  }

  return false;
}

/**
 * 在侧边栏项目中查找第一个文档
 */
function findFirstDocInCategory(items: SidebarItem[]): string | null {
  for (const item of items) {
    if (item.type === "page" && item.href) {
      return item.href;
    }

    if (item.type === "menu" && item.items && item.items.length > 0) {
      const firstInSubmenu = findFirstDocInCategory(item.items);
      if (firstInSubmenu) {
        return firstInSubmenu;
      }
    }
  }

  return null;
}

/**
 * 递归计算侧边栏项目中的文档数量
 */
function countDocsInSidebarItems(items: SidebarItem[]): number {
  let count = 0;

  for (const item of items) {
    if (item.type === "page") {
      count += 1;
    }

    if (item.items && item.items.length > 0) {
      count += countDocsInSidebarItems(item.items);
    }
  }

  return count;
}
