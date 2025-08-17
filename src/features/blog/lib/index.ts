/**
 * 博客相关工具函数
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "../types";
import type { BreadcrumbItem } from "@/features/content/types";

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
    meta?: Record<string, { title?: string }>,
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
}: GenerateBreadcrumbsOptions): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: startLabel, href: `/${basePath}` }];
  let currentPath = "";

  slug.forEach((segment, index) => {
    const isLastSegment = index === slug.length - 1;
    currentPath += `/${segment}`;

    const label = segmentProcessor
      ? segmentProcessor(segment, index, meta)
      : isLastSegment && currentTitle
        ? currentTitle
        : segment;

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
export function createBlogBreadcrumbs({
  slug,
  title,
}: BlogBreadcrumbProps): BreadcrumbItem[] {
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
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
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
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
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
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { data } = matter(fileContent);

        // 检查是否包含指定标签
        if (
          data.published !== false &&
          data.tags &&
          Array.isArray(data.tags) &&
          data.tags.includes(tag)
        ) {
          // 计算slug
          let slug = "";
          const relativePath = path.relative(blogDir, itemPath);
          const pathParts = relativePath.split(path.sep);

          if (pathParts.length === 1) {
            // 直接在blog目录下的文件
            slug = pathParts[0].replace(/\.(mdx|md)$/, "");
          } else {
            // 在子目录中的文件
            const fileName = pathParts.pop() || "";
            slug = `${pathParts.join("/")}/${fileName.replace(/\.(mdx|md)$/, "")}`;
          }

          posts.push({
            slug,
            title: data.title || slug,
            description: data.description || data.excerpt || "点击阅读全文",
            excerpt: data.excerpt || "点击阅读全文",
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
