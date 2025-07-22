/**
 * 面包屑导航项生成与处理工具函数
 * 原内容迁移自 components/common/breadcrumb/breadcrumb-utils.ts
 */
import type { BreadcrumbItem } from "packages/types/common-component-types";
import fs from "fs";
import path from "path";
import { sync as globSync } from "glob";

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

interface BlogBreadcrumbProps {
  slug: string[];
  title: string;
}

export function createBlogBreadcrumbs({
  slug,
  title,
}: BlogBreadcrumbProps): BreadcrumbItem[] {
  return generateBreadcrumbs({
    basePath: "blog",
    slug,
    currentTitle: title,
    startLabel: "博客",
  });
}

interface DocBreadcrumbProps {
  slug: string[];
  title?: string;
  meta?: Record<string, { title?: string }>;
}

export function createDocBreadcrumbs({
  slug,
  title,
  meta,
}: DocBreadcrumbProps): BreadcrumbItem[] {
  return generateBreadcrumbs({
    basePath: "docs",
    slug,
    currentTitle: title,
    meta,
    startLabel: "文档",
    segmentProcessor: (segment, index, meta) => {
      if (meta?.[segment]?.title) {
        return meta[segment].title;
      }
      return title && index === slug.length - 1 ? title : segment;
    },
  });
}

/**
 * 服务端专用：生成 docs 面包屑，label 优先 _meta.json title，href 跳转目录下第一文档
 */
export function createDocBreadcrumbsServer(
  slug: string[],
  currentTitle?: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  // 根目录
  items.push({ label: getDirectoryTitle([]), href: "/docs" });
  for (let i = 0; i < slug.length; i++) {
    const dir = slug.slice(0, i + 1);
    const isLast = i === slug.length - 1;
    // 只在最后一级用 currentTitle，否则用目录 title
    const label =
      isLast && currentTitle ? currentTitle : getDirectoryTitle(dir);
    if (!isLast) {
      const firstDoc = getFirstDocInDirectory(dir);
      if (firstDoc) {
        items.push({ label, href: "/docs/" + firstDoc.join("/") });
      } else {
        items.push({ label });
      }
    } else {
      // 最后一级只加一次 label，无 href
      items.push({ label });
    }
  }
  return items;
}

/**
 * 获取目录 title（优先 _meta.json 的 title 字段，没有则 fallback slug）
 */
export function getDirectoryTitle(dirSlug: string[]): string {
  const docsDir = path.join(process.cwd(), "src", "content", "docs");
  if (dirSlug.length === 0) return "文档";
  // 上级目录 _meta.json
  const parent = dirSlug.slice(0, -1);
  const metaPath = path.join(docsDir, ...parent, "_meta.json");
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    const key = dirSlug[dirSlug.length - 1];
    if (meta[key] && meta[key].title) return meta[key].title;
  }
  return dirSlug[dirSlug.length - 1];
}

/**
 * 获取目录下的第一篇文档 slug（不含扩展名）
 * 优先 _meta.json 顺序，否则按文件名排序
 */
export function getFirstDocInDirectory(dirSlug: string[]): string[] | null {
  const docsDir = path.join(
    process.cwd(),
    "src",
    "content",
    "docs",
    ...dirSlug,
  );
  // 1. 优先 _meta.json 顺序
  const metaPath = path.join(docsDir, "_meta.json");
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    const keys = Object.keys(meta);
    for (const key of keys) {
      // 检查是否有对应的 md/mdx 文件
      const mdx = path.join(docsDir, `${key}.mdx`);
      const md = path.join(docsDir, `${key}.md`);
      if (fs.existsSync(mdx) || fs.existsSync(md)) {
        return [...dirSlug, key];
      }
    }
  }
  // 2. 没有 _meta.json 或未命中，按文件名排序
  const files = globSync("*.{md,mdx}", { cwd: docsDir });
  if (files.length > 0) {
    const first = files.sort()[0].replace(/\.(md|mdx)$/, "");
    return [...dirSlug, first];
  }
  return null;
}
