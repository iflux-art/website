import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { BlogContent } from '@/components/features/blog/blog-content';
import { BlogSidebar } from '@/components/features/blog/blog-sidebar';
import { MarkdownRenderer as ServerMDX } from '@/components/ui/markdown-renderer';

export default async function BlogPost({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 使用 await 确保 params.slug 是可用的
  const slug = await Promise.resolve(params.slug);
  // 不需要额外的变量来存储 searchParams
  const fullSlug = slug.join('/');
  let filePath: string | undefined;

  // 处理可能的子目录结构
  if (slug.length > 1) {
    const category = slug[0];
    const postName = slug.slice(1).join('/');
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'blog', category, `${postName}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'blog', category, `${postName}.md`);

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  } else {
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'blog', `${fullSlug}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'blog', `${fullSlug}.md`);

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  }

  // 检查文件是否存在
  if (!filePath || !fs.existsSync(filePath)) {
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  // 提取文章元数据
  const title = data.title || fullSlug;
  const date = data.date
    ? new Date(data.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // 提取标题作为目录
  const headings: { id: string; text: string; level: number }[] = [];

  // 使用更强大的正则表达式直接从整个内容中提取标题
  // 匹配 ## 标题、### 标题、#### 标题 格式
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  // 调试信息
  console.log('提取标题前的内容长度:', content.length);
  console.log('内容前100个字符:', content.substring(0, 100));

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id =
      customId ||
      `heading-${text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}-${match.index}`;

    // 只包含1-4级标题（h1-h4）
    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
    }
  }

  // 调试信息
  console.log('提取到的标题数量:', headings.length);
  if (headings.length > 0) {
    console.log('第一个标题:', headings[0]);
  }

  // 确保所有标题都有唯一ID
  let processedContent = content;
  headings.forEach(heading => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(
      `^(#{${heading.level})\\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\\s*{#[\\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  // 对每个标题再次检查并确保它们有唯一ID
  headings.forEach(heading => {
    // 查找没有ID的标题并添加ID
    processedContent = processedContent.replace(
      new RegExp(
        `(^|\n)(#{${heading.level})\\s+(${heading.text.replace(
          /[-/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        )})(?!\\s*{#)`,
        'g'
      ),
      `$1$2 $3 {#${heading.id}}`
    );
  });

  // 使用处理后的内容
  const finalContent = processedContent;

  // 读取根目录的 _meta.json 文件，获取分类的中文名称
  const rootMetaFilePath = path.join(process.cwd(), 'src', 'content', 'blog', '_meta.json');
  let rootMeta = null;
  if (fs.existsSync(rootMetaFilePath)) {
    try {
      const rootMetaContent = fs.readFileSync(rootMetaFilePath, 'utf8');
      rootMeta = JSON.parse(rootMetaContent);
    } catch (error) {
      console.error('Error loading root _meta.json file:', error);
    }
  }

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '博客', href: '/blog' },
    ...(slug.length > 1
      ? [
          {
            label: rootMeta && rootMeta[slug[0]] ? rootMeta[slug[0]].title : slug[0],
            href: `/blog/${slug[0]}`,
          },
        ]
      : []),
    { label: title },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧空白区域，用于保持与文档页面布局一致 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1 hidden lg:block">
          {/* 这里可以添加博客分类或其他导航 */}
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <BlogContent
              title={title}
              date={date}
              tags={data.tags || []}
              content={finalContent}
              mdxContent={<ServerMDX content={finalContent} />}
            />
          </div>
        </div>

        {/* 右侧边栏 - 目录 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="lg:sticky lg:top-24">
            <BlogSidebar headings={headings} />
          </div>
        </div>
      </div>
    </div>
  );
}
