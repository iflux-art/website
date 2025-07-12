import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractHeadings } from "@/components/common/extract-headings";
import type { BlogFrontmatter } from "@/types/blog-types";
import { sync as globSync } from "glob";

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

export async function getBlogContent(slug: string[]): Promise<{
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

/**
 * 生成所有博客文章的静态路径
 * @returns 所有博客文章路径数组
 */
export function generateBlogPaths(): { slug: string[] }[] {
  const blogContentDir = path.join(process.cwd(), "src", "content", "blog");
  const paths: { slug: string[] }[] = [];

  function scanDirectory(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // 跳过以 _ 开头的目录
        if (item.name.startsWith("_")) continue;

        const newSlug = [...currentSlug, item.name];
        scanDirectory(itemPath, newSlug);
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md")) &&
        !item.name.startsWith("_")
      ) {
        // 添加文件路径（去掉扩展名）
        const fileName = item.name.replace(/\.(mdx|md)$/, "");
        const fullSlug = [...currentSlug, fileName];

        // 检查文章是否已发布
        try {
          const fileContent = fs.readFileSync(itemPath, "utf8");
          const { data } = matter(fileContent);

          // 只包含已发布的文章
          if (data.published !== false) {
            paths.push({ slug: fullSlug });
          }
        } catch (error) {
          console.error(`Error reading blog file ${itemPath}:`, error);
        }
      }
    }
  }

  scanDirectory(blogContentDir);
  return paths;
}
