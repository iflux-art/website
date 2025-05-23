'use client';

import { useEffect } from 'react';
import { setupPreloading } from '@/lib/preload';

/**
 * 预加载组件
 * 
 * 在页面加载完成后预加载数据，提高用户体验
 */
export function Preloader() {
  useEffect(() => {
    // 在页面加载完成后预加载数据
    setupPreloading();
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
}
