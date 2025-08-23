import { AppGrid, PageContainer } from '@/features/layout';
import { LinkCard } from '@/features/links/components';
import { generateSEOMetadata } from '@/lib/seo-utils';
import type { Metadata } from 'next';
import type { LinksItem } from '@/features/links/types';
import profileData from '@/content/links/profile.json';

export const metadata: Metadata = generateSEOMetadata({
  title: '关于我',
  description: '个人介绍和联系方式',
  type: 'profile',
});

const AboutPage = () => {
  // 处理个人资料数据，转换为 LinksItem 格式
  const profileItems: LinksItem[] = profileData.map(item => {
    const typedItem = item as LinksItem & { iconType?: 'image' | 'text' };
    return {
      ...typedItem,
      category: 'profile' as const,
      iconType: typedItem.iconType ?? 'image',
    };
  });

  return (
    <PageContainer config={{ layout: 'full-width' }}>
      <div>
        {/* 个人信息卡片网格 */}
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
                isExternal
                className="h-full"
              />
            ))}
          </AppGrid>
        )}
      </div>
    </PageContainer>
  );
};

export default AboutPage;
