'use client';

import { ErrorBoundary } from '@/components/ui/error-boundary';

interface SidebarErrorWrapperProps {
  children: React.ReactNode;
}

/**
 * 侧边栏错误包装器组件
 * 
 * 用于包装侧边栏组件，处理可能的错误
 */
export function SidebarErrorWrapper({ children }: SidebarErrorWrapperProps) {
  return (
    <ErrorBoundary message="如果看到加载文档导航失败，请确保已创建 API 路由：/api/docs/sidebar/[category]/route.ts">
      {children}
    </ErrorBoundary>
  );
}
