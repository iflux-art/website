'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/service-worker';

export function ServiceWorkerProvider() {
  useEffect(() => {
    // 注册 Service Worker
    registerServiceWorker().catch(console.error);
  }, []);

  return null;
}
