import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocSidebarItem } from '@/components/features/sidebar/doc-sidebar';
import { getApiCache, setApiCache, generateApiCacheKey } from '@/lib/api-cache';

/**
 * 获取指定分类的侧边栏结构的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含分类名称
 * @returns 指定分类的侧边栏结构
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const resolvedParams = await params;
    const category = resolvedParams.category;
    const decodedCategory = decodeURIComponent(category);

    // 生成缓存键
    const cacheKey = generateApiCacheKey(`/api/docs/sidebar/${decodedCategory}`, {});

    // 尝试从缓存中获取响应
    const cachedData = getApiCache<DocSidebarItem[]>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // 根据分类选择不同的内容目录
    let contentDir;
    if (decodedCategory === 'navigation') {
      contentDir = path.join(process.cwd(), 'src', 'content', 'navigation');
    } else {
      contentDir = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory);
    }

    if (!fs.existsSync(contentDir) || !fs.statSync(contentDir).isDirectory()) {
      return NextResponse.json({ error: `分类 ${decodedCategory} 不存在` }, { status: 404 });
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
    // 传递额外的参数，指示这是否是文档分类
    const isDocsCategory = decodedCategory !== 'navigation';
    const items = getDirectoryStructure(contentDir, '', meta, decodedCategory, isDocsCategory);

    // 添加调试日志
    console.log(
      `生成侧边栏结构: 分类=${decodedCategory}, 是否为文档分类=${isDocsCategory}, 项目数量=${items.length}`
    );

    // 将响应数据存入缓存
    setApiCache(cacheKey, items);

    // 设置缓存头
    const headers = new Headers();
    headers.set(
      'Cache-Control',
      'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400'
    );
    headers.set('Surrogate-Control', 'max-age=86400'); // CDN 缓存 24 小时
    headers.set('Vary', 'Accept-Encoding'); // 根据压缩方式缓存不同版本

    return NextResponse.json(items, { headers });
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
  category: string,
  isDocsCategory: boolean = false
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
    const aConfig = meta[a];
    const bConfig = meta[b];

    // 处理两种可能的 _meta.json 格式
    // 1. { "file-name": { order: 1, title: "Title" } }
    // 2. { "file-name": "Title" }

    // 如果 meta 中有该文件的配置
    if (aConfig !== undefined && bConfig !== undefined) {
      // 如果两个文件都在 meta 中有配置
      if (typeof aConfig === 'object' && typeof bConfig === 'object') {
        // 如果配置是对象，使用 order 属性
        const aOrder = aConfig.order || 0;
        const bOrder = bConfig.order || 0;
        return aOrder - bOrder;
      } else {
        // 如果配置不是对象（可能是字符串），按照在 meta 中的顺序排序
        const keys = Object.keys(meta);
        return keys.indexOf(a) - keys.indexOf(b);
      }
    } else if (aConfig !== undefined) {
      // 如果只有 a 在 meta 中有配置，a 排在前面
      return -1;
    } else if (bConfig !== undefined) {
      // 如果只有 b 在 meta 中有配置，b 排在前面
      return 1;
    } else {
      // 如果都没有配置，按字母顺序排序
      return a.localeCompare(b);
    }
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

      // 检查目录中是否有 index.mdx 或 index.md 文件，并获取其标题
      const indexMdxPath = path.join(subDirPath, 'index.mdx');
      const indexMdPath = path.join(subDirPath, 'index.md');
      let indexTitle = null;

      if (fs.existsSync(indexMdxPath)) {
        try {
          const indexContent = fs.readFileSync(indexMdxPath, 'utf8');
          const { data } = matter(indexContent);
          if (data.title) {
            indexTitle = data.title;
          }
        } catch (error) {
          console.error(`读取 ${itemRelativePath}/index.mdx 的内容失败:`, error);
        }
      } else if (fs.existsSync(indexMdPath)) {
        try {
          const indexContent = fs.readFileSync(indexMdPath, 'utf8');
          const { data } = matter(indexContent);
          if (data.title) {
            indexTitle = data.title;
          }
        } catch (error) {
          console.error(`读取 ${itemRelativePath}/index.md 的内容失败:`, error);
        }
      }

      const subItems = getDirectoryStructure(
        rootDir,
        itemRelativePath,
        subMeta,
        category,
        isDocsCategory
      );

      // 标题优先级：_meta.json 中的 title > index.mdx 中的 title > 目录名
      let title;
      if (typeof metaConfig === 'string') {
        // 如果 metaConfig 是字符串，直接使用
        title = metaConfig;
      } else if (metaConfig && metaConfig.title) {
        // 如果 metaConfig 是对象且有 title 属性
        title = metaConfig.title;
      } else {
        // 否则使用 index 文件的标题或目录名
        title = indexTitle || item;
      }

      // 确定是否折叠
      let collapsed = true; // 默认折叠

      if (typeof metaConfig === 'object' && metaConfig.collapsed !== undefined) {
        collapsed = metaConfig.collapsed;
      }

      return {
        title,
        items: subItems,
        type: 'menu',
        collapsed,
      };
    }

    // 如果是文件，创建页面项目
    const slug = item.replace(/\.(mdx|md)$/, '');
    let title;

    // 处理不同格式的 metaConfig
    if (typeof metaConfig === 'string') {
      // 如果 metaConfig 是字符串，直接使用
      title = metaConfig;
    } else if (metaConfig && metaConfig.title) {
      // 如果 metaConfig 是对象且有 title 属性
      title = metaConfig.title;
    } else {
      // 如果没有配置标题，尝试从文件内容中获取
      try {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        if (data.title) {
          title = data.title;
        } else {
          // 如果文件内容中也没有标题，使用文件名
          title = slug;
        }
      } catch (error) {
        console.error(`读取 ${itemRelativePath} 的内容失败:`, error);
        title = slug;
      }
    }

    // 构建正确的链接路径
    let href;
    if (typeof metaConfig === 'object' && metaConfig.href) {
      href = metaConfig.href;
    } else {
      // 确保链接格式正确，对于 docs 和 navigation 分类使用不同的前缀
      const linkPath = itemRelativePath.replace(/\.(mdx|md)$/, '');

      // 根据分类类型生成不同的链接前缀
      if (category === 'navigation') {
        href = `/navigation/${linkPath}`;
      } else if (isDocsCategory) {
        // 对于文档分类，始终添加 /docs 前缀
        href = `/docs/${category}/${linkPath}`;
      } else {
        // 其他情况
        href = `/${category}/${linkPath}`;
      }
    }

    // 确定是否是外部链接
    let isExternal = false;
    let type = 'page';

    if (typeof metaConfig === 'object') {
      // 如果 metaConfig 是对象
      type = metaConfig.type || 'page';
      isExternal = !!metaConfig.href && metaConfig.href.startsWith('http');
    } else {
      // 如果 metaConfig 不是对象，使用默认值
      isExternal = href.startsWith('http');
    }

    return {
      title,
      href,
      type,
      isExternal,
      filePath: itemRelativePath.replace(/\.(mdx|md)$/, ''),
    };
  });
}
