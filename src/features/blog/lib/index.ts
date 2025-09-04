/**
 * 博客相关工具函数
 */
export { getBlogContent } from "./blog-content";
import fs from "node:fs";
import path from "node:path";
import type { BlogPost } from "@/features/blog/types";
import type { BreadcrumbItem } from "@/features/navbar/types";
import matter from "gray-matter";

// ==================== 面包屑导航相关类型和函数 ====================

interface GenerateBreadcrumbsOptions {
  basePath: string;
  slug: string[];
  meta?: Record<string, { title?: string }>;
  currentTitle?: string;
  startLabel: string;
  segmentProcessor?: (
    segment: string,
    index: number,
    meta?: Record<string, { title?: string }>
  ) => string;
}

interface BlogBreadcrumbProps {
  slug: string[];
  title: string;
}

/**
 * 生成面包屑导航的通用函数
 */
export function generateBreadcrumbs({
  basePath,
  slug,
  meta,
  currentTitle,
  startLabel,
  segmentProcessor,
}: GenerateBreadcrumbsOptions): { label: string; href?: string }[] {
  const items: { label: string; href?: string }[] = [{ label: startLabel, href: `/${basePath}` }];
  let currentPath = "";

  slug.forEach((segment, index) => {
    const isLastSegment = index === slug.length - 1;
    currentPath += `/${segment}`;

    const label = (() => {
      if (segmentProcessor) {
        return segmentProcessor(segment, index, meta);
      }
      if (isLastSegment && currentTitle) {
        return currentTitle;
      }
      return segment;
    })();

    if (isLastSegment) {
      items.push({ label });
    } else {
      items.push({ label, href: `/${basePath}${currentPath}` });
    }
  });

  return items;
}

/**
 * 获取博客目录的显示名称
 * 根据实际的文件夹结构返回友好的显示名称
 */
function getBlogDirectoryTitle(segment: string): string {
  const directoryTitleMap: Record<string, string> = {
    ai: "人工智能",
    dev: "开发技术",
    essays: "随笔感悟",
    music: "音乐制作",
    ops: "运维部署",
    project: "项目经验",
    software: "软件工具",
  };

  return directoryTitleMap[segment] || segment;
}

/**
 * 创建博客面包屑导航
 */
export function createBlogBreadcrumbs({ slug, title }: BlogBreadcrumbProps): BreadcrumbItem[] {
  return generateBreadcrumbs({
    basePath: "blog",
    slug,
    currentTitle: title,
    startLabel: "博客",
    segmentProcessor: (segment, index) => {
      // 如果是最后一个段落且有标题，使用标题
      const isLastSegment = index === slug.length - 1;
      if (isLastSegment && title) {
        return title;
      }
      // 否则使用目录映射名称
      return getBlogDirectoryTitle(segment);
    },
  });
}

// ==================== 博客相关函数 ====================

// 检查文件是否为Markdown文件
function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".mdx") || fileName.endsWith(".md");
}

// 生成文章slug
function generateBlogSlug(itemPath: string, blogDir: string): string {
  const pathParts = itemPath.split(blogDir)[1]?.split(path.sep).filter(Boolean) ?? [];

  if (pathParts.length === 1) {
    // 直接在blog目录下的文件
    // 修复：添加空值检查
    return (pathParts[0] ?? "").replace(/\.(mdx|md)$/, "");
  } else {
    // 在子目录中的文件
    const fileName = pathParts.pop() ?? "";
    return `${pathParts.join("/")}/${fileName.replace(/\.(mdx|md)$/, "")}`;
  }
}

// 创建BlogPost对象
function createBlogPost(data: Record<string, unknown>, slug: string): BlogPost {
  return {
    slug,
    title: (data.title ?? slug) as string,
    description: (data.description ?? data.excerpt ?? "点击阅读全文") as string,
    excerpt: (data.excerpt ?? "点击阅读全文") as string,
    date: String(data.date),
    tags: (data.tags ?? []) as string[],
  } satisfies BlogPost;
}

// 处理单个文件的函数
function processFile(itemPath: string, blogDir: string, posts: BlogPost[]): void {
  const fileContent = fs.readFileSync(itemPath, "utf8");
  const { data } = matter(fileContent);

  // 只包含已发布的文章
  if (data.published !== false) {
    const slug = generateBlogSlug(itemPath, blogDir);

    posts.push({
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "暂无描述",
      excerpt: (data.excerpt as string) ?? "点击阅读全文",
      date: data.date as string,
      image: data.cover as string | undefined,
      tags: (data.tags as string[]) ?? [],
      category: (data.category as string) ?? "未分类",
    });
  }
}

/**
 * 递归函数来查找所有博客文件
 */
function findPosts(dir: string, blogDir: string, posts: BlogPost[]): void {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      findPosts(itemPath, blogDir, posts);
    } else if (item.isFile() && isMarkdownFile(item.name)) {
      processFile(itemPath, blogDir, posts);
    }
  }
}

/**
 * 对文章按日期排序
 */
function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

/**
 * 获取所有博客文章
 * @returns 所有博客文章数组
 */
export function getAllPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];
  findPosts(blogDir, blogDir, posts);
  return sortPostsByDate(posts);
}

// 处理文件收集标签
function collectTagsFromFile(itemPath: string, allTags: Set<string>): void {
  const fileContent = fs.readFileSync(itemPath, "utf8");
  const { data } = matter(fileContent);

  // 只收集已发布文章的标签
  if (data.published !== false && data.tags && Array.isArray(data.tags)) {
    for (const tag of data.tags) {
      allTags.add(tag);
    }
  }
}

/**
 * 获取所有标签
 * @returns 所有标签数组
 */
export function getAllTags(): string[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const allTags = new Set<string>();

  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && isMarkdownFile(item.name)) {
        collectTagsFromFile(itemPath, allTags);
      }
    }
  };

  findTagsInFiles(blogDir);
  return Array.from(allTags).sort();
}

// 处理文件计数标签
function countTagsFromFile(itemPath: string, tagCounts: Record<string, number>): void {
  const fileContent = fs.readFileSync(itemPath, "utf8");
  const { data } = matter(fileContent);

  // 只收集已发布文章的标签
  if (data.published !== false && data.tags && Array.isArray(data.tags)) {
    for (const tag of data.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
}

/**
 * 获取所有标签及其文章数量
 * @returns 标签及其文章数量的记录
 */
export function getAllTagsWithCount(): Record<string, number> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return {};

  const tagCounts: Record<string, number> = {};

  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && isMarkdownFile(item.name)) {
        countTagsFromFile(itemPath, tagCounts);
      }
    }
  };

  findTagsInFiles(blogDir);
  return tagCounts;
}

// 检查文章是否包含指定标签
function hasTag(data: Record<string, unknown>, tag: string): boolean {
  // 检查文章是否已发布（默认为true，除非明确设置为false）
  const isPublished = data.published !== false;
  const hasTags = data.tags && Array.isArray(data.tags);
  const includesTag = hasTags && (data.tags as string[]).includes(tag);

  return Boolean(isPublished && hasTags && includesTag);
}

// 处理单个文件的函数
function processPostFile(itemPath: string, blogDir: string, tag: string, posts: BlogPost[]): void {
  const fileContent = fs.readFileSync(itemPath, "utf8");
  const { data } = matter(fileContent);

  if (hasTag(data, tag)) {
    const slug = generateBlogSlug(itemPath, blogDir);
    const post = createBlogPost(data, slug);
    posts.push(post);
  }
}

/**
 * 根据标签获取文章
 * @param tag 标签
 * @returns 文章数组
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];

  // 递归函数来查找所有博客文件
  const findPostsWithTag = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findPostsWithTag(itemPath);
      } else if (item.isFile() && isMarkdownFile(item.name)) {
        processPostFile(itemPath, blogDir, tag, posts);
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

/**
 * 检查文件是否为Markdown文件
 */
const isMarkdownFileForTimeline = (fileName: string): boolean =>
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
const createBlogPostForTimeline = (
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
const processFileForTimeline = (
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
    const post = createBlogPostForTimeline(itemPath, data, blogDir);
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
    } else if (item.isFile() && isMarkdownFileForTimeline(item.name)) {
      processFileForTimeline(itemPath, blogDir, postsByYear);
    }
  }
};

/**
 * 对文章按年份和日期排序
 */
const sortPostsByYear = (postsByYear: Record<string, BlogPost[]>): void => {
  Object.keys(postsByYear).forEach(year => {
    // 修复：添加类型检查以确保 postsByYear[year] 存在
    const posts = postsByYear[year];
    if (posts) {
      posts.sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime());
    }
  });
};

/**
 * 获取所有博客文章并按年份分组
 */
export function getPostsByYear(): Record<string, BlogPost[]> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return {};

  const postsByYear: Record<string, BlogPost[]> = {};

  findPostsInDirectory(blogDir, blogDir, postsByYear);
  sortPostsByYear(postsByYear);

  return postsByYear;
}
