import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import { Transition } from '@/components/ui/transition';

import { Card, CardContent } from '@/components/ui/card';
import { DocSidebar } from '@/components/features/docs/sidebar/doc-sidebar';
import { AdaptiveSidebar } from '@/components/features/content/toc/adaptive-sidebar';
import { MDXContent } from '@/components/features/content/mdx-content';
import { ServerMDX } from '@/components/features/content/server-mdx';

export default function DocPage({ params }: { params: { slug: string[] } }) {
  // 构建文件路径
  // 使用解构赋值来避免直接访问 params.slug
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const category = slug[0];
  const docName = slug.length > 1 ? slug.slice(1).join('/') : slug[0];

  // 构建完整文件路径
  let filePath;
  if (slug.length === 1) {
    // 如果只有一个段落，尝试查找该目录下的第一个文件
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', category);
    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      const files = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
        .sort();

      if (files.length > 0) {
        filePath = path.join(categoryDir, files[0]);
      } else {
        notFound();
      }
    } else {
      filePath = path.join(process.cwd(), 'src', 'content', 'docs', `${category}.mdx`);
    }
  } else {
    // 多段路径
    filePath = path.join(process.cwd(), 'src', 'content', 'docs', category, `${docName}.mdx`);
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: originalContent, data } = matter(fileContent);
  let content = originalContent;

  // 获取目录中的所有文档
  const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', category);
  const allDocs = fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()
    ? fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const docPath = path.join(categoryDir, file);
        const docContent = fs.readFileSync(docPath, 'utf8');
        const { data } = matter(docContent);
        return {
          slug: file.replace('.mdx', ''),
          title: data.title || file.replace('.mdx', ''),
          path: `/docs/${category}/${file.replace('.mdx', '')}`
        };
      })
    : [];

  // 检查是否存在_meta.json文件（替代_meta.tsx）
  const metaFilePath = path.join(categoryDir, '_meta.json');
  let meta = null;
  if (fs.existsSync(metaFilePath)) {
    try {
      // 读取_meta.json文件
      const metaContent = fs.readFileSync(metaFilePath, 'utf8');
      meta = JSON.parse(metaContent);
    } catch (error) {
      console.error('Error loading _meta.json file:', error);
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
    const id = customId || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${match.index}`;

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
  headings.forEach((heading) => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(`^(#{${heading.level}})\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})(?:\s*{#[\w-]+})?$`, 'gm');
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  // 对每个标题再次检查并确保它们有唯一ID
  headings.forEach((heading) => {
    // 查找没有ID的标题并添加ID
    processedContent = processedContent.replace(
      new RegExp(`(^|\n)(#{${heading.level}})\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})(?!\s*{#)`, 'g'),
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
    <div className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧边栏 - 文档列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <Suspense fallback={<div className="animate-pulse h-[500px] bg-muted rounded-md"></div>}>
            <DocSidebar
              category={category}
              currentDoc={docName}
            />
          </Suspense>
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2">
          <Transition>
            <div className="max-w-4xl mx-auto">
              {/* 面包屑导航 */}
              <div className="text-sm text-muted-foreground mb-6">
                <Link href="/docs" className="hover:text-primary">
                  文档
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/docs/${category}`} className="hover:text-primary">
                  {data.categoryTitle || category}
                </Link>
                {slug.length > 1 && (
                  <>
                    <span className="mx-2">/</span>
                    <span>{data.title}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
              <MDXContent>
                <ServerMDX content={content} />
              </MDXContent>

              {/* 上一页/下一页导航 */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {prevDoc && (
                  <Card className="col-start-1">
                    <CardContent className="p-4">
                      <Link href={prevDoc.path} className="flex flex-col">
                        <span className="text-sm text-muted-foreground flex items-center">
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          上一页
                        </span>
                        <span className="font-medium">{prevDoc.title}</span>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                {nextDoc && (
                  <Card className="col-start-2">
                    <CardContent className="p-4">
                      <Link href={nextDoc.path} className="flex flex-col items-end text-right">
                        <span className="text-sm text-muted-foreground flex items-center">
                          下一页
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                        <span className="font-medium">{nextDoc.title}</span>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Transition>
        </div>

        {/* 右侧边栏 - 目录和广告 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="lg:sticky lg:top-20">
            <Suspense fallback={<div className="animate-pulse h-[300px] bg-muted rounded-md"></div>}>
              {/* 使用自适应侧边栏组件，根据目录内容高度动态调整广告卡片位置 */}
              <AdaptiveSidebar headings={headings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}