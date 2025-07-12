import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractHeadings } from "@/components/common/extract-headings";
import { countWords } from "@/lib/utils";
import type { DocContentResult, DocFrontmatter } from "@/types/docs-types";
import { DOCS_CONTENT_DIR } from "@/config/docs";

export function getDocContentSimple(slug: string[]): DocContentResult {
  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const requestedPath = slug.join("/");
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;

  // 尝试直接文件
  const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
  if (fs.existsSync(possiblePathMdx)) {
    filePath = possiblePathMdx;
  } else {
    const possiblePathMd = `${absoluteRequestedPath}.md`;
    if (fs.existsSync(possiblePathMd)) {
      filePath = possiblePathMd;
    }
  }

  // 尝试 index 文件
  if (!filePath) {
    const indexPathMdx = path.join(absoluteRequestedPath, "index.mdx");
    if (fs.existsSync(indexPathMdx)) {
      filePath = indexPathMdx;
    } else {
      const indexPathMd = path.join(absoluteRequestedPath, "index.md");
      if (fs.existsSync(indexPathMd)) {
        filePath = indexPathMd;
      }
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Document not found at path: ${requestedPath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const wordCount = countWords(originalContent);
  const { headings } = extractHeadings(originalContent);
  const topLevelCategorySlug = slug[0];
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, "/")
    .replace(/\.(mdx|md)$/, "");

  return {
    content: originalContent,
    frontmatter: frontmatter as DocFrontmatter,
    headings,
    prevDoc: null,
    nextDoc: null,
    breadcrumbs: [],
    mdxContent: originalContent,
    wordCount,
    date,
    relativePathFromTopCategory,
    topLevelCategorySlug,
    isIndexPage: path.basename(filePath, path.extname(filePath)) === "index",
  };
}
