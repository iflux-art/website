import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { TocContainer } from '@/components/ui/toc-container';
import { BlogContent } from '@/components/features/blog/blog-content';
import { MarkdownRenderer as ServerMDX } from '@/components/mdx/markdown-renderer';
import { StickyLayout } from '@/components/layout/sticky-layout';

export default async function BlogPost() {
  // 读取友情链接 MDX 文件
  const filePath = path.join(process.cwd(), 'src', 'content', 'friends', 'all.mdx');

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('友情链接文件不存在');
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);

    // 提取文章元数据
    const title = data.title || '友情链接';
    const date = data.date
      ? new Date(data.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    // 提取标题作为目录
    const headings: { id: string; text: string; level: number }[] = [];

    // 使用正则表达式从内容中提取标题
    const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const customId = match[3];
      const id = customId || text;

      // 只包含2-4级标题（h2-h4）
      if (level >= 2 && level <= 4) {
        headings.push({ id, text, level });
      }
    }

    // 构建面包屑导航
    const breadcrumbItems: BreadcrumbItem[] = [{ label: '首页', href: '/' }, { label: '友情链接' }];

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* 左侧空白区域，用于保持与其他页面布局一致 */}
            <aside className="hidden lg:block w-64 shrink-0">{/* 空白区域 */}</aside>

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
                  content={content}
                  mdxContent={<ServerMDX content={content} />}
                />
              </div>
            </main>

            {/* 右侧目录 */}
            <aside className="hidden xl:block w-64 shrink-0">
              <StickyLayout>
                <TocContainer headings={headings} />
              </StickyLayout>
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading friend links:', error);
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">友情链接</h1>
        <p className="text-muted-foreground">加载友情链接时出错，请稍后再试。</p>
      </div>
    );
  }
}
