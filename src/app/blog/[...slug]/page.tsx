import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { BlogContent } from '@/components/features/blog/blog-content';
import { TocContainer } from '@/components/ui/toc-container';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  // 使用 await 确保 params.slug 是可用的
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
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
    } else {
      // 尝试查找子目录中的 index 文件
      const indexMdxPath = path.join(
        process.cwd(),
        'src',
        'content',
        'blog',
        category,
        postName,
        'index.mdx'
      );
      const indexMdPath = path.join(
        process.cwd(),
        'src',
        'content',
        'blog',
        category,
        postName,
        'index.md'
      );

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到博客子目录索引文件: ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到博客子目录索引文件: ${filePath}`);
      }
    }
  } else {
    // 单段路径，首先检查是否存在该目录
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'blog', fullSlug);

    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      // 首先检查是否存在 index.mdx 或 index.md 文件（最高优先级）
      const indexMdxPath = path.join(categoryDir, 'index.mdx');
      const indexMdPath = path.join(categoryDir, 'index.md');

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到博客目录索引文件(最高优先级): ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到博客目录索引文件(最高优先级): ${filePath}`);
      } else {
        // 如果没有 index 文件，检查是否存在 _meta.json 文件
        const metaPath = path.join(categoryDir, '_meta.json');
        let meta: Record<string, { order?: number; title?: string }> = {};

        if (fs.existsSync(metaPath)) {
          try {
            // 读取 _meta.json 文件
            const metaContent = fs.readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaContent);
            console.log(`找到博客目录 _meta.json 文件: ${metaPath}`);

            // 根据 meta 配置排序文件
            const files = fs
              .readdirSync(categoryDir)
              .filter(
                file => (file.endsWith('.mdx') || file.endsWith('.md')) && !file.startsWith('_')
              );

            // 如果有文件，根据 meta 配置排序
            if (files.length > 0) {
              // 根据 meta 配置排序
              const sortedFiles = files.sort((a, b) => {
                const aSlug = a.replace(/\.(mdx|md)$/, '');
                const bSlug = b.replace(/\.(mdx|md)$/, '');

                // 处理两种可能的 _meta.json 格式
                // 1. { "file-name": { order: 1, title: "Title" } }
                // 2. { "file-name": "Title" }
                const aConfig = meta[aSlug];
                const bConfig = meta[bSlug];

                // 如果 meta 中有该文件的配置
                if (aConfig !== undefined && bConfig !== undefined) {
                  // 如果两个文件都在 meta 中有配置
                  if (typeof aConfig === 'object' && typeof bConfig === 'object') {
                    // 如果配置是对象，使用 order 属性
                    const aOrder = aConfig.order || 999;
                    const bOrder = bConfig.order || 999;
                    return aOrder - bOrder;
                  } else {
                    // 如果配置不是对象（可能是字符串），按照在 meta 中的顺序排序
                    // 这里我们使用 Object.keys 获取所有键，然后比较它们的索引
                    const keys = Object.keys(meta);
                    return keys.indexOf(aSlug) - keys.indexOf(bSlug);
                  }
                } else if (aConfig !== undefined) {
                  // 如果只有 a 在 meta 中有配置，a 排在前面
                  return -1;
                } else if (bConfig !== undefined) {
                  // 如果只有 b 在 meta 中有配置，b 排在前面
                  return 1;
                } else {
                  // 如果都没有配置，按字母顺序排序
                  return aSlug.localeCompare(bSlug);
                }
              });

              // 使用排序后的第一个文件
              filePath = path.join(categoryDir, sortedFiles[0]);
              console.log(`根据 _meta.json 排序后的第一个文件: ${filePath}`);
            }
          } catch (error) {
            console.error(`解析 ${fullSlug} 的 _meta.json 文件失败:`, error);
          }
        }

        // 如果没有找到文件或没有 _meta.json，尝试查找该目录下的第一个文件
        if (!filePath) {
          const files = fs
            .readdirSync(categoryDir)
            .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
            .sort();

          if (files.length > 0) {
            filePath = path.join(categoryDir, files[0]);
            console.log(`找到博客目录下的第一个文件: ${filePath}`);
          }
        }
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 左侧空白区域，用于保持与文档页面布局一致 */}
          <aside className="hidden lg:block w-64 shrink-0">
            {/* 这里可以添加博客分类或其他导航 */}
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {/* 面包屑导航 */}
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <BlogContent
                title={title}
                date={date}
                tags={data.tags || []}
                content={finalContent}
                mdxContent={<MarkdownRenderer content={finalContent} />}
                path={`/blog/${fullSlug}`}
              />
            </div>
          </main>

          {/* 右侧目录 */}
          <aside className="hidden xl:block w-64 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
            <TocContainer headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}