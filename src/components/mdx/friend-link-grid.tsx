import { FriendLinkCard } from '@/components/cards';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {children}
    </div>
  );
}

export function FriendLinkItem({
  title,
  description,
  url,
  avatar,
}: FriendLinkItemProps) {
  return (
    <FriendLinkCard
      title={title}
      description={description}
      url={url}
      avatar={avatar}
    />
  );
}
