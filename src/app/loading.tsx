"use client";

import { useEffect, useState } from "react";

/**
 * 进度条加载状态组件
 * 显示进度条加载状态
 */
export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    // 进度条动画
    const initialProgress = setTimeout(() => {
      setProgress(30);
    }, 100);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(90, prev + increment);
      });
    }, 300);

    const opacityInterval = setInterval(() => {
      setOpacity((prev) => (prev === 0.8 ? 1 : 0.8));
    }, 800);

    return () => {
      clearTimeout(initialProgress);
      clearInterval(progressInterval);
      clearInterval(opacityInterval);
    };
  }, []);

  // 显示进度条
  return (
    <div className="fixed top-16 right-0 left-0 z-50">
      <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-primary dark:bg-primary"
          style={{
            width: `${progress}%`,
            opacity,
            transition: "width 300ms ease-out",
            transform: "translateZ(0)",
            boxShadow:
              "0 0 12px color-mix(in srgb, var(--color-primary) 70%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
