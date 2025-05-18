import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// 获取所有博客文章
function getAllPosts() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  
  const posts = [];
  
  // 递归函数来查找所有博客文件
  const findPosts = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findPosts(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
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
          
          posts.push({
            slug,
            title: data.title || slug,
            excerpt: data.excerpt || '点击阅读全文',
            date: data.date,
            tags: data.tags || []
          });
        }
      }
    }
  };
  
  findPosts(blogDir);
  
  // 按日期排序
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('获取博客文章列表失败:', error);
    return NextResponse.json(
      { error: '获取博客文章列表失败' },
      { status: 500 }
    );
  }
}