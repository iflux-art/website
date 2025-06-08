import { UnifiedCard } from '@/components/ui/unified-card';

interface FriendLinkGridProps {
  children: React.ReactNode;
}

interface FriendLinkItemProps {
  title: string;
  description: string;
  url: string;
  avatar?: string;
}

export function FriendLinkGrid({ children }: FriendLinkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">{children}</div>
  );
}

export function FriendLinkItem({ title, description, url, avatar }: FriendLinkItemProps) {
  return (
    <UnifiedCard
      type="friend"
      title={title}
      description={description}
      href={url}
      icon={avatar}
      iconType="image"
      isExternal={true}
    />
  );
}