/**
 * 文档搜索功能
 * 提供文档内容的搜索能力
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { DocSearchResult } from "@/features/docs/types";

interface DocFile {
  title: string;
  description: string;
  content: string;
  url: string;
  category: string;
}

interface Frontmatter {
  title?: string;
  description?: string;
  category?: string;
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
 * 读取文档内容
 */
async function getDocs(): Promise<DocFile[]> {
  const docsDir = path.join(process.cwd(), "src/content/docs");
  const files = await getAllFiles(docsDir);

  const docs = await Promise.all(
    files.map(async file => {
      try {
        const content = await fs.readFile(file, "utf-8");
        const { data, content: markdown } = matter(content);
        const frontmatter = data as Frontmatter;
        const relativePath = path.relative(docsDir, file);
        const url = `/docs/${relativePath.replace(/\.(md|mdx)$/, "")}`;

        return {
          title: frontmatter.title ?? "",
          description: frontmatter.description ?? "",
          content: markdown,
          url,
          category: frontmatter.category ?? "",
        };
      } catch (error) {
        console.error("Error reading file:", file, error);
        return {
          title: "",
          description: "",
          content: "",
          url: "",
          category: "",
        };
      }
    })
  );

  return docs;
}

/**
 * 搜索文档
 */
export async function searchDocs(query: string, limit = 10): Promise<DocSearchResult[]> {
  try {
    const docs = await getDocs();
    const searchResults = docs
      .filter(doc => {
        const searchContent = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      })
      .map(doc => ({
        title: doc.title,
        path: doc.url,
        excerpt: doc.description || `${doc.content.slice(0, 160)}...`,
      }))
      .slice(0, limit);

    return searchResults;
  } catch (error) {
    console.error("Error searching docs:", error);
    return [];
  }
}
