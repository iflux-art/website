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

export default function AdminPage() {
  return (
    <PageContainer config={{ layout: 'full-width' }}>
      <div>
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">管理后台</h1>
          <p className="text-lg text-muted-foreground">网站内容管理和配置</p>
        </div>

        {/* 管理内容 */}
        <LinksAdminPage />
      </div>
    </PageContainer>
  );
}
