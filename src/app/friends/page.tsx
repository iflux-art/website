import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { BlogContent } from '@/components/features/blog/blog-content';
import { BlogSidebar } from '@/components/features/blog/blog-sidebar';
import { MarkdownRenderer as ServerMDX } from '@/components/ui/markdown/markdown-renderer';

export default async function FriendsPage() {
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

    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col lg:flex-row gap-8 px-4">
          {/* 左侧空白区域，用于保持与文档页面布局一致 */}
          <div className="lg:w-64 shrink-0 order-2 lg:order-1 hidden lg:block">
            {/* 这里可以添加友情链接分类或其他导航 */}
          </div>

          {/* 中间内容区 */}
          <div className="lg:flex-1 min-w-0 order-1 lg:order-2 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <BlogContent
                title={title}
                date={date}
                tags={data.tags || []}
                content={content}
                mdxContent={<ServerMDX content={content} />}
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
  } catch (error) {
    console.error('Error loading friend links:', error);
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">友情链接</h1>
        <p className="text-muted-foreground">加载友情链接时出错，请稍后再试。</p>
      </div>
    );
  }
}
