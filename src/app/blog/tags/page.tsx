import Link from 'next/link';
import { Tag, ArrowLeft } from 'lucide-react';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default function TagsPage() {
  // 获取所有标签及其文章数量
  const tagsWithCount = getAllTagsWithCount();
  
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link 
          href="/blog"
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客列表
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Tag className="h-6 w-6" />
        标签云
      </h1>
      
      <p className="text-muted-foreground mb-8">共有 {Object.keys(tagsWithCount).length} 个标签</p>
      
      <div className="flex flex-wrap gap-3">
        {Object.entries(tagsWithCount)
          .sort((a, b) => b[1] - a[1]) // 按文章数量排序
          .map(([tag, count]) => (
            <Link 
              key={tag} 
              href={`/blog/tags/${encodeURIComponent(tag)}`}
              className="px-4 py-2 bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>{tag}</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            </Link>
          ))}
      </div>
      
      {Object.keys(tagsWithCount).length === 0 && (
        <div className="text-center py-10">
          <p>暂无标签</p>
        </div>
      )}
    </main>
  );
}

// 获取所有标签及其文章数量
function getAllTagsWithCount() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return {};
  
  const tagsCount: Record<string, number> = {};
  
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
        
        // 只统计已发布文章的标签
        if (data.published !== false && data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => {
            tagsCount[tag] = (tagsCount[tag] || 0) + 1;
          });
        }
      }
    }
  };
  
  findTagsInFiles(blogDir);
  return tagsCount;
}