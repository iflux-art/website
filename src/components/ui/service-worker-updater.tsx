'use client';

import React, { useEffect, useState } from 'react';
import { 
  registerServiceWorker, 
  checkForServiceWorkerUpdates 
} from '@/lib/service-worker';
import { RefreshCw } from 'lucide-react';

/**
 * Service Worker 更新通知组件属性
 */
export interface ServiceWorkerUpdaterProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * Service Worker 更新通知组件
 * 
 * 用于注册 Service Worker 并在有更新时通知用户
 * 
 * @example
 * ```tsx
 * <ServiceWorkerUpdater />
 * ```
 */
export function ServiceWorkerUpdater({ children }: ServiceWorkerUpdaterProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  
  // 注册 Service Worker
  useEffect(() => {
    registerServiceWorker().then(setRegistration);
  }, []);
  
  // 检查更新
  useEffect(() => {
    if (!registration) {
      return;
    }
    
    const cleanup = checkForServiceWorkerUpdates((reg) => {
      setUpdateAvailable(true);
      setRegistration(reg);
    });
    
    return cleanup;
  }, [registration]);
  
  // 应用更新
  const applyUpdate = () => {
    if (!registration || !registration.waiting) {
      return;
    }
    
    // 发送消息给 Service Worker，通知其更新
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // 刷新页面
    window.location.reload();
  };
  
  // 如果没有更新，不显示任何内容
  if (!updateAvailable) {
    return null;
  }
  
  // 显示更新通知
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center space-x-2">
      <RefreshCw className="h-4 w-4" />
      <span>有新版本可用</span>
      <button
        className="ml-2 px-2 py-1 bg-primary-foreground text-primary rounded-md text-sm"
        onClick={applyUpdate}
      >
        更新
      </button>
    </div>
  );
}
