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
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  let slugForErrorLogging: string[] | undefined;
  try {
    const resolvedParams = await params;
    // 确保 slug 是数组
    const slugArray = Array.isArray(resolvedParams.slug)
      ? resolvedParams.slug
      : [resolvedParams.slug];
    slugForErrorLogging = slugArray; // 在 catch 中使用
    const fullSlug = slugArray.join('/');

    console.log('API 路由: 处理导航 MDX 请求', { slug: slugArray, fullSlug });

    // 查找文件路径
    let filePath = '';

    // 处理可能的子目录结构
    if (slugArray.length > 1) {
      const category = slugArray[0];
      const pageName = slugArray.slice(1).join('/');
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

    // 导入处理函数
    const { processMdxContent } = await import('@/components/mdx/renderers/markdown-renderer');

    // 处理内容中的 ResourceCard 和 ResourceGrid 组件
    const processedContent = processMdxContent(content);

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
        path: slugForErrorLogging ? slugForErrorLogging.join('/') : '未知路径',
      },
      { status: 500 }
    );
  }
}
