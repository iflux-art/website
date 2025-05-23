'use client';

import { createLazyComponent } from '@/lib/code-splitting';

/**
 * 懒加载的代码块组件
 */
export const LazyCodeBlock = createLazyComponent(
  () => import('@/components/ui/code-block').then(mod => ({ default: mod.CodeBlock })),
  {
    fallback: <div className="w-full h-32 bg-muted/30 rounded-lg animate-pulse" />,
    loadOnVisible: true,
    ssr: false,
    preloadDelay: 2000,
  }
);

/**
 * 懒加载的表格组件
 */
export const LazyTable = createLazyComponent(
  () => import('@/components/ui/table').then(mod => ({ default: mod.Table })),
  {
    fallback: <div className="w-full h-32 bg-muted/30 rounded-lg animate-pulse" />,
    loadOnVisible: true,
    ssr: false,
  }
);

/**
 * 懒加载的目录组件
 */
export const LazyTableOfContents = createLazyComponent(
  () => import('@/components/ui/table-of-contents').then(mod => ({ default: mod.TableOfContents })),
  {
    fallback: <div className="w-full h-64 bg-muted/30 rounded-lg animate-pulse" />,
    loadOnVisible: true,
    ssr: false,
  }
);

/**
 * 懒加载的卡片网格组件
 */
export const LazyUnifiedGrid = createLazyComponent(
  () => import('@/components/ui/unified-grid').then(mod => ({ default: mod.UnifiedGrid })),
  {
    fallback: <div className="w-full h-64 bg-muted/30 rounded-lg animate-pulse" />,
    loadOnVisible: true,
    ssr: false,
  }
);

/**
 * 懒加载的响应式图片组件
 */
export const LazyResponsiveImage = createLazyComponent(
  () => import('@/components/ui/responsive-image').then(mod => ({ default: mod.ResponsiveImage })),
  {
    fallback: <div className="w-full h-32 bg-muted/30 rounded-lg animate-pulse" />,
    loadOnVisible: true,
    ssr: false,
  }
);
