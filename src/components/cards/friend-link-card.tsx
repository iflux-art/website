import { BaseCard } from './base-card';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface FriendLinkCardProps {
  title: string;
  description: string;
  url: string;
  avatar?: string;
  className?: string;
}

export function FriendLinkCard({
  title,
  description,
  url,
  avatar,
  className,
}: FriendLinkCardProps) {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <BaseCard
      title={title}
      description={description}
      className={className}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* 网站头像 */}
        {avatar && (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src={avatar}
              alt={`${title} 头像`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}

        {/* 外链图标 */}
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </BaseCard>
  );
}
