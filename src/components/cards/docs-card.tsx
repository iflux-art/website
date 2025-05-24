import { BaseCard } from './base-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DocsCardProps {
  title: string;
  description: string;
  articleCount: number;
  href: string;
  className?: string;
}

export function DocsCard({ title, description, articleCount, href, className }: DocsCardProps) {
  return (
    <BaseCard title={title} description={description} className={className} href={href}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="group-hover:text-primary">
          浏览文档
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
        <div className="flex items-center gap-2">
          <Badge>{articleCount} 篇文档</Badge>
        </div>
      </div>
    </BaseCard>
  );
}
