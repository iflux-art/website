import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getDocSidebar } from '@/lib/content';
import { DocListItem } from '@/hooks/use-docs';

/**
 * 获取指定分类的文档列表的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含分类名称
 * @returns 指定分类的文档列表
 */
export async function GET(request: Request, { params }: { params: Promise<{ category: string }> }) {
  try {
    const resolvedParams = await params;
    const { category } = resolvedParams;
    const decodedCategory = decodeURIComponent(category);

    // 获取目录中的所有文档
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory);

    if (!fs.existsSync(categoryDir) || !fs.statSync(categoryDir).isDirectory()) {
      return NextResponse.json({ error: `分类 ${decodedCategory} 不存在` }, { status: 404 });
    }

    // 使用新的文件系统工具函数获取文档结构
    const sidebarItems = getDocSidebar(decodedCategory);

    // 将侧边栏结构扁平化为文档列表
    const docs: DocListItem[] = [];

    // 递归函数，用于扁平化侧边栏结构
    const flattenSidebarItems = (items: any[], parentPath: string = '') => {
      items.forEach(item => {
        if (item.type !== 'separator' && item.href && !item.isExternal) {
          // 提取 slug
          const slug = item.filePath.split('/').pop() || '';

          docs.push({
            slug,
            title: item.title,
            path: item.href,
          });
        }

        if (item.items && item.items.length > 0) {
          flattenSidebarItems(item.items, parentPath + (item.filePath ? `/${item.filePath}` : ''));
        }
      });
    };

    flattenSidebarItems(sidebarItems);

    // 如果没有找到文档，回退到旧的方法
    if (docs.length === 0) {
      console.log(`使用旧方法获取分类 ${decodedCategory} 的文档列表`);

      const fallbackDocs = fs
        .readdirSync(categoryDir)
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
        .map(file => {
          const docPath = path.join(categoryDir, file);
          const docContent = fs.readFileSync(docPath, 'utf8');
          const { data } = matter(docContent);
          const slug = file.replace(/\.(mdx|md)$/, '');

          return {
            slug,
            title: data.title || slug,
            path: `/docs/${decodedCategory}/${slug}`,
          };
        });

      return NextResponse.json(fallbackDocs);
    }

    return NextResponse.json(docs);
  } catch (error) {
    console.error(`获取分类 ${category} 的文档列表失败:`, error);

    // 出错时返回空数组而不是错误，允许客户端降级
    return NextResponse.json([]);
  }
}
