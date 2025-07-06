import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

type ContentType = "blog" | "docs" | "else";

interface ContentItem {
  slug: string[];
  content: string;
  frontmatter: Record<string, unknown>;
  type: ContentType;
}

export class ContentLoader {
  private static instance: ContentLoader;
  private contentRoot: string;

  private constructor() {
    this.contentRoot = path.join(process.cwd(), "src/content");
  }

  public static getInstance(): ContentLoader {
    if (!ContentLoader.instance) {
      ContentLoader.instance = new ContentLoader();
    }
    return ContentLoader.instance;
  }

  private getContentType(slug: string[]): ContentType {
    if (slug[0] === "blog") return "blog";
    if (slug[0] === "docs") return "docs";
    return "else";
  }

  async getContent(slug: string[]): Promise<ContentItem> {
    const contentType = this.getContentType(slug);
    const contentPath = path.join(this.contentRoot, ...slug);

    // Check for .mdx file
    const mdxPath = `${contentPath}.mdx`;
    if (fs.existsSync(mdxPath)) {
      const fileContent = fs.readFileSync(mdxPath, "utf8");
      const { content, data } = matter(fileContent);
      return {
        slug,
        content,
        frontmatter: data,
        type: contentType,
      };
    }

    // Check for .md file
    const mdPath = `${contentPath}.md`;
    if (fs.existsSync(mdPath)) {
      const fileContent = fs.readFileSync(mdPath, "utf8");
      const { content, data } = matter(fileContent);
      return {
        slug,
        content,
        frontmatter: data,
        type: contentType,
      };
    }

    // Check for index file in directory
    const indexPath = path.join(contentPath, "index.mdx");
    if (fs.existsSync(indexPath)) {
      const fileContent = fs.readFileSync(indexPath, "utf8");
      const { content, data } = matter(fileContent);
      return {
        slug: [...slug, "index"],
        content,
        frontmatter: data,
        type: contentType,
      };
    }

    notFound();
  }

  async getRelatedContent(
    slug: string[],
    type: ContentType,
  ): Promise<ContentItem[]> {
    const contentDir = path.join(this.contentRoot, type);
    const currentDir = path.join(contentDir, ...slug.slice(0, -1));

    if (!fs.existsSync(currentDir)) {
      return [];
    }

    const files = fs.readdirSync(currentDir);
    const relatedItems: ContentItem[] = [];

    for (const file of files) {
      if (file.endsWith(".mdx") || file.endsWith(".md")) {
        if (
          file === `${slug[slug.length - 1]}.mdx` ||
          file === `${slug[slug.length - 1]}.md`
        ) {
          continue;
        }

        const filePath = path.join(currentDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { content, data } = matter(fileContent);

        relatedItems.push({
          slug: [...slug.slice(0, -1), file.replace(/\.mdx?$/, "")],
          content,
          frontmatter: data,
          type,
        });
      }
    }

    return relatedItems;
  }
}
