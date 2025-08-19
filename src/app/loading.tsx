'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    // 初始快速增长阶段
    const initialProgress = setTimeout(() => {
      setProgress(30);
    }, 100);

    // 渐进增长阶段
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        // 进度越高，增长越慢
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(90, prev + increment);
      });
    }, 300);

    // 透明度闪烁效果
    const opacityInterval = setInterval(() => {
      setOpacity(prev => (prev === 0.8 ? 1 : 0.8));
    }, 800);

    return () => {
      clearTimeout(initialProgress);
      clearInterval(progressInterval);
      clearInterval(opacityInterval);
    };
  }, []);

  return (
    <div className="fixed top-16 right-0 left-0 z-50">
      <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-primary dark:bg-primary"
          style={{
            width: `${progress}%`,
            opacity,
            transition: 'width 300ms ease-out',
            transform: 'translateZ(0)',
            boxShadow: '0 0 12px color-mix(in srgb, var(--color-primary) 70%, transparent)',
          }}
        />
      </div>
    </div>
  );
}
