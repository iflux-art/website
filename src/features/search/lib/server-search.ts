/**
 * 服务端搜索工具函数
 * 仅用于 API routes 和其他服务端环境，不应在客户端导入
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { glob } from "fast-glob";
import matter from "gray-matter";
import type { SearchResult } from "../types";

interface LinkItem {
  title: string;
  description?: string;
  url?: string;
  tags?: string[];
}

// 内存缓存
let contentCache: {
  blogs: SearchResult[];
  docs: SearchResult[];
  links: SearchResult[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 扫描内容文件（博客/文档）
 */
async function scanContentFiles(contentType: "blog" | "docs"): Promise<SearchResult[]> {
  const basePath = path.join(process.cwd(), `src/content/${contentType}`);
  const files = await glob("**/*.mdx", { cwd: basePath });
  const results: SearchResult[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(basePath, file);
      const content = await fs.readFile(filePath, "utf-8");

      try {
        const { data: frontmatter } = matter(content);
        if (frontmatter?.title && typeof frontmatter.title === "string") {
          results.push({
            type: contentType === "blog" ? "blog" : "doc",
            title: frontmatter.title,
            description:
              typeof frontmatter.description === "string" ? frontmatter.description : undefined,
            path: `/${contentType}/${file.replace(/\.mdx$/, "")}`,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : undefined,
          });
        }
      } catch {
        // Skip files with invalid frontmatter format
      }
    } catch {
      // Skip files that cannot be read
    }
  }

  return results;
}

/**
 * 扫描链接文件
 */
async function scanLinkFiles(): Promise<SearchResult[]> {
  const linksDir = path.join(process.cwd(), "src/content/links");
  const results: SearchResult[] = [];

  try {
    // 读取根目录下的JSON文件
    const rootFiles = await fs.readdir(linksDir);
    for (const file of rootFiles) {
      if (file.endsWith(".json") && file !== "index.js") {
        const filePath = path.join(linksDir, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const items: LinkItem[] = JSON.parse(fileContent);

        items.forEach(item => {
          results.push({
            type: "link",
            title: item.title,
            description: item.description,
            url: item.url,
            tags: item.tags,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error scanning link files:", error);
  }

  return results;
}

/**
 * 获取缓存的内容
 */
export async function getCachedContent() {
  const now = Date.now();
  if (contentCache && now - contentCache.timestamp < CACHE_TTL) {
    return contentCache;
  }

  const [blogs, docs, links] = await Promise.all([
    scanContentFiles("blog"),
    scanContentFiles("docs"),
    scanLinkFiles(),
  ]);

  contentCache = { blogs, docs, links, timestamp: now };
  return contentCache;
}

/**
 * 执行服务端搜索
 */
export async function performServerSearch(
  query: string,
  type = "all",
  limit = 10
): Promise<{ results: SearchResult[]; total: number }> {
  if (!query.trim()) {
    return { results: [], total: 0 };
  }

  const { blogs, docs, links } = await getCachedContent();
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // 搜索链接
  if (type === "all" || type === "links") {
    const linkResults = links
      .filter(link => {
        const searchText =
          `${link.title} ${link.description} ${link.tags?.join(" ")}`.toLowerCase();
        return searchText.includes(queryLower);
      })
      .slice(0, 5);
    results.push(...linkResults);
  }

  // 搜索博客
  if (type === "all" || type === "blog") {
    const blogResults = blogs
      .filter(post => {
        const searchText =
          `${post.title} ${post.description} ${post.tags?.join(" ")}`.toLowerCase();
        return searchText.includes(queryLower);
      })
      .slice(0, 5);
    results.push(...blogResults);
  }

  // 搜索文档
  if (type === "all" || type === "doc") {
    const docResults = docs
      .filter(doc => {
        const searchText = `${doc.title} ${doc.description}`.toLowerCase();
        return searchText.includes(queryLower);
      })
      .slice(0, 5);
    results.push(...docResults);
  }

  // 按匹配度排序
  results.sort((a, b) => {
    const aScore = a.title.toLowerCase().includes(queryLower) ? 1 : 0;
    const bScore = b.title.toLowerCase().includes(queryLower) ? 1 : 0;
    return bScore - aScore;
  });

  return {
    results: results.slice(0, limit),
    total: results.length,
  };
}
