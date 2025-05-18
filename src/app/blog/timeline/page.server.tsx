import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getBlogPosts() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) {
    console.error(`博客目录不存在: ${blogDir}`);
    return { blogPosts: [], postsByYear: {} };
  }
  
  const blogPosts: { slug: string; title: string; excerpt: string; date: string; tags: string[] }[] = [];
  
  // 递归函数来查找所有博客文件
  const findBlogFiles = (dir: string, basePath: string = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        findBlogFiles(itemPath, relativePath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        const slug = relativePath.replace('.mdx', '');
        
        // 确保日期格式正确
        if (data.date) {
          try {
            const dateObj = new Date(data.date);
            if (!isNaN(dateObj.getTime())) {
              blogPosts.push({
                slug,
                title: data.title || slug,
                excerpt: data.excerpt || '点击阅读全文',
                date: dateObj.toISOString(),
                tags: data.tags || []
              });
            } else {
              console.warn(`无效的日期格式: ${data.date} (文件: ${itemPath})`);
            }
          } catch (e) {
            console.error(`日期解析错误: ${data.date} (文件: ${itemPath})`, e);
          }
        } else {
          console.warn(`缺少日期字段: ${itemPath}`);
        }
      }
    }
  };
  
  findBlogFiles(blogDir);
  
  // 按日期排序
  const sortedPosts = blogPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 按年份分组
  const postsByYear: { [year: string]: typeof blogPosts } = {};
  
  sortedPosts.forEach(post => {
    try {
      const year = new Date(post.date).getFullYear().toString();
      if (!postsByYear[year]) {
        postsByYear[year] = [];
      }
      postsByYear[year].push({
        ...post,
        date: new Date(post.date).toISOString() // 确保日期格式统一
      });
    } catch {
      console.error(`Invalid date format for post ${post.slug}: ${post.date}`);
    }
  });
  
  return { blogPosts: sortedPosts, postsByYear };
}