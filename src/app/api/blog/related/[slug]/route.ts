import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 获取相关文章的 API 路由
 * 
 * @param request 请求对象
 * @param params 路由参数，包含文章 slug
 * @returns 相关文章列表
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const decodedSlug = decodeURIComponent(slug);
    
    // 获取 URL 参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3', 10);
    
    // 查找当前文章的文件路径
    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    let filePath: string | undefined;
    
    // 递归函数来查找文章文件
    const findArticleFile = (dir: string, targetSlug: string): string | undefined => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          const found = findArticleFile(itemPath, targetSlug);
          if (found) return found;
        } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
          // 计算 slug
          const relativePath = path.relative(blogDir, itemPath);
          const pathParts = relativePath.split(path.sep);
          let fileSlug = '';
          
          if (pathParts.length === 1) {
            fileSlug = pathParts[0].replace(/\.(mdx|md)$/, '');
          } else {
            const fileName = pathParts.pop() || '';
            fileSlug = `${pathParts.join('/')}/${fileName.replace(/\.(mdx|md)$/, '')}`;
          }
          
          if (fileSlug === targetSlug) {
            return itemPath;
          }
        }
      }
      
      return undefined;
    };
    
    filePath = findArticleFile(blogDir, decodedSlug);
    
    if (!filePath) {
      return NextResponse.json(
        { error: `文章 ${decodedSlug} 不存在` },
        { status: 404 }
      );
    }
    
    // 获取相关文章
    const relatedPosts: { slug: string; title: string; excerpt: string }[] = [];
    
    // 递归函数来查找所有博客文件
    const findBlogFiles = (dir: string, basePath: string = '') => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
        
        if (item.isDirectory()) {
          findBlogFiles(itemPath, relativePath);
        } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
          // 跳过当前文章
          if (itemPath === filePath) continue;
          
          const postContent = fs.readFileSync(itemPath, 'utf8');
          const { data } = matter(postContent);
          const postSlug = item.name.replace(/\.(mdx|md)$/, '');
          const fullPostSlug = relativePath.replace(/\.(mdx|md)$/, '');
          
          // 确保文章已发布
          if (data.published !== false) {
            relatedPosts.push({
              slug: fullPostSlug,
              title: data.title || postSlug,
              excerpt: data.excerpt || '点击阅读全文'
            });
            
            // 只获取指定数量的相关文章
            if (relatedPosts.length >= limit) break;
          }
        }
      }
    };
    
    findBlogFiles(blogDir);
    
    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error(`获取相关文章失败:`, error);
    return NextResponse.json(
      { error: `获取相关文章失败` },
      { status: 500 }
    );
  }
}
