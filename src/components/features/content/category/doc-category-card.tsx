import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DocCategory } from '@/lib/content';

interface DocCategoryCardProps {
  category: DocCategory;
}

export function DocCategoryCard({ category }: DocCategoryCardProps) {
  return (
    <Card key={category.id} className="overflow-hidden">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
        <p className="text-muted-foreground">{category.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
        <Link
          href={`/docs/${category.id}`}
          className="text-sm font-medium flex items-center hover:text-primary transition-colors"
        >
          浏览文档
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
        <span className="text-xs text-muted-foreground">{category.count} 篇文章</span>
      </CardFooter>
    </Card>
  );
}
