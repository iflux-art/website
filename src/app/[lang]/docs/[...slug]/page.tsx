import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

import { mdxComponents } from '@/mdx-components';

import { Card, CardContent } from '@/components/ui/card';
import { DocsSidebarImproved } from '@/components/content/docs/sidebar-improved';
import { TableOfContentsClientWrapper } from '@/components/content/toc/toc-client-wrapper';
import { AdvertisementCard } from '@/components/content/advertisement-card';
import { BackToTopButton } from '@/components/content/back-to-top-button';

export default function DocPage({ params }: { params: { lang: string; slug: string[] } }) {
  // 验证语言参数
  if (params.lang !== 'zh' && params.lang !== 'en') {
    notFound();
  }

  // 构建文件路径
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const category = slug[0];
  const docName = slug.length > 1 ? slug.slice(1).join('/') : slug[0];
  
  // 构建完整文件路径
  let filePath;
  if (slug.length === 1) {
    // 如果只有一个段落，尝试查找该目录下的第一个文件
    const categoryDir = path.join(process.cwd(), 'src', 'content', params.lang, 'docs', category);
    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      const files = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.mdx'))
        .sort();
      
      if (files.length > 0) {
        filePath = path.join(categoryDir, files[0]);
      } else {
        notFound();
      }
    } else {
      filePath = path.join(process.cwd(), 'src', 'content', params.lang, 'docs', `${category}.mdx`);
    }
  } else {
    // 多段路径
    filePath = path.join(process.cwd(), 'src', 'content', params.lang, 'docs', category, `${docName}.mdx`);
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  // 获取目录中的所有文档
  const categoryDir = path.join(process.cwd(), 'src', 'content', params.lang, 'docs', category);
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
          path: `/${params.lang}/docs/${category}/${file.replace('.mdx', '')}`
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
  const contentLines = content.split('\n');
  contentLines.forEach((line, index) => {
    // 改进的标题匹配正则表达式，支持更多标题格式
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s*{#([\w-]+)})?$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      // 使用自定义ID或生成一个基于文本的ID
      const customId = headingMatch[3];
      const id = customId || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${index}`;
      
      // 只包含2-4级标题（h2-h4）
      if (level >= 2 && level <= 4) {
        headings.push({ id, text, level });
      }
    }
  });
  
  // 确保所有标题都有唯一ID
  const processedHeadings = headings.map((heading, index) => {
    // 服务端渲染环境中没有document对象，移除对document的引用
    const updatedContent = content.replace(
      new RegExp(`(^|\n)(#{${heading.level}})\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'g'),
      `$1$2 $3 {#${heading.id}}`
    );
    return {
      ...heading,
      updatedContent
    };
  });
  
  // 应用所有内容更新
  const finalContent = processedHeadings.reduce(
    (acc, heading) => heading.updatedContent || acc, 
    content
  );

  // 确定上一篇和下一篇文档
  const currentIndex = allDocs.findIndex(doc => doc.slug === docName);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="container mx-auto py-6 px-4">

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧边栏 - 文档列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <DocsSidebarImproved 
            lang={params.lang}
            category={category}
            currentDoc={docName}
            meta={meta}
            allDocs={allDocs}
          />
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2">
          <div className="max-w-3xl">
            {/* 面包屑导航 */}
            <div className="text-sm text-muted-foreground mb-6">
              <Link href={`/${params.lang}/docs`} className="hover:text-primary">
                {params.lang === 'zh' ? '文档' : 'Documentation'}
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/${params.lang}/docs/${category}`} className="hover:text-primary">
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
            <div className="prose dark:prose-invert max-w-none">
              <MDXRemote source={content} components={mdxComponents} />
            </div>

            {/* 上一页/下一页导航 */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {prevDoc && (
                <Card className="col-start-1">
                  <CardContent className="p-4">
                    <Link href={prevDoc.path} className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {params.lang === 'zh' ? '上一页' : 'Previous'}
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
                        {params.lang === 'zh' ? '下一页' : 'Next'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                      <span className="font-medium">{nextDoc.title}</span>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 右侧边栏 - 目录、广告和回到顶部按钮 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2 -mr-2 space-y-8">
            {/* 目录 */}
            <div>
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <TableOfContentsClientWrapper headings={headings} lang={params.lang} />
              </div>
            </div>
            
            {/* 广告卡片 */}
            <AdvertisementCard
              lang={params.lang}
            />
            
            {/* 回到顶部按钮 */}
            <div className="flex justify-left">
              <BackToTopButton 
                title={params.lang === 'zh' ? '回到顶部' : 'Back to top'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}