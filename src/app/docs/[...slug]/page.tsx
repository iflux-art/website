import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { DocSidebar } from '@/components/features/docs/sidebar/doc-sidebar';
import { AdaptiveSidebar } from '@/components/ui/adaptive-sidebar';
import { MarkdownContent as MDXContent } from '@/components/ui/markdown-content';
import { MarkdownRenderer as ServerMDX } from '@/components/ui/markdown-renderer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { SidebarErrorWrapper } from '@/components/ui/sidebar-error-wrapper';

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  // 构建文件路径
  // 使用 await 确保 params.slug 是可用的
  const slug = Array.isArray(await Promise.resolve(params.slug))
    ? await Promise.resolve(params.slug)
    : [await Promise.resolve(params.slug)];
  const category = slug[0] as string;
  const docName = slug.length > 1 ? (slug.slice(1).join('/') as string) : (slug[0] as string);

  // 构建完整文件路径
  let filePath;
  if (slug.length === 1) {
    // 如果只有一个段落，首先检查是否存在该目录
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', category);

    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      // 首先检查是否存在 index.mdx 或 index.md 文件（最高优先级）
      const indexMdxPath = path.join(categoryDir, 'index.mdx');
      const indexMdPath = path.join(categoryDir, 'index.md');

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到目录索引文件(最高优先级): ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到目录索引文件(最高优先级): ${filePath}`);
      } else {
        // 如果没有 index 文件，检查是否存在 _meta.json 文件
        const metaPath = path.join(categoryDir, '_meta.json');
        let meta: Record<string, { order?: number; title?: string }> = {};

        if (fs.existsSync(metaPath)) {
          try {
            // 读取 _meta.json 文件
            const metaContent = fs.readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaContent);
            console.log(`找到目录 _meta.json 文件: ${metaPath}`);

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
            console.error(`解析 ${category} 的 _meta.json 文件失败:`, error);
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
            console.log(`找到目录下的第一个文件: ${filePath}`);
          } else {
            notFound();
          }
        }
      }
    } else {
      // 尝试不同的文件扩展名
      const mdxPath = path.join(process.cwd(), 'src', 'content', 'docs', `${category}.mdx`);
      const mdPath = path.join(process.cwd(), 'src', 'content', 'docs', `${category}.md`);

      if (fs.existsSync(mdxPath)) {
        filePath = mdxPath;
      } else if (fs.existsSync(mdPath)) {
        filePath = mdPath;
      }
    }
  } else {
    // 多段路径
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'docs', category, `${docName}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'docs', category, `${docName}.md`);

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
        'docs',
        category,
        docName,
        'index.mdx'
      );
      const indexMdPath = path.join(
        process.cwd(),
        'src',
        'content',
        'docs',
        category,
        docName,
        'index.md'
      );

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到子目录索引文件: ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到子目录索引文件: ${filePath}`);
      }
    }
  }

  // 检查文件是否存在
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`找不到文档: ${category}/${docName}`);
    console.error(`尝试的路径:
      - ${path.join(process.cwd(), 'src', 'content', 'docs', category, `${docName}.mdx`)}
      - ${path.join(process.cwd(), 'src', 'content', 'docs', category, `${docName}.md`)}
      - ${path.join(process.cwd(), 'src', 'content', 'docs', category, docName, 'index.mdx')}
      - ${path.join(process.cwd(), 'src', 'content', 'docs', category, docName, 'index.md')}
    `);
    notFound();
  }

  console.log(`成功找到文档: ${filePath}`);

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: originalContent, data } = matter(fileContent);
  let content = originalContent;

  // 获取目录中的所有文档
  const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', category);
  const allDocs =
    fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()
      ? fs
          .readdirSync(categoryDir)
          .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
          .map(file => {
            const docPath = path.join(categoryDir, file);
            const docContent = fs.readFileSync(docPath, 'utf8');
            const { data } = matter(docContent);
            const fileSlug = file.replace(/\.(mdx|md)$/, '');
            return {
              slug: fileSlug,
              title: data.title || fileSlug,
              path: `/docs/${category}/${fileSlug}`,
            };
          })
      : [];

  // 检查是否存在_meta.json文件（替代_meta.tsx）
  const metaFilePath = path.join(categoryDir, '_meta.json');
  let metaData = null;
  if (fs.existsSync(metaFilePath)) {
    try {
      // 读取_meta.json文件
      const metaContent = fs.readFileSync(metaFilePath, 'utf8');
      metaData = JSON.parse(metaContent);
    } catch (error) {
      console.error('Error loading _meta.json file:', error);
    }
  }

  // 读取根目录的 _meta.json 文件，获取分类的中文名称
  const rootMetaFilePath = path.join(process.cwd(), 'src', 'content', 'docs', '_meta.json');
  let rootMeta: Record<string, { title: string }> | null = null;
  if (fs.existsSync(rootMetaFilePath)) {
    try {
      const rootMetaContent = fs.readFileSync(rootMetaFilePath, 'utf8');
      rootMeta = JSON.parse(rootMetaContent);
    } catch (error) {
      console.error('Error loading root _meta.json file:', error);
    }
  }

  // 提取标题作为目录
  const headings: { id: string; text: string; level: number }[] = [];

  // 使用更强大的正则表达式直接从整个内容中提取标题
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  // 调试信息
  console.log('文档页面 - 提取标题前的内容长度:', content.length);
  console.log('文档页面 - 内容前100个字符:', content.substring(0, 100));

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
  console.log('文档页面 - 提取到的标题数量:', headings.length);
  if (headings.length > 0) {
    console.log('文档页面 - 第一个标题:', headings[0]);
  }

  // 确保所有标题都有唯一ID
  let processedContent = content;
  headings.forEach(heading => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\s*{#[\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  // 对每个标题再次检查并确保它们有唯一ID
  headings.forEach(heading => {
    // 查找没有ID的标题并添加ID
    processedContent = processedContent.replace(
      new RegExp(
        `(^|\n)(#{${heading.level}})\s+(${heading.text.replace(
          /[-/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        )})(?!\s*{#)`,
        'g'
      ),
      `$1$2 $3 {#${heading.id}}`
    );
  });

  // 使用处理后的内容
  content = processedContent;

  // 确定上一篇和下一篇文档
  const currentIndex = allDocs.findIndex(doc => doc.slug === docName);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧边栏 - 文档列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
            <div className="pt-6">
              <Suspense>
                <div className="no-animation">
                  <SidebarErrorWrapper>
                    <DocSidebar category={category} currentDoc={docName as string} />
                  </SidebarErrorWrapper>
                </div>
              </Suspense>
            </div>
          </div>
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <div className="mb-6">
              <Breadcrumb
                items={[
                  { label: '文档', href: '/docs' },
                  {
                    label: rootMeta && rootMeta[category] ? rootMeta[category].title : category,
                    href: `/docs/${category}`,
                  },
                  ...(slug.length > 1 ? [{ label: data.title }] : []),
                ]}
              />
            </div>
            <h1 className="text-4xl font-bold mb-8 tracking-tight">{data.title}</h1>
            <MDXContent>
              <ServerMDX content={content} />
            </MDXContent>

            {/* 上一页/下一页导航 */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {prevDoc && (
                <Card className="col-start-1 shadow-sm rounded-xl hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <Link href={prevDoc.path} className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        上一页
                      </span>
                      <span className="font-semibold tracking-tight">{prevDoc.title}</span>
                    </Link>
                  </CardContent>
                </Card>
              )}
              {nextDoc && (
                <Card className="col-start-2 shadow-sm rounded-xl hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <Link href={nextDoc.path} className="flex flex-col items-end text-right">
                      <span className="text-sm text-muted-foreground flex items-center">
                        下一页
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                      <span className="font-semibold tracking-tight">{nextDoc.title}</span>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 右侧边栏 - 目录 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
            <div className="pt-6">
              <Suspense>
                {/* 使用自适应侧边栏组件显示文档目录 */}
                <AdaptiveSidebar headings={headings} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
