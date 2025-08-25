import dynamicImport from 'next/dynamic';

// 强制动态生成页面，确保每次请求都获取最新数据
export const dynamic = 'force-dynamic';

// 禁用缓存，设置为0表示每次请求都会重新验证
export const revalidate = 0;

// 使用动态导入来加载客户端组件
const HeroSection = dynamicImport(
  () => import('@/features/home/components').then(mod => mod.HeroSection),
  { ssr: true } // 启用服务端渲染，但允许客户端抓取数据
);

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
