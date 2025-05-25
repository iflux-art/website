'use client';

import { useState, useEffect } from 'react';

/**
 * 粘性定位钩子
 *
 * 提供侧边栏和目录的粘性定位功能
 */
export function useStickyPosition() {
  const [topOffset, setTopOffset] = useState(88); // 默认值：64px导航栏 + 24px容器边距

  useEffect(() => {
    const calculateTopOffset = () => {
      // 固定值：导航栏64px + 容器py-6的上边距24px = 88px
      // 这样可以与面包屑顶部对齐
      setTopOffset(88);
    };

    // 立即计算
    calculateTopOffset();

    // 监听窗口大小变化
    const handleResize = () => calculateTopOffset();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    topOffset,
    stickyStyle: {
      position: 'sticky' as const,
      top: `${topOffset}px`,
      height: `calc(100vh - ${topOffset}px - 2rem)`,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    },
  };
}
