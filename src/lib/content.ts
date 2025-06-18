/**
 * 内容处理工具函数
 * 提供博客和文档相关的辅助功能
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog-types';
import type { SidebarItem } from '@/types/docs-types';

// ==================== 博客相关函数 ====================

/**
 * 获取所有标签
 * @returns 所有标签数组
 */
export function getAllTags(): string[] {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];

  const allTags = new Set<string>();

  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);

        // 只收集已发布文章的标签
        if (data.published !== false && data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => allTags.add(tag));
        }
      }
    }
  };

  findTagsInFiles(blogDir);
  return Array.from(allTags).sort();
}

/**
 * 获取所有标签及其文章数量
 * @returns 标签及其文章数量的记录
 */
export function getAllTagsWithCount(): Record<string, number> {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return {};

  const tagCounts: Record<string, number> = {};

  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);

        // 只收集已发布文章的标签
        if (data.published !== false && data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      }
    }
  };

  findTagsInFiles(blogDir);
  return tagCounts;
}

/**
 * 根据标签获取文章
 * @param tag 标签
 * @returns 文章数组
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];

  // 递归函数来查找所有博客文件
  const findPostsWithTag = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findPostsWithTag(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);

        // 检查是否包含指定标签
        if (
          data.published !== false &&
          data.tags &&
          Array.isArray(data.tags) &&
          data.tags.includes(tag)
        ) {
          // 计算slug
          let slug = '';
          const relativePath = path.relative(blogDir, itemPath);
          const pathParts = relativePath.split(path.sep);

          if (pathParts.length === 1) {
            // 直接在blog目录下的文件
            slug = pathParts[0].replace(/\.(mdx|md)$/, '');
          } else {
            // 在子目录中的文件
            const fileName = pathParts.pop() || '';
            slug = `${pathParts.join('/')}/${fileName.replace(/\.(mdx|md)$/, '')}`;
          }

          posts.push({
            slug,
            title: data.title || slug,
            description: data.description || data.excerpt || '点击阅读全文',
            excerpt: data.excerpt || '点击阅读全文',
            date: data.date,
            tags: data.tags,
          });
        }
      }
    }
  };

  findPostsWithTag(blogDir);

  // 按日期排序
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

// ==================== 文档相关函数 ====================

/**
 * 文档分类接口
 */
export interface DocCategory {
  id: string;
  title: string;
  description: string;
  count: number;
}

/**
 * 文档项目接口 (用于 getRecentDocs 等)
 */
export interface DocItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  date?: string;
}

/**
 * 文档元数据项接口 (_meta.json)
 */
export interface DocMetaItem {
  title?: string;
  href?: string; // For external links or custom internal paths
  collapsed?: boolean; // For categories/menus
  items?: string[] | Record<string, DocMetaItem | string>; // For nested structure
  type?: 'separator' | 'page' | 'menu';
  display?: 'hidden' | 'normal';
  order?: number; // For explicit sorting
  description?: string; // For category descriptions in _meta.json
}

/**
 * 递归计算目录中的文档数量 (不含 index.mdx 和 _ 开头的)
 */
function countDocsRecursively(dir: string): number {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return 0;
  }

  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (
      item.name.startsWith('_') ||
      item.name.startsWith('.') ||
      item.name === 'index.mdx' ||
      item.name === 'index.md'
    ) {
      continue;
    }

    if (item.isDirectory()) {
      count += countDocsRecursively(itemPath);
    } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
      count += 1;
    }
  }
  return count;
}

/**
 * 获取文档分类
 */
export function getDocCategories(): DocCategory[] {
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
  if (!fs.existsSync(docsDir)) return [];

  const categories: DocCategory[] = [];
  const rootMetaPath = path.join(docsDir, '_meta.json');
  let rootMeta: Record<string, DocMetaItem | string> = {};

  if (fs.existsSync(rootMetaPath)) {
    try {
      rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, 'utf8'));
    } catch (error) {
      console.error('解析根目录 _meta.json 文件失败:', error);
    }
  }

  const dirs = fs.readdirSync(docsDir, { withFileTypes: true });
  const orderedCategoryNames: string[] = [];

  // Add categories from rootMeta first, in their defined order
  Object.keys(rootMeta).forEach((key) => {
    if (dirs.some((dir) => dir.name === key && dir.isDirectory())) {
      orderedCategoryNames.push(key);
    }
  });

  // Add remaining directories not in rootMeta, sorted alphabetically
  dirs.forEach((dir) => {
    if (
      dir.isDirectory() &&
      !dir.name.startsWith('_') &&
      !dir.name.startsWith('.') &&
      !orderedCategoryNames.includes(dir.name)
    ) {
      orderedCategoryNames.push(dir.name);
    }
  });
  // Sort the ones not in meta alphabetically if needed, but they are added after meta ones
  const nonMetaDirs = orderedCategoryNames.slice(
    Object.keys(rootMeta).filter((k) => orderedCategoryNames.includes(k)).length
  );
  nonMetaDirs.sort((a, b) => a.localeCompare(b));
  const finalOrderedCategoryNames = [
    ...Object.keys(rootMeta).filter((k) => orderedCategoryNames.includes(k)),
    ...nonMetaDirs,
  ];

  finalOrderedCategoryNames.forEach((categoryId) => {
    const categoryDir = path.join(docsDir, categoryId);
    const docCount = countDocsRecursively(categoryDir);
    let title = categoryId;
    let description = '';

    const rootMetaEntry = rootMeta[categoryId];
    if (rootMetaEntry) {
      if (typeof rootMetaEntry === 'string') {
        title = rootMetaEntry;
      } else {
        title = rootMetaEntry.title || categoryId;
        description = (rootMetaEntry as DocMetaItem).description || '';
      }
    }

    // Category-level _meta.json can override title/description
    const categoryMetaPath = path.join(categoryDir, '_meta.json');
    if (fs.existsSync(categoryMetaPath)) {
      try {
        const catMetaContent = fs.readFileSync(categoryMetaPath, 'utf8');
        const catMeta = JSON.parse(catMetaContent) as DocMetaItem;
        if (catMeta.title) title = catMeta.title;
        if (catMeta.description) description = catMeta.description;
      } catch (e) {
        console.error(`Error parsing _meta.json for ${categoryId}`, e);
      }
    }

    categories.push({
      id: categoryId,
      title: title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' '),
      description: description || `${title} 相关文档和教程`,
      count: docCount,
    });
  });

  return categories;
}

/**
 * 获取最新文档
 */
export function getRecentDocs(limit: number = 4): DocItem[] {
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
  if (!fs.existsSync(docsDir)) return [];

  const allDocs: DocItem[] = [];
  const categories = fs.readdirSync(docsDir, { withFileTypes: true });

  categories.forEach((category) => {
    if (
      category.isDirectory() &&
      !category.name.startsWith('_') &&
      !category.name.startsWith('.')
    ) {
      const categoryId = category.name;
      const categoryDir = path.join(docsDir, categoryId);
      const items = fs.readdirSync(categoryDir, { withFileTypes: true });

      items.forEach((item) => {
        if (
          item.isFile() &&
          (item.name.endsWith('.mdx') || item.name.endsWith('.md')) &&
          !item.name.startsWith('_') &&
          item.name !== 'index.mdx' &&
          item.name !== 'index.md'
        ) {
          const filePath = path.join(categoryDir, item.name);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          const slug = item.name.replace(/\.(mdx|md)$/, '');

          if (data.published !== false) {
            allDocs.push({
              slug,
              category: categoryId,
              title: data.title || slug,
              description: data.description || data.excerpt || '',
              date: data.date,
            });
          }
        }
      });
    }
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
 * 获取文档目录结构 (核心函数，用于 Sidebar 和上下翻页)
 * @param rootDocsDir - e.g., path.join(process.cwd(), 'src', 'content', 'docs')
 * @param currentRelativePath - e.g., 'category' or 'category/subcategory'
 * @returns Array of SidebarItem, sorted according to rules.
 */
export function getDocDirectoryStructure(
  rootDocsDir: string,
  currentRelativePath: string = ''
): SidebarItem[] {
  const currentAbsolutePath = path.join(rootDocsDir, currentRelativePath);

  if (!fs.existsSync(currentAbsolutePath) || !fs.statSync(currentAbsolutePath).isDirectory()) {
    return [];
  }

  const itemsInDir = fs.readdirSync(currentAbsolutePath, { withFileTypes: true });
  const metaFilePath = path.join(currentAbsolutePath, '_meta.json');
  let metaConfig: Record<string, DocMetaItem | string> = {};
  const metaExists = fs.existsSync(metaFilePath);

  if (metaExists) {
    try {
      metaConfig = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    } catch (error) {
      console.error(`Error parsing _meta.json in ${currentAbsolutePath}:`, error);
    }
  }

  const collectedItems: { name: string; isDir: boolean }[] = [];
  itemsInDir.forEach((dirItem) => {
    // Skip system files/dirs and index files (Requirement 4 for sidebar)
    if (
      dirItem.name.startsWith('_') ||
      dirItem.name.startsWith('.') ||
      dirItem.name === 'index.mdx' ||
      dirItem.name === 'index.md'
    ) {
      return;
    }

    if (dirItem.isDirectory()) {
      collectedItems.push({ name: dirItem.name, isDir: true });
    } else if (
      dirItem.isFile() &&
      (dirItem.name.endsWith('.md') || dirItem.name.endsWith('.mdx'))
    ) {
      collectedItems.push({ name: dirItem.name.replace(/\.(md|mdx)$/, ''), isDir: false });
    }
  });

  let sortedItemNames: string[];

  if (metaExists) {
    // Requirement 3: Strict order by _meta.json if it exists.
    // Filter collectedItems to only those present in metaConfig keys.
    sortedItemNames = Object.keys(metaConfig).filter((key) => {
      const metaEntry = metaConfig[key];
      // Exclude items marked as hidden in meta
      if (typeof metaEntry === 'object' && metaEntry.display === 'hidden') {
        return false;
      }
      return collectedItems.some((ci) => ci.name === key);
    });
    // Requirement 1: Sidebar 顺序严格按 _meta.json 内容的先后排序.
    // The .sort() based on 'order' property is removed.
    // The order from Object.keys(metaConfig) (after filtering) is preserved.
  } else {
    // Requirement 3: Filename ascending order if no _meta.json
    sortedItemNames = collectedItems.map((ci) => ci.name).sort((a, b) => a.localeCompare(b));
  }

  return sortedItemNames
    .map((itemName) => {
      const itemMetaEntry = metaConfig[itemName];
      const itemSpecificConfig =
        typeof itemMetaEntry === 'string'
          ? { title: itemMetaEntry }
          : (itemMetaEntry as DocMetaItem) || {};

      const actualItem = collectedItems.find((ci) => ci.name === itemName);
      if (!actualItem) return null; // Should not happen

      const itemFsRelativePath = path.join(currentRelativePath, itemName); // Relative to rootDocsDir
      const isDirectory = actualItem.isDir;

      let title = itemSpecificConfig.title || itemName;
      const defaultHref = `/docs/${
        currentRelativePath ? currentRelativePath + '/' : ''
      }${itemName}`;

      if (isDirectory) {
        const children = getDocDirectoryStructure(rootDocsDir, itemFsRelativePath);
        return {
          title,
          href: itemSpecificConfig.href, // Use href from meta if present (could be external or custom internal for a category link)
          items: children,
          collapsed: itemSpecificConfig.collapsed,
          type: itemSpecificConfig.type || 'menu',
          isExternal:
            !!itemSpecificConfig.href &&
            (itemSpecificConfig.href.startsWith('http://') ||
              itemSpecificConfig.href.startsWith('https://')),
          filePath: itemFsRelativePath,
        };
      } else {
        // It's a file
        if (!itemSpecificConfig.title) {
          // Only read frontmatter if title not in meta
          let mdFilePath = path.join(rootDocsDir, currentRelativePath, `${itemName}.mdx`);
          if (!fs.existsSync(mdFilePath)) {
            mdFilePath = path.join(rootDocsDir, currentRelativePath, `${itemName}.md`);
          }
          if (fs.existsSync(mdFilePath)) {
            try {
              const fileContent = fs.readFileSync(mdFilePath, 'utf8');
              const { data: frontmatter } = matter(fileContent);
              if (frontmatter.title) {
                title = frontmatter.title;
              }
            } catch (e) {
              console.error(`Error reading frontmatter for ${mdFilePath}:`, e);
            }
          }
        }
        return {
          title,
          href: itemSpecificConfig.href || defaultHref,
          type: itemSpecificConfig.type || 'page',
          isExternal:
            !!itemSpecificConfig.href &&
            (itemSpecificConfig.href.startsWith('http://') ||
              itemSpecificConfig.href.startsWith('https://')),
          filePath: itemFsRelativePath,
        };
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
  const docsContentDir = path.join(process.cwd(), 'src', 'content', 'docs');
  // The initial call to getDocDirectoryStructure uses the category name as the currentRelativePath
  return getDocDirectoryStructure(docsContentDir, category);
}

/**
 * Represents a document item for navigation (prev/next links).
 */
export interface NavDocItem {
  title: string;
  path: string; // Full path, e.g., /docs/category/doc-name
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

  function recurse(items: SidebarItem[]) {
    for (const item of items) {
      if (item.type === 'separator' || item.isExternal || !item.href) {
        // Skip separators, external links, or items without href for navigation list
        // However, if a menu item (category) has an href, it might be a link to its own overview page (not index.mdx)
        // and its children should still be processed.
        if (item.items && item.items.length > 0) {
          recurse(item.items);
        }
        continue;
      }

      // Process page items and menu items that are also pages
      if (item.type === 'page' || (item.type === 'menu' && item.href)) {
        // Ensure path starts with /docs/ and normalize
        let itemPath = item.href;
        if (!itemPath.startsWith('/docs/')) {
          // This case should ideally not happen if hrefs from getDocDirectoryStructure are well-formed
          itemPath = `/docs/${topLevelCategory}/${itemPath.replace(/^\//, '')}`;
        }
        itemPath = itemPath.replace(/\\/g, '/');

        // Ensure it's not an accidental link to an index page that should be hidden from prev/next
        // (getDocDirectoryStructure already filters index.mdx from items for sidebar)
        // This check might be redundant if getDocDirectoryStructure is perfect.
        if (!itemPath.endsWith('/index')) {
          // A simple check, might need refinement
          flatList.push({ title: item.title, path: itemPath });
        }
      }

      // Recursively process children of a menu
      if (item.items && item.items.length > 0 && item.type === 'menu') {
        recurse(item.items);
      }
    }
  }

  recurse(sidebarItems);
  return flatList;
}
