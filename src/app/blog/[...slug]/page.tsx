import { notFound } from 'next/navigation';
import { createBlogBreadcrumbs } from '@/features/blog/lib';
import { ContentDisplay } from '@/features/content';
import {
  RelatedPostsCard,
  LatestPostsCard,
  TagCloudCard,
  BlogCategoryCard,
} from '@/features/blog/components';
import { TableOfContentsCard } from '@/features/content';

import { AppGrid } from '@/features/layout';
import React from 'react';
import ClientMDXRenderer from '@/components/mdx/ClientMDXRenderer';
import { TwikooComment } from '@/features/comment';

type BlogFrontmatter = {
  title?: string;
  description?: string;
  date?: string | Date;
  category?: string;
  tags?: string[];
};

// 内联 getBlogContent 及其依赖
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { extractHeadings } from '@/features/content';
import { sync as globSync } from 'glob';

function scanContentDirectory(options: {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}): { slug: string[] }[] {
  const {
    contentDir,
    indexFiles = ['index.mdx', 'index.md'],
    extensions = ['.mdx', '.md'],
    excludePrefix = '_',
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
        extensions.some(ext => item.name.endsWith(ext)) &&
        !item.name.startsWith(excludePrefix) &&
        !indexFiles.includes(item.name) &&
        filter(itemPath)
      ) {
        const fileName = item.name.replace(new RegExp(`(${extensions.join('|')})$`), '');
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }
  scan(contentDir);
  return paths;
}

function generateBlogPaths(): { slug: string[] }[] {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), 'src', 'content', 'blog'),
    excludePrefix: '_',
    filter: itemPath => {
      try {
        const content = fs.readFileSync(itemPath, 'utf8');
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
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const relativePath = path.join(...slug);
  // 1. 直接文件
  const mdxPath = path.join(blogDir, `${relativePath}.mdx`);
  if (fs.existsSync(mdxPath)) return mdxPath;
  const mdPath = path.join(blogDir, `${relativePath}.md`);
  if (fs.existsSync(mdPath)) return mdPath;
  // 2. index 文件
  const indexMdx = path.join(blogDir, relativePath, 'index.mdx');
  if (fs.existsSync(indexMdx)) return indexMdx;
  const indexMd = path.join(blogDir, relativePath, 'index.md');
  if (fs.existsSync(indexMd)) return indexMd;
  return null;
}

// 获取所有博客 frontmatter
function getAllBlogMeta(): Array<{
  slug: string[];
  frontmatter: BlogFrontmatter;
}> {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = globSync('**/*.{md,mdx}', { cwd: blogDir });
  return files.map(file => {
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const slug = file
      .replace(/\\/g, '/')
      .replace(/\.(md|mdx)$/, '')
      .split('/');
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
  latestPosts: Array<{
    title: string;
    href: string;
    date?: string;
    category?: string;
  }>;
  allTags: Array<{ name: string; count: number }>;
  allCategories: Array<{ name: string; count: number }>;
}> {
  const filePath = findBlogFile(slug);
  if (!filePath) throw new Error(`Blog not found: ${slug.join('/')}`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);
  const safeFrontmatter = data as BlogFrontmatter;
  const { headings } = extractHeadings(content);

  // 相关文章推荐逻辑
  const allMeta = getAllBlogMeta();
  const currentTags = safeFrontmatter.tags ?? [];
  const currentCategory = safeFrontmatter.category;
  const currentSlugStr = slug.join('/');
  // 过滤掉当前文章
  const candidates = allMeta.filter(item => item.slug.join('/') !== currentSlugStr);

  // 1. 标签交集优先
  let related = candidates.filter(item => {
    if (!item.frontmatter.tags) return false;
    return item.frontmatter.tags.some(tag => currentTags.includes(tag));
  });
  // 2. 不足 10 个时补同分类
  if (related.length < 10 && currentCategory) {
    const more = candidates.filter(
      item =>
        item.frontmatter.category === currentCategory &&
        !related.some(r => r.slug.join('/') === item.slug.join('/'))
    );
    related = related.concat(more);
  }
  // 3. 还不足则补最新其它文章
  if (related.length < 10) {
    const more = candidates.filter(
      item => !related.some(r => r.slug.join('/') === item.slug.join('/'))
    );
    related = related.concat(more);
  }
  // 只取前 10 个
  related = related.slice(0, 10);

  const relatedPosts = related.map(item => ({
    title: item.frontmatter.title ?? item.slug.join('/'),
    href: `/blog/${item.slug.join('/')}`,
    category: item.frontmatter.category,
  }));

  // 获取最新发布的文章（按时间倒序）
  const latestPosts = candidates
    .filter(item => item.frontmatter.date) // 只包含有日期的文章
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date ?? '').getTime();
      const dateB = new Date(b.frontmatter.date ?? '').getTime();
      return dateB - dateA; // 时间倒序
    })
    .slice(0, 5) // 只取前5个
    .map(item => ({
      title: item.frontmatter.title ?? item.slug.join('/'),
      href: `/blog/${item.slug.join('/')}`,
      date: item.frontmatter.date as string,
      category: item.frontmatter.category,
    }));

  // 获取所有标签及其计数
  const tagCounts: Record<string, number> = {};
  allMeta.forEach(item => {
    item.frontmatter.tags?.forEach(tag => {
      if (tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    });
  });
  const allTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 获取所有分类及其计数
  const categoryCounts: Record<string, number> = {};
  allMeta.forEach(item => {
    if (item.frontmatter.category) {
      categoryCounts[item.frontmatter.category] =
        (categoryCounts[item.frontmatter.category] || 0) + 1;
    }
  });
  const allCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    slug,
    content,
    frontmatter: safeFrontmatter,
    headings,
    type: 'blog',
    relatedPosts,
    latestPosts,
    allTags,
    allCategories,
  };
}

// 生成静态路径
export async function generateStaticParams() {
  return generateBlogPaths();
}

// 如需 generateMetadata，可用 getBlogContent 获取 frontmatter

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const resolvedParams = await params;
    const {
      slug,
      content,
      frontmatter,
      headings,
      relatedPosts,
      latestPosts,
      allTags,
      allCategories,
    } = await getBlogContent(resolvedParams.slug);
    const title = frontmatter.title ?? slug.join('/');
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined;
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <AppGrid columns={5} gap="large">
            {/* 左侧边栏 - 分类导航和标签云 */}
            <aside className="hide-scrollbar sticky top-20 col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:block">
              <div className="space-y-4">
                <BlogCategoryCard
                  categories={allCategories}
                  selectedCategory={frontmatter.category}
                  enableRouting={true}
                />
                <TagCloudCard allTags={allTags} selectedTag={undefined} useDefaultRouting={true} />
              </div>
            </aside>

            {/* 主内容区 - 占3列 */}
            <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
              <ContentDisplay
                contentType="blog"
                title={title}
                date={date}
                wordCount={content.length}
                breadcrumbs={createBlogBreadcrumbs({
                  slug: slug.slice(1),
                  title,
                })}
              >
                <ClientMDXRenderer content={content} />
              </ContentDisplay>
              <TwikooComment />
            </main>

            {/* 右侧边栏 - TOC、相关文章和最新发布 */}
            <aside className="hide-scrollbar sticky top-[80px] col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto xl:block">
              <div className="space-y-4">
                <TableOfContentsCard headings={headings} className="prose-sm" />
                <RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
                <LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
              </div>
            </aside>
          </AppGrid>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
