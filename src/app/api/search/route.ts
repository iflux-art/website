import { NextResponse } from 'next/server';
import { SEARCH_ITEMS } from '@/lib/constants';

// 使用 Edge Runtime 以减小函数大小
export const runtime = 'edge';

// 搜索结果类型
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  content?: string;
  tags?: string[];
  date?: string;
}

/**
 * 搜索API
 * 支持全文搜索博客、文档和其他页面内容
 */
export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 如果没有查询词，返回预定义的搜索项
    if (!query.trim()) {
      const defaultResults = SEARCH_ITEMS.map(item => ({
        id: item.id.toString(),
        title: item.title,
        url: item.url,
        category: item.category,
      }));

      return NextResponse.json({
        results: defaultResults.slice(0, limit),
        total: defaultResults.length
      });
    }

    // 执行搜索
    const results = await performSearch(query, category, limit);

    return NextResponse.json({
      results,
      total: results.length,
      query
    });
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json(
      { error: '搜索失败', message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 执行搜索
 * @param query 搜索词
 * @param category 分类筛选
 * @param limit 结果数量限制
 */
async function performSearch(query: string, category: string, limit: number): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const searchTerm = query.toLowerCase().trim();

  // 在 Edge Runtime 中，我们只搜索预定义项目
  // 因为 Edge Functions 不能访问文件系统
  const predefinedResults = searchPredefinedItems(searchTerm, category);
  results.push(...predefinedResults);

  // 搜索导航链接
  if (!category || category === 'navigation') {
    try {
      const navigationResults = await searchNavigationLinks(searchTerm);
      results.push(...navigationResults);
    } catch (error) {
      console.error('搜索导航链接失败:', error);
    }
  }

  // 对结果进行排序和去重
  const uniqueResults = deduplicateResults(results);
  const sortedResults = sortResultsByRelevance(uniqueResults, searchTerm);

  return sortedResults.slice(0, limit);
}

/**
 * 搜索预定义项目
 */
function searchPredefinedItems(searchTerm: string, category: string): SearchResult[] {
  return SEARCH_ITEMS
    .filter(item => {
      // 如果指定了分类，则只搜索该分类
      if (category && item.category !== category) {
        return false;
      }

      // 搜索标题和英文标题
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
      return titleMatch || titleEnMatch;
    })
    .map(item => ({
      id: `predefined-${item.id}`,
      title: item.title,
      url: item.url,
      category: item.category,
    }));
}

/**
 * 搜索博客内容
 */
async function searchBlogContent(searchTerm: string, category: string): Promise<SearchResult[]> {
  if (category && category !== 'blog') {
    return [];
  }

  const results: SearchResult[] = [];
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');

  if (!fs.existsSync(blogDir)) {
    return results;
  }

  // 递归搜索博客文件
  const searchBlogFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        searchBlogFiles(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data, content } = matter(fileContent);

          // 只包含已发布的文章
          if (data.published !== false) {
            // 计算slug
            let slug = '';
            const relativePath = path.relative(blogDir, itemPath);
            const pathParts = relativePath.split(path.sep);

            if (pathParts.length === 1) {
              // 直接在blog目录下的文件
              slug = pathParts[0].replace(/\.(mdx|md)$/, '');
            } else {
              // 在子目录中的文件
              const fileName = pathParts.pop() || '';
              slug = `${pathParts.join('/')}/${fileName.replace(/\.(mdx|md)$/, '')}`;
            }

            // 搜索标题、摘要和内容
            const titleMatch = data.title?.toLowerCase().includes(searchTerm);
            const excerptMatch = data.excerpt?.toLowerCase().includes(searchTerm);
            const contentMatch = content.toLowerCase().includes(searchTerm);
            const tagsMatch = data.tags && Array.isArray(data.tags) &&
              data.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm));

            if (titleMatch || excerptMatch || contentMatch || tagsMatch) {
              results.push({
                id: `blog-${slug}`,
                title: data.title || slug,
                description: data.excerpt || '',
                url: `/blog/${slug}`,
                category: 'blog',
                content: content.substring(0, 200) + '...',
                tags: data.tags,
                date: data.date
              });
            }
          }
        } catch (error) {
          console.error(`处理博客文件 ${itemPath} 时出错:`, error);
        }
      }
    }
  };

  searchBlogFiles(blogDir);
  return results;
}

/**
 * 搜索文档内容
 */
async function searchDocsContent(searchTerm: string, category: string): Promise<SearchResult[]> {
  if (category && category !== 'docs') {
    return [];
  }

  const results: SearchResult[] = [];
  const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');

  if (!fs.existsSync(docsDir)) {
    return results;
  }

  // 递归搜索文档文件
  const searchDocsFiles = (dir: string, categoryPath: string = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        const subCategoryPath = categoryPath ? `${categoryPath}/${item.name}` : item.name;
        searchDocsFiles(itemPath, subCategoryPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md')) && !item.name.startsWith('_')) {
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data, content } = matter(fileContent);

          // 只包含已发布的文档
          if (data.published !== false) {
            const slug = item.name.replace(/\.(mdx|md)$/, '');
            const docPath = categoryPath ? `${categoryPath}/${slug}` : slug;

            // 搜索标题、描述和内容
            const titleMatch = data.title?.toLowerCase().includes(searchTerm);
            const descriptionMatch = data.description?.toLowerCase().includes(searchTerm) ||
                                    data.excerpt?.toLowerCase().includes(searchTerm);
            const contentMatch = content.toLowerCase().includes(searchTerm);

            if (titleMatch || descriptionMatch || contentMatch) {
              results.push({
                id: `docs-${docPath}`,
                title: data.title || slug,
                description: data.description || data.excerpt || '',
                url: `/docs/${docPath}`,
                category: 'docs',
                content: content.substring(0, 200) + '...'
              });
            }
          }
        } catch (error) {
          console.error(`处理文档文件 ${itemPath} 时出错:`, error);
        }
      }
    }
  };

  searchDocsFiles(docsDir);
  return results;
}

/**
 * 对结果进行去重
 */
function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const uniqueUrls = new Set<string>();
  return results.filter(result => {
    if (uniqueUrls.has(result.url)) {
      return false;
    }
    uniqueUrls.add(result.url);
    return true;
  });
}

/**
 * 按相关性对结果进行排序
 */
function sortResultsByRelevance(results: SearchResult[], searchTerm: string): SearchResult[] {
  return results.sort((a, b) => {
    // 计算相关性分数
    const scoreA = calculateRelevanceScore(a, searchTerm);
    const scoreB = calculateRelevanceScore(b, searchTerm);

    // 按分数降序排序
    return scoreB - scoreA;
  });
}

/**
 * 搜索导航链接
 * 使用动态导入获取 JSON 文件
 */
async function searchNavigationLinks(searchTerm: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // 获取所有导航分类
    const categories = await import('@/data/navigation/index.json').then(module => module.default);

    // 遍历每个分类
    for (const category of categories) {
      try {
        // 获取分类下的子分类
        const categoryData = await import(`@/data/navigation/${category.id}/index.json`).then(module => module.default);

        // 遍历每个子分类
        for (const subcategory of categoryData.subcategories) {
          try {
            // 获取子分类下的链接
            const subcategoryData = await import(`@/data/navigation/${category.id}/${subcategory.id}.json`).then(module => module.default);

            // 搜索链接
            const matchedLinks = subcategoryData.links.filter(link => {
              const titleMatch = link.title.toLowerCase().includes(searchTerm);
              const descriptionMatch = link.description?.toLowerCase().includes(searchTerm);
              const tagsMatch = link.tags?.some(tag => tag.toLowerCase().includes(searchTerm));

              return titleMatch || descriptionMatch || tagsMatch;
            });

            // 添加到结果中
            results.push(...matchedLinks.map(link => ({
              id: `navigation-${category.id}-${subcategory.id}-${link.id}`,
              title: link.title,
              description: link.description,
              url: link.url,
              category: 'navigation',
              subcategory: `${category.title} - ${subcategory.title}`,
              tags: link.tags
            })));
          } catch (error) {
            console.error(`获取子分类 ${subcategory.id} 的链接失败:`, error);
          }
        }
      } catch (error) {
        console.error(`获取分类 ${category.id} 的子分类失败:`, error);
      }
    }
  } catch (error) {
    console.error('获取导航分类失败:', error);
  }

  return results;
}

/**
 * 计算搜索结果的相关性分数
 */
function calculateRelevanceScore(result: SearchResult, searchTerm: string): number {
  let score = 0;

  // 标题匹配权重最高
  if (result.title.toLowerCase().includes(searchTerm)) {
    score += 10;
    // 标题开头匹配权重更高
    if (result.title.toLowerCase().startsWith(searchTerm)) {
      score += 5;
    }
  }

  // 描述匹配
  if (result.description?.toLowerCase().includes(searchTerm)) {
    score += 5;
  }

  // 标签匹配
  if (result.tags && result.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
    score += 3;
  }

  // 内容匹配
  if (result.content?.toLowerCase().includes(searchTerm)) {
    score += 2;
  }

  // 预定义项目优先级高一些
  if (result.id.startsWith('predefined-')) {
    score += 1;
  }

  // 导航链接优先级
  if (result.id.startsWith('navigation-')) {
    score += 1;
  }

  return score;
}
