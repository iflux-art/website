import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 获取导航 MDX 内容的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含 slug
 * @returns MDX 内容
 */
export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  try {
    // 确保 slug 是数组
    const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
    const fullSlug = slug.join('/');

    console.log('API 路由: 处理导航 MDX 请求', { slug, fullSlug });

    // 查找文件路径
    let filePath = '';

    // 处理可能的子目录结构
    if (slug.length > 1) {
      const category = slug[0];
      const pageName = slug.slice(1).join('/');
      // 尝试不同的文件扩展名
      const mdxPath = path.join(
        process.cwd(),
        'src',
        'content',
        'navigation',
        category,
        `${pageName}.mdx`
      );
      const mdPath = path.join(
        process.cwd(),
        'src',
        'content',
        'navigation',
        category,
        `${pageName}.md`
      );

      if (fs.existsSync(mdxPath)) {
        filePath = mdxPath;
      } else if (fs.existsSync(mdPath)) {
        filePath = mdPath;
      }
    } else {
      // 尝试不同的文件扩展名
      const mdxPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.mdx`);
      const mdPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.md`);

      if (fs.existsSync(mdxPath)) {
        filePath = mdxPath;
      } else if (fs.existsSync(mdPath)) {
        filePath = mdPath;
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: `找不到导航页面: ${fullSlug}` }, { status: 404 });
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // 处理内容中的 ResourceCard 和 ResourceGrid 组件
    // 将 <ResourceCard ... /> 转换为 <div data-resource-card ... />
    // 处理布尔属性，将 featured 转换为 data-featured="true"
    let processedContent = content
      // 处理 ResourceGrid 组件
      .replace(/<ResourceGrid([^>]*)>/g, '<div data-resource-grid$1>')
      .replace(/<\/ResourceGrid>/g, '</div>')

      // 处理 ResourceCard 组件的自闭合标签
      .replace(
        /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?\/>/g,
        '<div data-resource-card$1 data-featured="true"$2></div>'
      )
      .replace(/<ResourceCard([^>]*)\/>/g, '<div data-resource-card$1></div>')

      // 处理 ResourceCard 组件的开始标签
      .replace(
        /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?>/g,
        '<div data-resource-card$1 data-featured="true"$2>'
      )
      .replace(/<ResourceCard([^>]*)>/g, '<div data-resource-card$1>')

      // 处理 ResourceCard 组件的结束标签
      .replace(/<\/ResourceCard>/g, '</div>');

    console.log('API 路由: 成功处理 MDX 内容', {
      contentLength: processedContent.length,
      frontmatterKeys: Object.keys(data),
    });

    return NextResponse.json({
      content: processedContent,
      frontmatter: data,
    });
  } catch (error) {
    console.error(`获取导航 MDX 内容失败:`, error);

    // 返回更详细的错误信息
    return NextResponse.json(
      {
        error: `获取导航 MDX 内容失败: ${(error as Error).message}`,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
        path: fullSlug,
      },
      { status: 500 }
    );
  }
}
