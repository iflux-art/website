import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function DocsPage({ params }: { params: { lang: string } }) {
  const resolvedParams = React.use(params);
  // 验证语言参数
  if (resolvedParams.lang !== 'zh' && resolvedParams.lang !== 'en') {
    notFound();
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{resolvedParams.lang === 'zh' ? '文档中心' : 'Documentation'}</h1>
      <p className="text-muted-foreground mb-10 max-w-3xl">
        {resolvedParams.lang === 'zh' 
          ? '浏览我们的技术文档，了解产品功能和使用方法。' 
          : 'Browse our technical documentation to learn about product features and usage.'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DocsList lang={resolvedParams.lang} />
      </div>
    </main>
  );
}

function DocsList({ lang }: { lang: string }) {
  // 获取文档目录列表
  const docsDir = path.join(process.cwd(), 'src', 'content', lang, 'docs');
  
  // 检查目录是否存在
  if (!fs.existsSync(docsDir)) {
    return (
      <div className="col-span-full text-center py-10">
        <p>{lang === 'zh' ? '暂无文档' : 'No documentation available'}</p>
      </div>
    );
  }

  // 读取目录内容
  const categories = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (categories.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p>{lang === 'zh' ? '暂无文档分类' : 'No documentation categories available'}</p>
      </div>
    );
  }

  return (
    <>
      {categories.map(category => {
        const categoryPath = path.join(docsDir, category);
        const files = fs.readdirSync(categoryPath, { withFileTypes: true })
          .filter(file => file.isFile() && file.name.endsWith('.mdx'));
        
        if (files.length === 0) return null;
        
        // 读取第一个文件获取分类信息
        const firstFile = files[0];
        const filePath = path.join(categoryPath, firstFile.name);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        // 计算该分类下的文档数量
        const docCount = files.length;
        
        return (
          <Card key={category} className="overflow-hidden hover:shadow-md transition-all border border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{data.categoryTitle || category}</h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {data.categoryDescription || (lang === 'zh' ? '查看此分类下的文档' : 'View documents in this category')}
              </p>
              <p className="text-sm text-muted-foreground">
                {lang === 'zh' ? `${docCount} 篇文档` : `${docCount} document${docCount > 1 ? 's' : ''}`}
              </p>
            </CardContent>
            <CardFooter className="p-0">
              <Link 
                href={`/${lang}/docs/${category}`} 
                className="w-full p-4 bg-muted/50 hover:bg-muted flex items-center justify-between text-primary"
              >
                <span>{lang === 'zh' ? '浏览文档' : 'Browse docs'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}