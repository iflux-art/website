/**
 * 性能监控上下文
 * 提供全局性能监控功能
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { WebVitalsMetrics, PerformanceData } from "@/hooks/use-performance-tracking";

// 性能监控上下文类型
interface PerformanceContextType {
  metrics: WebVitalsMetrics[];
  addMetrics: (metrics: WebVitalsMetrics) => void;
  clearMetrics: () => void;
  getAverageMetrics: () => WebVitalsMetrics;
  isTracking: boolean;
  setIsTracking: (tracking: boolean) => void;
}

// 创建性能监控上下文
const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

// 性能监控提供者Props
interface PerformanceProviderProps {
  children: React.ReactNode;
  onReport?: (data: PerformanceData) => void;
}

/**
 * 性能监控提供者
 */
export function PerformanceProvider({ children, onReport }: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<WebVitalsMetrics[]>([]);
  const [isTracking, setIsTracking] = useState(true);

  // 添加性能指标
  const addMetrics = useCallback(
    (newMetrics: WebVitalsMetrics) => {
      if (!isTracking) return;

      setMetrics(prev => [...prev, newMetrics]);

      // 如果提供了上报函数，则调用
      if (onReport) {
        const performanceData: PerformanceData = {
          pathname: typeof window !== "undefined" ? window.location.pathname : "",
          metrics: newMetrics,
          timestamp: Date.now(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        };

        onReport(performanceData);
      }
    },
    [isTracking, onReport]
  );

  // 清除性能指标
  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  // 获取平均性能指标
  const getAverageMetrics = useCallback((): WebVitalsMetrics => {
    if (metrics.length === 0) return {};

    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    // 计算每个指标的总和和计数
    metrics.forEach(metric => {
      Object.entries(metric).forEach(([key, value]) => {
        if (typeof value === "number") {
          const metricKey = key as keyof WebVitalsMetrics;
          sums[metricKey] = (sums[metricKey] || 0) + value;
          counts[metricKey] = (counts[metricKey] || 0) + 1;
        }
      });
    });

    // 计算平均值，添加安全检查
    const averages: WebVitalsMetrics = {};
    Object.keys(sums).forEach(key => {
      const metricKey = key as keyof WebVitalsMetrics;
      if (counts[metricKey] && counts[metricKey] > 0) {
        averages[metricKey] = (sums[metricKey] || 0) / counts[metricKey];
      } else {
        averages[metricKey] = 0;
      }
    });

    return averages;
  }, [metrics]);

  // 性能监控上下文值
  const contextValue: PerformanceContextType = {
    metrics,
    addMetrics,
    clearMetrics,
    getAverageMetrics,
    isTracking,
    setIsTracking,
  };

  return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>;
}

/**
 * 使用性能监控上下文
 */
export function usePerformance() {
  const context = useContext(PerformanceContext);

  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }

  return context;
}

/**
 * 性能监控组件
 * 用于显示当前性能指标
 */
export function PerformanceMonitor() {
  const { metrics, getAverageMetrics, isTracking } = usePerformance();

  if (!isTracking) return null;

  const averageMetrics = getAverageMetrics();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        <div>Page Views: {metrics.length}</div>
        {averageMetrics.FCP && <div>FCP: {averageMetrics.FCP.toFixed(2)}ms</div>}
        {averageMetrics.LCP && <div>LCP: {averageMetrics.LCP.toFixed(2)}ms</div>}
        {averageMetrics.CLS && <div>CLS: {averageMetrics.CLS.toFixed(4)}</div>}
        {averageMetrics.FID && <div>FID: {averageMetrics.FID.toFixed(2)}ms</div>}
      </div>
    </div>
  );
}
