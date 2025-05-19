import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 获取所有标签
export function getAllTags(): string[] {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  
  const allTags = new Set<string>();
  
  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
        // 只收集已发布文章的标签
        if (data.published !== false && data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => allTags.add(tag));
        }
      }
    }
  };
  
  findTagsInFiles(blogDir);
  return Array.from(allTags).sort();
}

// 获取所有标签及其文章数量
export function getAllTagsWithCount(): Record<string, number> {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return {};
  
  const tagCounts: Record<string, number> = {};
  
  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
        // 只收集已发布文章的标签
        if (data.published !== false && data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      }
    }
  };
  
  findTagsInFiles(blogDir);
  return tagCounts;
}

// 根据标签获取文章
export function getPostsByTag(tag: string) {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  
  const posts: Post[] = [];
  
  // 递归函数来查找所有博客文件
  const findPostsWithTag = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findPostsWithTag(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
        // 检查是否包含指定标签
        if (
          data.published !== false && 
          data.tags && 
          Array.isArray(data.tags) && 
          data.tags.includes(tag)
        ) {
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
          
          posts.push({
            slug,
            title: data.title || slug,
            excerpt: data.excerpt || '点击阅读全文',
            date: data.date,
            tags: data.tags
          });
        }
      }
    }
  };
  
  findPostsWithTag(blogDir);
  
  // 按日期排序
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}