/**
 * 博客搜索功能
 * 提供博客内容的搜索能力
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { BlogSearchResult } from "@/features/blog/types";

interface BlogPost {
  title: string;
  description: string;
  content: string;
  url: string;
  date: string;
}

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
}

/**
 * 递归读取目录下的所有 .md 和 .mdx 文件
 */
async function getAllFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(entry => {
        const res = path.resolve(dirPath, entry.name);
        return entry.isDirectory() ? getAllFiles(res) : res;
      })
    );
    return files.flat().filter(file => /\.(md|mdx)$/.test(file));
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

/**
 * 读取博客内容
 */
async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const files = await getAllFiles(blogDir);

  const posts = await Promise.all(
    files.map(async file => {
      try {
        const content = await fs.readFile(file, "utf-8");
        const { data, content: markdown } = matter(content);
        const frontmatter = data as Frontmatter;
        const relativePath = path.relative(blogDir, file);
        const url = `/blog/${relativePath.replace(/\.(md|mdx)$/, "")}`;

        return {
          title: frontmatter.title ?? "",
          description: frontmatter.description ?? "",
          content: markdown,
          url,
          date: frontmatter.date ?? "",
        };
      } catch (error) {
        console.error("Error reading file:", file, error);
        return {
          title: "",
          description: "",
          content: "",
          url: "",
          date: "",
        };
      }
    })
  );

  return posts;
}

/**
 * 搜索博客文章
 */
export async function searchBlogPosts(query: string, limit = 10): Promise<BlogSearchResult[]> {
  try {
    const blogPosts = await getBlogPosts();
    const searchResults = blogPosts
      .filter(post => {
        const searchContent = `${post.title} ${post.description} ${post.content}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      })
      .map(post => ({
        title: post.title,
        path: post.url,
        excerpt: post.description || `${post.content.slice(0, 160)}...`,
      }))
      .slice(0, limit);

    return searchResults;
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return [];
  }
}
