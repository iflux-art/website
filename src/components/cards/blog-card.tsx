import { BaseCard } from './base-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
  href: string;
  className?: string;
}

export function BlogCard({
  title,
  description,
  publishDate,
  tags,
  href,
  className,
}: BlogCardProps) {
  return (
    <BaseCard title={title} description={description} className={className} href={href}>
      <div className="space-y-3">
        {/* 发布时间 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(publishDate)}</span>
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Tag className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <div className="flex items-center gap-1 overflow-hidden">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} className="text-xs flex-shrink-0">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge className="text-xs flex-shrink-0">+{tags.length - 2}</Badge>
              )}
            </div>
          </div>
        )}

        {/* 阅读按钮 */}
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="group-hover:text-primary">
            阅读全文
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </BaseCard>
  );
}
