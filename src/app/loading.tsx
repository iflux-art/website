import { ThreeColumnGrid } from '@/features/layout';

/**
 * 全局加载状态页面
 * 根据 Next.js App Router 约定，作为全局路由加载状态
 * 保持与正常状态一致的布局和间距规范
 */
const Loading = () => {
  // 左侧边栏骨架
  const leftSidebarSkeleton = {
    position: 'left' as const,
    content: (
      <div className="space-y-4">
        <div className="h-[200px] animate-pulse rounded-md bg-muted" />
        <div className="h-[300px] animate-pulse rounded-md bg-muted" />
      </div>
    ),
    sticky: true,
    stickyTop: '96px',
    responsive: {
      hideOnMobile: true,
      hideOnTablet: false,
      hideOnDesktop: false,
    },
  };

  // 右侧边栏骨架
  const rightSidebarSkeleton = {
    position: 'right' as const,
    content: (
      <div className="space-y-4">
        <div className="h-[200px] animate-pulse rounded-md bg-muted" />
        <div className="h-[300px] animate-pulse rounded-md bg-muted" />
      </div>
    ),
    sticky: true,
    stickyTop: '96px',
    responsive: {
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktop: false,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnGrid sidebars={[leftSidebarSkeleton, rightSidebarSkeleton]}>
        {/* 主内容区加载状态 - 移除标题和描述，直接显示内容骨架 */}
        <div className="space-y-6">
          <div className="h-[300px] animate-pulse rounded-md bg-muted" />
          <div className="h-[200px] animate-pulse rounded-md bg-muted" />
          <div className="h-[400px] animate-pulse rounded-md bg-muted" />
        </div>
      </ThreeColumnGrid>
    </div>
  );
};

export default Loading;
