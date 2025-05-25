/**
 * 内容处理工具函数
 * 提供博客和文档相关的辅助功能
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/hooks/use-blog';
import { DocSidebarItem } from '@/components/features/sidebar/doc-sidebar';

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
 * 文档项目接口
 */
export interface DocItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  date?: string;
}

/**
 * 文档元数据项接口
 */
export interface DocMetaItem {
  /**
   * 自定义标题
   */
  title?: string;

  /**
   * 外部链接
   */
  href?: string;

  /**
   * 是否默认折叠
   */
  collapsed?: boolean;

  /**
   * 子项目
   * 可以是字符串数组（文件名列表）或嵌套对象（子文件夹）
   */
  items?: string[] | Record<string, DocMetaItem | string>;

  /**
   * 项目类型
   * - separator: 分隔符
   * - page: 页面
   * - menu: 菜单
   */
  type?: 'separator' | 'page' | 'menu';

  /**
   * 显示模式
   * - hidden: 隐藏
   * - normal: 正常显示
   */
  display?: 'hidden' | 'normal';
}

/**
 * 递归计算目录中的文档数量
 *
 * @param dir 目录路径
 * @returns 文档数量
 */
function countDocsRecursively(dir: string): number {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return 0;
  }

  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // 递归计算子目录中的文档数量
      count += countDocsRecursively(itemPath);
    } else if (
      item.isFile() &&
      (item.name.endsWith('.mdx') || item.name.endsWith('.md')) &&
      !item.name.startsWith('_')
    ) {
      // 计算当前目录中的文档数量
      count += 1;
    }
  }

  return count;
}

/**
 * 获取文档分类
 *
 * @returns 文档分类数组
 */
export function getDocCategories(): DocCategory[] {
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
  if (!fs.existsSync(docsDir)) return [];

  const categories: DocCategory[] = [];

  // 读取根目录的 _meta.json 文件
  const rootMetaPath = path.join(docsDir, '_meta.json');
  let rootMeta: Record<string, any> = {};

  if (fs.existsSync(rootMetaPath)) {
    try {
      const rootMetaContent = fs.readFileSync(rootMetaPath, 'utf8');
      rootMeta = JSON.parse(rootMetaContent);
    } catch (error) {
      console.error('解析根目录 _meta.json 文件失败:', error);
    }
  }

  // 读取目录内容
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true });

  // 创建一个有序的目录列表，根据 rootMeta 中的顺序
  const orderedDirs: { name: string; isDirectory: boolean }[] = [];

  // 首先添加 rootMeta 中定义的目录
  Object.keys(rootMeta).forEach(key => {
    const found = dirs.find(dir => dir.name === key && dir.isDirectory());
    if (found) {
      orderedDirs.push({ name: found.name, isDirectory: true });
    }
  });

  // 然后添加其余的目录
  dirs.forEach(dir => {
    if (
      dir.isDirectory() &&
      !orderedDirs.some(ordered => ordered.name === dir.name) &&
      !dir.name.startsWith('_')
    ) {
      orderedDirs.push({ name: dir.name, isDirectory: true });
    }
  });

  // 处理每个目录
  orderedDirs.forEach(dir => {
    if (dir.isDirectory) {
      const categoryId = dir.name;
      const categoryDir = path.join(docsDir, categoryId);

      // 递归计算文档数量，包括子目录中的文档
      const docCount = countDocsRecursively(categoryDir);

      // 尝试从根目录的 _meta.json 获取元数据
      let title = categoryId;
      let description = '';

      // 首先检查根目录的 _meta.json
      if (rootMeta[categoryId]) {
        const meta = rootMeta[categoryId];
        if (typeof meta === 'string') {
          title = meta;
        } else if (typeof meta === 'object') {
          title = meta.title || categoryId;
          description = meta.description || '';
        }
      }

      // 然后检查分类目录下的 _meta.json（优先级更高）
      const metaPath = path.join(categoryDir, '_meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const metaContent = fs.readFileSync(metaPath, 'utf8');
          const meta = JSON.parse(metaContent);
          // 只有当分类目录下的 _meta.json 中有 title 或 description 时才覆盖
          if (meta.title) title = meta.title;
          if (meta.description) description = meta.description;
        } catch (error) {
          console.error(`解析 ${categoryId} 的 _meta.json 文件失败:`, error);
        }
      }

      categories.push({
        id: categoryId,
        title: title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' '),
        description: description || `${title}相关文档和教程`,
        count: docCount,
      });
    }
  });

  return categories;
}

/**
 * 获取最新文档
 *
 * @param limit 限制数量，默认为 4
 * @returns 最新文档数组
 */
export function getRecentDocs(limit: number = 4): DocItem[] {
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
  if (!fs.existsSync(docsDir)) return [];

  const allDocs: DocItem[] = [];

  // 读取所有分类目录
  const categories = fs.readdirSync(docsDir, { withFileTypes: true });

  categories.forEach(category => {
    if (category.isDirectory()) {
      const categoryId = category.name;
      const categoryDir = path.join(docsDir, categoryId);
      const files = fs.readdirSync(categoryDir, { withFileTypes: true });

      files.forEach(file => {
        if (
          file.isFile() &&
          (file.name.endsWith('.mdx') || file.name.endsWith('.md')) &&
          !file.name.startsWith('_')
        ) {
          const filePath = path.join(categoryDir, file.name);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          const slug = file.name.replace(/\.(mdx|md)$/, '');

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

  // 按日期排序
  const sortedDocs = allDocs.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return sortedDocs.slice(0, limit);
}

/**
 * 获取文档目录结构
 *
 * @param rootDir 根目录路径
 * @param relativePath 相对路径
 * @param meta 元数据配置
 * @returns 文档目录结构
 */
export function getDocDirectoryStructure(
  rootDir: string,
  relativePath: string = '',
  meta: Record<string, DocMetaItem | string> = {}
): DocSidebarItem[] {
  const fullPath = path.join(rootDir, relativePath);

  // 检查目录是否存在
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    console.error(`目录不存在: ${fullPath}`);
    return [];
  }

  // 读取目录内容
  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  // 检查是否存在 _meta.json 文件
  const metaFilePath = path.join(fullPath, '_meta.json');
  let localMeta: Record<string, DocMetaItem | string> = {};

  if (fs.existsSync(metaFilePath)) {
    try {
      const metaContent = fs.readFileSync(metaFilePath, 'utf8');
      localMeta = JSON.parse(metaContent);
    } catch (error) {
      console.error(`解析 _meta.json 文件失败: ${metaFilePath}`, error);
    }
  }

  // 合并元数据
  const combinedMeta = { ...meta, ...localMeta };

  // 获取所有文件和目录
  const files: string[] = [];
  const directories: string[] = [];

  items.forEach(item => {
    // 忽略以 _ 或 . 开头的文件和目录
    if (item.name.startsWith('_') || item.name.startsWith('.')) {
      return;
    }

    if (item.isDirectory()) {
      directories.push(item.name);
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(item.name.replace(/\.(md|mdx)$/, ''));
    }
  });

  // 如果有元数据配置，按照元数据配置的顺序排序
  const orderedItems: string[] = [];
  const metaKeys = Object.keys(combinedMeta);

  // 首先添加元数据中定义的项目
  metaKeys.forEach(key => {
    // 检查是否是文件或目录
    if (files.includes(key) || directories.includes(key)) {
      orderedItems.push(key);
    }
  });

  // 然后添加未在元数据中定义的项目
  [...directories, ...files].forEach(item => {
    if (!orderedItems.includes(item)) {
      orderedItems.push(item);
    }
  });

  // 构建侧边栏项目
  return orderedItems.map(item => {
    const itemRelativePath = path.join(relativePath, item);
    const itemFullPath = path.join(rootDir, itemRelativePath);
    const isDirectory = fs.existsSync(itemFullPath) && fs.statSync(itemFullPath).isDirectory();

    // 获取元数据配置
    const itemMeta = combinedMeta[item];
    const metaConfig = typeof itemMeta === 'string' ? { title: itemMeta } : itemMeta || {};

    // 如果是目录，递归获取子项目
    if (isDirectory) {
      const children = getDocDirectoryStructure(rootDir, itemRelativePath, {});

      return {
        title: metaConfig.title || item,
        href: metaConfig.href,
        items: children,
        collapsed: metaConfig.collapsed,
        type: metaConfig.type,
        isExternal: !!metaConfig.href && metaConfig.href.startsWith('http'),
        filePath: itemRelativePath,
      };
    }

    // 如果是文件，读取文件内容获取标题
    let title = metaConfig.title || item;

    try {
      const filePath = path.join(itemFullPath + '.mdx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        if (data.title) {
          title = data.title;
        }
      } else {
        const mdFilePath = path.join(itemFullPath + '.md');
        if (fs.existsSync(mdFilePath)) {
          const content = fs.readFileSync(mdFilePath, 'utf8');
          const { data } = matter(content);
          if (data.title) {
            title = data.title;
          }
        }
      }
    } catch (error) {
      console.error(`读取文件内容失败: ${itemFullPath}`, error);
    }

    return {
      title,
      href: metaConfig.href || `/docs/${itemRelativePath}`,
      type: metaConfig.type || 'page',
      isExternal: !!metaConfig.href && metaConfig.href.startsWith('http'),
      filePath: itemRelativePath,
    };
  });
}

/**
 * 获取文档分类的侧边栏结构
 *
 * @param category 分类名称
 * @returns 侧边栏结构
 */
export function getDocSidebar(category: string): DocSidebarItem[] {
  const rootDir = path.join(process.cwd(), 'src', 'content', 'docs');
  const categoryPath = path.join(rootDir, category);

  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    console.error(`分类不存在: ${category}`);
    return [];
  }

  return getDocDirectoryStructure(rootDir, category);
}
