import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getDocSidebar } from '@/features/docs/lib';
import type { DocListItem } from '@/features/docs/types';

interface SidebarNavItem {
  type?: 'menu' | 'separator' | 'page' | 'item' | 'category';
  title: string;
  href?: string;
  isExternal?: boolean;
  filePath?: string;
  items?: SidebarNavItem[];
  label?: string;
  open?: boolean;
}

/**
 * 递归展开sidebar项目
 */
const flattenSidebarItems = (
  items: SidebarNavItem[],
  categoryId: string,
  docs: DocListItem[],
  parentPath = ''
): void => {
  items.forEach(item => {
    if (item.type !== 'separator' && item.href && !item.isExternal && item.filePath) {
      const slug = item.filePath.split('/').pop() ?? '';

      docs.push({
        slug,
        title: item.title,
        path: item.href,
        description: item.label ?? item.title,
        category: categoryId,
      });
    }

    if (item.items && item.items.length > 0) {
      flattenSidebarItems(
        item.items,
        categoryId,
        docs,
        parentPath + (item.filePath ? `/${item.filePath}` : '')
      );
    }
  });
};

/**
 * 备用方法：直接读取目录中的文件
 */
const getFallbackDocs = (categoryDir: string, decodedCategory: string): DocListItem[] =>
  fs
    .readdirSync(categoryDir)
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const docPath = path.join(categoryDir, file);
      const docContent = fs.readFileSync(docPath, 'utf8');
      const { data } = matter(docContent);
      const slug = file.replace(/\.(mdx|md)$/, '');

      return {
        slug,
        title: (data.title as string) ?? slug,
        description: (data.description as string) ?? (data.title as string) ?? slug,
        path: `/docs/${decodedCategory}/${slug}`,
      } as DocListItem;
    });

export async function GET(request: Request, { params }: { params: Promise<{ category: string }> }) {
  try {
    const resolvedParams = await params;
    const categoryParam = resolvedParams.category;
    const decodedCategory = decodeURIComponent(categoryParam);

    const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory);

    if (!fs.existsSync(categoryDir) || !fs.statSync(categoryDir).isDirectory()) {
      return NextResponse.json({ error: `分类 ${decodedCategory} 不存在` }, { status: 404 });
    }

    const sidebarItems = getDocSidebar(decodedCategory);
    const docs: DocListItem[] = [];

    flattenSidebarItems(sidebarItems, resolvedParams.category, docs);

    if (docs.length === 0) {
      // 备用方法读取分类文档
      const fallbackDocs = getFallbackDocs(categoryDir, decodedCategory);
      return NextResponse.json(fallbackDocs);
    }

    return NextResponse.json(docs);
  } catch {
    // Error getting document list for category
    return NextResponse.json({ error: '获取文档列表失败' }, { status: 500 });
  }
}
