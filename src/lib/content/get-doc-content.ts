import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFlattenedDocsOrder } from "@/lib/content";
import { extractHeadings } from "@/components/layout/toc/extract-headings";
import { countWords } from "@/lib/utils";
import type {
  DocContentResult,
  DocFrontmatter,
  NavDocItem,
} from "@/types/docs-types";
import { DOCS_CONTENT_DIR, DOCS_INDEX_FILES } from "@/config/docs";

export function getDocContent(slug: string[]): DocContentResult {
  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const requestedPath = slug.join("/");
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join("/");
  let isIndexPage = false;

  if (
    fs.existsSync(absoluteRequestedPath) &&
    fs.statSync(absoluteRequestedPath).isDirectory()
  ) {
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absoluteRequestedPath, indexFile);
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
        isIndexPage = true;
        break;
      }
    }
    if (!filePath) {
      const dirSpecificFlattenedDocs = getFlattenedDocsOrder(requestedPath);
      if (dirSpecificFlattenedDocs.length > 0) {
        const firstDocRelativePath = dirSpecificFlattenedDocs[0].path.replace(
          /^\/docs\//,
          "",
        );
        filePath = path.join(docsContentDir, `${firstDocRelativePath}.mdx`);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(docsContentDir, `${firstDocRelativePath}.md`);
        }
        actualSlugForNav = firstDocRelativePath;
      }
    }
  }

  if (!filePath) {
    const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
    if (fs.existsSync(possiblePathMdx)) {
      filePath = possiblePathMdx;
    } else {
      const possiblePathMd = `${absoluteRequestedPath}.md`;
      if (fs.existsSync(possiblePathMd)) {
        filePath = possiblePathMd;
      }
    }
    actualSlugForNav = slug.join("/");
    isIndexPage =
      path.basename(filePath || "", path.extname(filePath || "")) === "index";
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
  const mdxContent = originalContent; // 页面层负责渲染
  const topLevelCategorySlug = slug[0];
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, "/")
    .replace(/\.(mdx|md)$/, "");
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null;
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc =
      flattenedDocs.find(
        (doc) =>
          doc.path.startsWith(indexDirNavPath + "/") ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes("/")),
      ) || null;
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(
      (doc) => doc.path === currentNavPath,
    );
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc =
        currentIndex < flattenedDocs.length - 1
          ? flattenedDocs[currentIndex + 1]
          : null;
    }
  }

  // breadcrumbs 由页面层负责生成

  return {
    content: originalContent,
    frontmatter: frontmatter as DocFrontmatter,
    headings,
    prevDoc,
    nextDoc,
    breadcrumbs: [], // 页面层生成
    mdxContent,
    wordCount,
    date,
    relativePathFromTopCategory,
    topLevelCategorySlug,
    isIndexPage,
  };
}
