import { AppGrid } from '@/features/layout';
import { LinkCard } from '@/features/links/components';
import type { LinksItem } from '@/features/links/types';
import profileData from '@/content/links/profile.json';

export default function AboutPage() {
  const profileItems: LinksItem[] = profileData.map(item => {
    const typedItem = item as LinksItem & { iconType?: 'image' | 'text' };
    return {
      ...item,
      category: item.category as 'profile',
      iconType: typedItem.iconType ?? 'image',
    };
  });

  return (
    <div className="container mx-auto py-8">
      {profileItems.length > 0 && (
        <AppGrid columns={5} className="items-stretch">
          {profileItems.map(item => (
            <LinkCard
              key={item.id}
              title={item.title}
              description={item.description || item.url}
              href={item.url}
              icon={item.icon}
              iconType={item.iconType}
              isExternal={true}
              className="h-full"
            />
          ))}
        </AppGrid>
      )}
    </div>
  );
}
