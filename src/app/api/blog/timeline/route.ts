import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import type { BlogPost } from "@/features/blog/types";

/**
 * 检查文件是否为Markdown文件
 */
const isMarkdownFile = (fileName: string): boolean =>
  fileName.endsWith(".mdx") || fileName.endsWith(".md");

/**
 * 生成完整slug的函数
 */
const generateFullSlug = (itemPath: string, blogDir: string): string => {
  const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, "");
  const relativeDir = path.relative(blogDir, path.dirname(itemPath));
  return relativeDir ? `${relativeDir}/${slug}`.replace(/\\/g, "/") : slug;
};

/**
 * 创建BlogPost对象的函数
 */
const createBlogPost = (
  itemPath: string,
  data: Record<string, unknown>,
  blogDir: string
): BlogPost => {
  const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, "");
  const fullSlug = generateFullSlug(itemPath, blogDir);

  return {
    slug: fullSlug,
    title: (data.title as string) ?? slug,
    date: data.date as Date,
    description: (data.description as string) ?? (data.excerpt as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    author: (data.author as string) ?? "",
    authorAvatar: (data.authorAvatar as string) ?? null,
    authorBio: (data.authorBio as string) ?? "",
    published: (data.published as boolean) ?? true,
  };
};

/**
 * 处理单个文件的函数
 */
const processFile = (
  itemPath: string,
  blogDir: string,
  postsByYear: Record<string, BlogPost[]>
): void => {
  const fileContent = fs.readFileSync(itemPath, "utf8");
  const { data } = matter(fileContent);

  // 确保文章有日期且已发布
  if (data.date && data.published !== false) {
    const date = new Date(data.date as string | number | Date);
    const year = date.getFullYear().toString();

    // 创建年份分组（如果不存在）
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }

    // 添加文章到对应年份
    const post = createBlogPost(itemPath, data, blogDir);
    postsByYear[year].push(post);
  }
};

/**
 * 递归函数来查找所有博客文件
 */
const findPostsInDirectory = (
  dir: string,
  blogDir: string,
  postsByYear: Record<string, BlogPost[]>
): void => {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      findPostsInDirectory(itemPath, blogDir, postsByYear);
    } else if (item.isFile() && isMarkdownFile(item.name)) {
      processFile(itemPath, blogDir, postsByYear);
    }
  }
};

/**
 * 对文章按年份和日期排序
 */
const sortPostsByYear = (postsByYear: Record<string, BlogPost[]>): void => {
  Object.keys(postsByYear).forEach(year => {
    postsByYear[year].sort(
      (a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
    );
  });
};

/**
 * 获取所有博客文章并按年份分组
 */
function getPostsByYear(): Record<string, BlogPost[]> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return {};

  const postsByYear: Record<string, BlogPost[]> = {};

  findPostsInDirectory(blogDir, blogDir, postsByYear);
  sortPostsByYear(postsByYear);

  return postsByYear;
}

/**
 * GET 处理程序
 * 返回按年份分组的博客文章
 */
// biome-ignore lint/style/useNamingConvention: Next.js API 路由标准命名
export function GET() {
  try {
    const postsByYear = getPostsByYear();
    return NextResponse.json(postsByYear);
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    return NextResponse.json({ error: "Failed to fetch timeline posts" }, { status: 500 });
  }
}
