import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';

/**
 * 获取所有博客文章并按年份分组
 */
function getPostsByYear(): Record<string, BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return {};

  const postsByYear: Record<string, BlogPost[]> = {};

  // 递归函数来查找所有博客文件
  const findPostsInDirectory = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findPostsInDirectory(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);

        // 确保文章有日期且已发布
        if (data.date && data.published !== false) {
          const date = new Date(data.date);
          const year = date.getFullYear().toString();

          // 创建年份分组（如果不存在）
          if (!postsByYear[year]) {
            postsByYear[year] = [];
          }

          // 添加文章到对应年份
          const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, '');

          // 获取文章路径（不包含扩展名）
          const relativeDir = path.relative(blogDir, path.dirname(itemPath));
          const fullSlug = relativeDir ? `${relativeDir}/${slug}`.replace(/\\/g, '/') : slug;

          postsByYear[year].push({
            slug: fullSlug,
            title: data.title || slug,
            date: data.date,
            description: data.description || data.excerpt || '',
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            author: data.author || '',
            authorAvatar: data.authorAvatar || null,
            authorBio: data.authorBio || '',
            published: data.published ?? true,
          });
        }
      }
    }
  };

  findPostsInDirectory(blogDir);

  // 对每个年份内的文章按日期排序（从新到旧）
  Object.keys(postsByYear).forEach(year => {
    postsByYear[year].sort((a, b) => {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });
  });

  return postsByYear;
}

/**
 * GET 处理程序
 * 返回按年份分组的博客文章
 */
export async function GET() {
  try {
    const postsByYear = getPostsByYear();
    return NextResponse.json(postsByYear);
  } catch (error) {
    console.error('Error fetching timeline posts:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline posts' }, { status: 500 });
  }
}
