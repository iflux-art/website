import { PageContainer } from '@/features/layout';
import { LinksAdminPage } from '@/features/admin/components';
import { generateSEOMetadata } from '@/lib/seo-utils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: '管理后台',
  description: '网站内容管理后台，用于管理链接、文章和其他网站内容',
  noIndex: true, // 防止搜索引擎索引管理页面
  noFollow: true,
});

const AdminPage = () => (
  <PageContainer config={{ layout: 'full-width' }}>
    <div>
      {/* 管理内容 */}
      <LinksAdminPage />
    </div>
  </PageContainer>
);

export default AdminPage;
