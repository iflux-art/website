'use client';

import { PageContainer } from '@/features/layout';
import { HeroSection } from '@/features/home/components';

// 由于使用了 'use client'，这里不能导出 metadata
// 在实际项目中应该考虑使用服务端组件或 generateMetadata 函数

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 主页Hero区域 - 使用全屏布局 */}
      <PageContainer config={{ layout: 'full-width' }}>
        <div className="space-y-12">
          {/* Hero区域 */}
          <HeroSection />

          {/* 可以在这里添加更多内容区块 */}
          {/* 例如：精选文章、热门链接、功能介绍等 */}
        </div>
      </PageContainer>
    </div>
  );
}
