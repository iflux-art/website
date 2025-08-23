import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import type { BlogPost } from '@/features/blog/types';
/**
 * 生成slug的辅助函数
 */
const generateSlug = (relativePath: string): string => {
  const pathParts = relativePath.split(path.sep);

  if (pathParts.length === 1) {
    // 直接在blog目录下的文件
    return pathParts[0].replace(/\.(mdx|md)$/, '');
  } else {
    // 在子目录中的文件
    const fileName = pathParts.pop() ?? '';
    return `${pathParts.join('/')}/${fileName.replace(/\.(mdx|md)$/, '')}`;
  }
};

/**
 * 检查文件是否为Markdown文件
 */
const isMarkdownFile = (fileName: string): boolean =>
  fileName.endsWith('.mdx') || fileName.endsWith('.md');

/**
 * 处理单个文件的函数
 */
const processFile = (itemPath: string, blogDir: string, posts: BlogPost[]): void => {
  const fileContent = fs.readFileSync(itemPath, 'utf8');
  const { data } = matter(fileContent);

  // 只包含已发布的文章
  if (data.published !== false) {
    const relativePath = path.relative(blogDir, itemPath);
    const slug = generateSlug(relativePath);

    posts.push({
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? '暂无描述',
      excerpt: (data.excerpt as string) ?? '点击阅读全文',
      date: data.date as string,
      image: data.cover as string | undefined,
      tags: (data.tags as string[]) ?? [],
      category: (data.category as string) ?? '未分类',
    });
  }
};

/**
 * 递归函数来查找所有博客文件
 */
const findPosts = (dir: string, blogDir: string, posts: BlogPost[]): void => {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      findPosts(itemPath, blogDir, posts);
    } else if (item.isFile() && isMarkdownFile(item.name)) {
      processFile(itemPath, blogDir, posts);
    }
  }
};

/**
 * 对文章按日期排序
 */
const sortPostsByDate = (posts: BlogPost[]): BlogPost[] =>
  posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

// 获取所有博客文章
async function getAllPosts() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];
  findPosts(blogDir, blogDir, posts);
  return sortPostsByDate(posts);
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    // 设置缓存控制头，避免浏览器缓存
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('获取博客文章列表失败:', error);
    return NextResponse.json(
      {
        error: '获取博客文章列表失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
