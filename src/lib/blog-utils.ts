import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 获取相关文章
 * 根据当前文章的标签和分类来查找相关文章
 */
export function getRelatedPosts(currentPath: string, limit: number = 5) {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const currentContent = fs.readFileSync(currentPath, 'utf8');
  const { data: currentFrontmatter } = matter(currentContent);
  const currentTags = currentFrontmatter.tags || [];
  const currentCategory = currentFrontmatter.category;

  const relatedPosts: Array<{
    title: string;
    href: string;
    date?: string;
    category?: string;
    matchScore: number;
  }> = [];

  // 递归遍历博客目录
  function traverseDirectory(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.mdx') && fullPath !== currentPath) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(content);

        // 计算相关度分数
        let matchScore = 0;

        // 同分类加分
        if (data.category === currentCategory) {
          matchScore += 3;
        }

        // 标签匹配加分
        const commonTags = (data.tags || []).filter((tag: string) => currentTags.includes(tag));
        matchScore += commonTags.length * 2;

        // 如果有任何匹配，添加到相关文章列表
        if (matchScore > 0) {
          // 构建文章 URL
          const relativePath = path
            .relative(blogDir, fullPath)
            .replace(/\\/g, '/')
            .replace(/\.mdx$/, '');

          relatedPosts.push({
            title: data.title || item.replace(/\.mdx$/, ''),
            href: `/blog/${relativePath}`,
            date: data.date,
            category: data.category,
            matchScore,
          });
        }
      }
    }
  }

  traverseDirectory(blogDir);

  // 按相关度和日期排序
  return relatedPosts
    .sort((a, b) => {
      // 首先按相关度排序
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // 其次按日期排序
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    .slice(0, limit)
    .map(({ matchScore: _matchScore, ...post }) => post); // 移除 matchScore
}
