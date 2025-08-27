/**
 * 性能监控 Hook
 * 用于监控页面加载性能和用户交互性能
 */

"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  /** 页面加载时间 */
  loadTime: number;
  /** 首次内容绘制时间 */
  fcp: number;
  /** 最大内容绘制时间 */
  lcp: number;
  /** 累积布局偏移 */
  cls: number;
  /** 首次输入延迟 */
  fid: number;
}

/**
 * 性能监控 Hook
 * @param componentName 组件名称
 * @param onMetricsReport 性能指标报告回调
 */
export function usePerformanceMonitor(
  componentName: string,
  onMetricsReport?: (metrics: PerformanceMetrics) => void
) {
  const startTimeRef = useRef<number>(0);

  // 监控组件加载时间
  useEffect(() => {
    startTimeRef.current = performance.now();

    return () => {
      const loadTime = performance.now() - startTimeRef.current;

      // 收集Web Vitals指标
      if (typeof onMetricsReport === "function") {
        const metrics: PerformanceMetrics = {
          loadTime,
          fcp: getFCP(),
          lcp: getLCP(),
          cls: getCLS(),
          fid: getFID(),
        };

        onMetricsReport(metrics);
      }

      // 在开发环境中输出性能日志
      if (process.env.NODE_ENV === "development") {
        console.log(`[${componentName}] 加载时间: ${loadTime.toFixed(2)}ms`);
      }
    };
  }, [componentName, onMetricsReport]);

  // 监控交互性能
  const measureInteraction = (interactionName: string, callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();

    const duration = end - start;

    // 在开发环境中输出性能日志
    if (process.env.NODE_ENV === "development") {
      console.log(`[${componentName}] ${interactionName} 交互时间: ${duration.toFixed(2)}ms`);
    }

    return duration;
  };

  return {
    measureInteraction,
  };
}

// 简化的Web Vitals指标获取函数
function getFCP(): number {
  // 简化实现，实际项目中可以使用 web-vitals 库
  return (
    performance.getEntriesByType("paint").find(entry => entry.name === "first-contentful-paint")
      ?.startTime ?? 0
  );
}

function getLCP(): number {
  // 简化实现
  return 0;
}

function getCLS(): number {
  // 简化实现
  return 0;
}

function getFID(): number {
  // 简化实现
  return 0;
}
