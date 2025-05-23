import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocSidebarItem } from '@/components/features/docs/sidebar/doc-sidebar';

/**
 * 获取指定分类的侧边栏结构的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含分类名称
 * @returns 指定分类的侧边栏结构
 */
export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const { category } = params;
    const decodedCategory = decodeURIComponent(category);

    // 根据分类选择不同的内容目录
    let contentDir;
    if (decodedCategory === 'navigation') {
      contentDir = path.join(process.cwd(), 'src', 'content', 'navigation');
    } else {
      contentDir = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory);
    }

    if (!fs.existsSync(contentDir) || !fs.statSync(contentDir).isDirectory()) {
      return NextResponse.json(
        { error: `分类 ${decodedCategory} 不存在` },
        { status: 404 }
      );
    }

    // 读取 _meta.json 文件
    const metaPath = path.join(contentDir, '_meta.json');
    let meta = {};

    if (fs.existsSync(metaPath)) {
      try {
        const metaContent = fs.readFileSync(metaPath, 'utf8');
        meta = JSON.parse(metaContent);
      } catch (error) {
        console.error(`解析 ${decodedCategory} 的 _meta.json 文件失败:`, error);
      }
    }

    // 获取目录结构
    const items = getDirectoryStructure(contentDir, '', meta, decodedCategory);

    return NextResponse.json(items);
  } catch (error) {
    console.error(`获取分类 ${params.category} 的侧边栏结构失败:`, error);
    return NextResponse.json(
      { error: `获取分类 ${params.category} 的侧边栏结构失败` },
      { status: 500 }
    );
  }
}

/**
 * 获取目录结构
 *
 * @param rootDir 根目录路径
 * @param relativePath 相对路径
 * @param meta 元数据配置
 * @param category 分类名称
 * @returns 目录结构
 */
function getDirectoryStructure(
  rootDir: string,
  relativePath: string = '',
  meta: Record<string, any> = {},
  category: string
): DocSidebarItem[] {
  const fullPath = path.join(rootDir, relativePath);

  // 检查目录是否存在
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    console.error(`目录不存在: ${fullPath}`);
    return [];
  }

  // 读取目录内容
  const items = fs.readdirSync(fullPath);

  // 过滤出 MDX 文件和目录，排除 _meta.json 和以 _ 开头的文件/目录
  const validItems = items.filter(item => {
    if (item === '_meta.json' || item.startsWith('_')) {
      return false;
    }

    const itemPath = path.join(fullPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    // 如果是目录，检查是否有 index.mdx 或 index.md
    if (isDirectory) {
      return true;
    }

    // 如果是文件，检查是否是 MDX 或 MD 文件
    return item.endsWith('.mdx') || item.endsWith('.md');
  });

  // 根据 meta 配置排序
  const sortedItems = validItems.sort((a, b) => {
    const aOrder = meta[a]?.order || 0;
    const bOrder = meta[b]?.order || 0;
    return aOrder - bOrder;
  });

  // 构建侧边栏项目
  return sortedItems.map(item => {
    const itemPath = path.join(fullPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
    const metaConfig = meta[item] || {};

    // 如果是目录，递归获取子项目
    if (isDirectory) {
      const subDirPath = path.join(fullPath, item);
      const subMetaPath = path.join(subDirPath, '_meta.json');
      let subMeta = {};

      if (fs.existsSync(subMetaPath)) {
        try {
          const subMetaContent = fs.readFileSync(subMetaPath, 'utf8');
          subMeta = JSON.parse(subMetaContent);
        } catch (error) {
          console.error(`解析 ${itemRelativePath} 的 _meta.json 文件失败:`, error);
        }
      }

      const subItems = getDirectoryStructure(rootDir, itemRelativePath, subMeta, category);
      const title = metaConfig.title || item;

      return {
        title,
        items: subItems,
        type: 'menu',
        collapsed: metaConfig.collapsed !== false, // 默认折叠
      };
    }

    // 如果是文件，创建页面项目
    const slug = item.replace(/\.(mdx|md)$/, '');
    let title = metaConfig.title || slug;

    // 如果没有配置标题，尝试从文件内容中获取
    if (!metaConfig.title) {
      try {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        if (data.title) {
          title = data.title;
        }
      } catch (error) {
        console.error(`读取 ${itemRelativePath} 的内容失败:`, error);
      }
    }

    return {
      title,
      href: metaConfig.href || `/${category}/${itemRelativePath.replace(/\.(mdx|md)$/, '')}`,
      type: metaConfig.type || 'page',
      isExternal: !!metaConfig.href && metaConfig.href.startsWith('http'),
      filePath: itemRelativePath.replace(/\.(mdx|md)$/, ''),
    };
  });
}
