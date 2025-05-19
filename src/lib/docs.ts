import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  count: number;
}

export interface DocItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  date?: string;
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
    } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md')) && !item.name.startsWith('_')) {
      // 计算当前目录中的文档数量
      count += 1;
    }
  }

  return count;
}

// 获取文档分类
export function getDocCategories(): DocCategory[] {
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
  if (!fs.existsSync(docsDir)) return [];

  const categories: DocCategory[] = [];

  // 读取目录内容
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true });

  dirs.forEach(dir => {
    if (dir.isDirectory()) {
      const categoryId = dir.name;
      const categoryDir = path.join(docsDir, categoryId);

      // 递归计算文档数量，包括子目录中的文档
      const docCount = countDocsRecursively(categoryDir);

      // 尝试读取元数据文件
      let title = categoryId;
      let description = '';

      const metaPath = path.join(categoryDir, '_meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const metaContent = fs.readFileSync(metaPath, 'utf8');
          const meta = JSON.parse(metaContent);
          title = meta.title || categoryId;
          description = meta.description || '';
        } catch {
          // 如果解析失败，使用默认值
        }
      }

      categories.push({
        id: categoryId,
        title: title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' '),
        description: description || `${title}相关文档和教程`,
        count: docCount
      });
    }
  });

  return categories;
}

// 获取最新文档
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
        if (file.isFile() && (file.name.endsWith('.mdx') || file.name.endsWith('.md')) && !file.name.startsWith('_')) {
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
              date: data.date
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