import { notFound } from "next/navigation";
import { Breadcrumb } from "packages/ui/components/content/breadcrumb";
import { createBlogBreadcrumbs } from "packages/lib/navigation/breadcrumb";
import { ContentDisplay } from "packages/ui/components/content/content-display";
import { RelatedPosts } from "packages/ui/components/content/related-posts";
import { TableOfContents } from "packages/ui/components/content/table-of-contents";
import { MDXCodeEnhance } from "packages/ui/components/mdx/mdx-code-enhance";
import React from "react";
import ClientMDXRenderer from "packages/ui/components/mdx/ClientMDXRenderer";
import { TwikooComment } from "packages/ui/components/twikoo-comment";

// 内联 getBlogContent 及其依赖
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractHeadings } from "packages/ui/components/content/extract-headings";
import type { BlogFrontmatter } from "packages/types/blog-types";
import { sync as globSync } from "glob";

function scanContentDirectory(options: {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}): { slug: string[] }[] {
  const {
    contentDir,
    indexFiles = ["index.mdx", "index.md"],
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter = () => true,
  } = options;

  const paths: { slug: string[] }[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (item.name.startsWith(excludePrefix)) continue;
        const newSlug = [...currentSlug, item.name];
        let hasIndex = false;
        for (const indexFile of indexFiles) {
          const indexPath = path.join(itemPath, indexFile);
          if (fs.existsSync(indexPath) && filter(indexPath)) {
            paths.push({ slug: newSlug });
            hasIndex = true;
            break;
          }
        }
        if (!hasIndex) {
          scan(itemPath, newSlug);
        }
      } else if (
        item.isFile() &&
        extensions.some((ext) => item.name.endsWith(ext)) &&
        !item.name.startsWith(excludePrefix) &&
        !indexFiles.includes(item.name) &&
        filter(itemPath)
      ) {
        const fileName = item.name.replace(
          new RegExp(`(${extensions.join("|")})$`),
          "",
        );
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }
  scan(contentDir);
  return paths;
}

function generateBlogPaths(): { slug: string[] }[] {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), "src", "content", "blog"),
    excludePrefix: "_",
    filter: (itemPath) => {
      try {
        const content = fs.readFileSync(itemPath, "utf8");
        const { data } = matter(content);
        return data.published !== false;
      } catch {
        return false;
      }
    },
  });
}

// 递归查找博客文件
function findBlogFile(slug: string[]): string | null {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const relativePath = path.join(...slug);
  // 1. 直接文件
  const mdxPath = path.join(blogDir, `${relativePath}.mdx`);
  if (fs.existsSync(mdxPath)) return mdxPath;
  const mdPath = path.join(blogDir, `${relativePath}.md`);
  if (fs.existsSync(mdPath)) return mdPath;
  // 2. index 文件
  const indexMdx = path.join(blogDir, relativePath, "index.mdx");
  if (fs.existsSync(indexMdx)) return indexMdx;
  const indexMd = path.join(blogDir, relativePath, "index.md");
  if (fs.existsSync(indexMd)) return indexMd;
  return null;
}

// 获取所有博客 frontmatter
function getAllBlogMeta(): Array<{
  slug: string[];
  frontmatter: BlogFrontmatter;
}> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const files = globSync("**/*.{md,mdx}", { cwd: blogDir });
  return files.map((file) => {
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    const slug = file
      .replace(/\\/g, "/")
      .replace(/\.(md|mdx)$/, "")
      .split("/");
    return {
      slug,
      frontmatter: data as BlogFrontmatter,
    };
  });
}

async function getBlogContent(slug: string[]): Promise<{
  slug: string[];
  content: string;
  frontmatter: BlogFrontmatter;
  headings: { level: number; text: string; id: string }[];
  type: string;
  relatedPosts: Array<{ title: string; href: string; category?: string }>;
}> {
  const filePath = findBlogFile(slug);
  if (!filePath) throw new Error(`Blog not found: ${slug.join("/")}`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);
  const safeFrontmatter = data as BlogFrontmatter;
  const { headings } = extractHeadings(content);

  // 相关文章推荐逻辑
  const allMeta = getAllBlogMeta();
  const currentTags = safeFrontmatter.tags || [];
  const currentCategory = safeFrontmatter.category;
  const currentSlugStr = slug.join("/");
  // 过滤掉当前文章
  const candidates = allMeta.filter(
    (item) => item.slug.join("/") !== currentSlugStr,
  );

  // 1. 标签交集优先
  let related = candidates.filter((item) => {
    if (!item.frontmatter.tags) return false;
    return item.frontmatter.tags.some((tag) => currentTags.includes(tag));
  });
  // 2. 不足 10 个时补同分类
  if (related.length < 10 && currentCategory) {
    const more = candidates.filter(
      (item) =>
        item.frontmatter.category === currentCategory &&
        !related.some((r) => r.slug.join("/") === item.slug.join("/")),
    );
    related = related.concat(more);
  }
  // 3. 还不足则补最新其它文章
  if (related.length < 10) {
    const more = candidates.filter(
      (item) => !related.some((r) => r.slug.join("/") === item.slug.join("/")),
    );
    related = related.concat(more);
  }
  // 只取前 10 个
  related = related.slice(0, 10);

  const relatedPosts = related.map((item) => ({
    title: item.frontmatter.title || item.slug.join("/"),
    href: `/blog/${item.slug.join("/")}`,
    category: item.frontmatter.category,
  }));

  return {
    slug,
    content,
    frontmatter: safeFrontmatter,
    headings,
    type: "blog",
    relatedPosts,
  };
}

// 生成静态路径
export async function generateStaticParams() {
  return generateBlogPaths();
}

// 如需 generateMetadata，可用 getBlogContent 获取 frontmatter

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  try {
    const resolvedParams = await params;
    const { slug, content, frontmatter, headings, relatedPosts } =
      await getBlogContent(resolvedParams.slug);
    const title = frontmatter.title || slug.join("/");
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    return (
      <div className="min-h-screen bg-background">
        <MDXCodeEnhance />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-10">
            <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto lg:block">
              <RelatedPosts posts={relatedPosts} currentSlug={slug.slice(1)} />
            </aside>

            <main className="max-w-4xl min-w-0 flex-1">
              <div>
                <div className="mb-6">
                  <Breadcrumb
                    items={createBlogBreadcrumbs({
                      slug: slug.slice(1),
                      title,
                    })}
                  />
                </div>
                <ContentDisplay
                  contentType="blog"
                  title={title}
                  date={date}
                  category={frontmatter.category}
                  tags={frontmatter.tags || []}
                  wordCount={content.length}
                >
                  <ClientMDXRenderer content={content} />
                </ContentDisplay>
                <TwikooComment />
              </div>
            </main>

            <aside className="sticky top-[80px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 [overflow-wrap:break-word] [word-break:break-all] [white-space:normal] xl:block">
              <TableOfContents
                headings={headings}
                adaptive={true}
                adaptiveOffset={80}
              />
            </aside>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
