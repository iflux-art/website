import { BaseCard } from './base-card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface NavigationCardProps {
  title: string;
  description: string;
  url: string;
  icon?: string;
  isRecommended?: boolean;
  className?: string;
}

export function NavigationCard({
  title,
  description,
  url,
  icon,
  isRecommended = false,
  className,
}: NavigationCardProps) {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <BaseCard title={title} description={description} className={className} onClick={handleClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 网站图标 */}
          {icon && (
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <Image
                src={icon}
                alt={`${title} 图标`}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                unoptimized
              />
            </div>
          )}

          {/* 推荐标签 */}
          {isRecommended && (
            <Badge variant="primary" className="bg-gradient-to-r from-blue-500 to-purple-600">
              推荐
            </Badge>
          )}
        </div>

        {/* 外链图标 */}
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </BaseCard>
  );
}
