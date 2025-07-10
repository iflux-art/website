import { ContentLoader } from "@/lib/content-loader";
import { extractHeadings } from "@/components/layout/toc/extract-headings";
import type { BlogFrontmatter, RelatedPost } from "@/types/blog-types";

export async function getBlogContent(slug: string[]): Promise<{
  slug: string[];
  content: string;
  frontmatter: BlogFrontmatter;
  headings: { level: number; text: string; id: string }[];
  relatedPosts: RelatedPost[];
  type: string;
}> {
  const contentLoader = ContentLoader.getInstance();
  const {
    slug: loadedSlug,
    content,
    frontmatter,
    type,
  } = await contentLoader.getContent(["blog", ...slug]);
  const safeFrontmatter = frontmatter as BlogFrontmatter;
  const { headings } = extractHeadings(content);
  const relatedItems = await contentLoader.getRelatedContent(
    loadedSlug.slice(1),
    type,
  );
  const relatedPosts: RelatedPost[] = relatedItems.slice(0, 5).map((item) => ({
    title:
      (item.frontmatter as BlogFrontmatter).title ||
      item.slug[item.slug.length - 1],
    href: `/blog/${item.slug.join("/")}`,
    category: (item.frontmatter as BlogFrontmatter).category,
  }));
  return {
    slug: loadedSlug,
    content,
    frontmatter: safeFrontmatter,
    headings,
    relatedPosts,
    type,
  };
}
