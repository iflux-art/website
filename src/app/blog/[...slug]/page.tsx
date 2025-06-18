import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

// 获取目录下的所有文章
function getArticlesInDirectory(dirPath: string): Array<{
  slug: string;
  title: string;
  description?: string;
  date?: string;
}> {
  const articles = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith('.mdx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(content);
      articles.push({
        slug: file.slice(0, -4),
        title: data.title || file.slice(0, -4),
        description: data.description,
        date: data.date,
      });
    }
  }

  return articles.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

// 验证目录是否存在
function validatePath(filePath: string, type: 'file' | 'directory' = 'file'): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    return type === 'file' ? stats.isFile() : stats.isDirectory();
  } catch {
    return false;
  }
}

import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { createBlogBreadcrumbs } from '@/components/common/breadcrumb/breadcrumb-utils';
import { ContentDisplay } from '@/components/common/content-display';
import { TableOfContents } from '@/components/layout/toc/table-of-contents';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { countWords } from '@/lib/utils';
import { extractHeadings } from '@/components/layout/toc/extract-headings';
import { NAVBAR_HEIGHT } from '@/config/layout';

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug.join('/')}.mdx`);
  const dirPath = path.join(process.cwd(), 'src/content/blog', slug.join('/'));

  // 检查是否为目录
  if (validatePath(dirPath, 'directory')) {
    const articles = getArticlesInDirectory(dirPath);
    const directoryTitle = slug[slug.length - 1] || 'Blog';

    return (
      <article className="relative mx-auto w-full max-w-3xl px-4 py-6">
        <Breadcrumb items={createBlogBreadcrumbs({ slug, title: directoryTitle })} />
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-8">{directoryTitle}</h1>
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <a href={`/blog/${slug.join('/')}/${article.slug}`} className="block p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                      {article.description}
                    </p>
                  )}
                  {article.date && (
                    <time className="text-sm text-neutral-500 dark:text-neutral-500">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </a>
              </article>
            ))}
          </div>
        </div>
      </article>
    );
  }

  // 如果不是目录，检查文件是否存在
  if (!validatePath(filePath, 'file')) {
    notFound();
  }

  const { content, data } = matter(fs.readFileSync(filePath, 'utf8'));

  const { headings } = extractHeadings(content);
  const title = data.title || slug.join('/');
  const date =
    data.date &&
    new Date(data.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center gap-12">
          <aside className="hidden lg:block w-72 shrink-0"></aside>

          <main className="flex-1 min-w-0 max-w-4xl">
            <div>
              <div className="mb-6">
                <Breadcrumb items={createBlogBreadcrumbs({ slug, title })} />
              </div>

              <ContentDisplay
                contentType="blog"
                title={title}
                date={date}
                category={data.category}
                tags={data.tags || []}
                wordCount={countWords(content)}
              >
                {await MDXRenderer({ content })}
              </ContentDisplay>
            </div>
          </main>

          <aside
            className={`hidden xl:block w-72 box-border pl-4 shrink-0 self-start sticky top-[${NAVBAR_HEIGHT}px] max-h-[calc(100vh-${NAVBAR_HEIGHT}px-env(safe-area-inset-bottom))] overflow-y-auto`}
          >
            <TableOfContents headings={headings} adaptive={true} adaptiveOffset={NAVBAR_HEIGHT} />
          </aside>
        </div>
      </div>
    </div>
  );
}
