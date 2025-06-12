import { UnifiedCard } from '@/components/cards/unified-card';

interface NavigationGridProps {
  children: React.ReactNode;
}

interface NavigationItemProps {
  title: string;
  description: string;
  url: string;
  icon?: string;
  featured?: boolean;
}

export function NavigationGrid({ children }: NavigationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">{children}</div>
  );
}

export function NavigationItem({
  title,
  description,
  url,
  icon,
  featured = false,
}: NavigationItemProps) {
  return (
    <UnifiedCard
      type="navigation"
      title={title}
      description={description}
      href={url}
      icon={icon}
      featured={featured}
      isExternal={true}
    />
  );
}