import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types";

export function getAllTags(): string[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const allTags = new Set<string>();

  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (
        (item.name.endsWith(".mdx") || item.name.endsWith(".md")) &&
        !item.name.startsWith("_")
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { data: frontmatter } = matter(fileContent);
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
          frontmatter.tags.forEach((tag: string) => allTags.add(tag));
        }
      }
    }
  };

  findTagsInFiles(blogDir);
  return Array.from(allTags).sort();
}

export function getAllTagsWithCount(): Record<string, number> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return {};

  const tagCounts: Record<string, number> = {};

  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (
        (item.name.endsWith(".mdx") || item.name.endsWith(".md")) &&
        !item.name.startsWith("_")
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { data: frontmatter } = matter(fileContent);
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
          frontmatter.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      }
    }
  };

  findTagsInFiles(blogDir);
  return tagCounts;
}

export function getPostsByTag(tag: string): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];

  const findPostsWithTag = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        findPostsWithTag(itemPath);
      } else if (
        (item.name.endsWith(".mdx") || item.name.endsWith(".md")) &&
        !item.name.startsWith("_")
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { data: frontmatter } = matter(fileContent);
        if (
          frontmatter.tags &&
          Array.isArray(frontmatter.tags) &&
          frontmatter.tags.includes(tag)
        ) {
          posts.push({
            slug: itemPath
              .replace(blogDir, "")
              .replace(/\.(mdx|md)$/, "")
              .replace(/^[\\/]+/, ""),
            title: frontmatter.title || item.name.replace(/\.(mdx|md)$/, ""),
            description: frontmatter.description || "",
            date: frontmatter.date,
            tags: frontmatter.tags || [],
            excerpt: frontmatter.excerpt || frontmatter.description || "",
          });
        }
      }
    }
  };

  findPostsWithTag(blogDir);

  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}
