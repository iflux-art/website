'use client';

import { HeroSection } from '@/features/home/components';

// 由于使用了 'use client'，这里不能导出 metadata
// 在实际项目中应该考虑使用服务端组件或 generateMetadata 函数

const Home = () => (
  <>
    {/* Hero区域 - 跳出容器限制，直接占满全屏 */}
    <HeroSection />

    {/* 可以在这里添加更多内容区块 */}
    {/* 例如：精选文章、热门链接、功能介绍等 */}
    {/* 如果需要添加其他内容，可以用 PageContainer 包装 */}
  </>
);

export default Home;
