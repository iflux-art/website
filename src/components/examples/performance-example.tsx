/**
 * 性能监控示例组件
 * 展示如何使用性能监控Hook
 */

"use client";

import { useEffect } from "react";
import { usePerformanceTracking } from "@/hooks/use-performance-tracking";

/**
 * 性能监控示例组件
 */
export function PerformanceExample() {
  // 使用性能监控Hook
  const { reportManualMetrics } = usePerformanceTracking(data => {
    // 自定义上报逻辑
    console.log("[Performance Example] Reporting metrics:", data);

    // 发送到API
    fetch("/api/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch(error => {
      console.error("[Performance Example] Failed to send metrics:", error);
    });
  });

  // 模拟一些自定义性能指标
  useEffect(() => {
    // 模拟组件加载时间
    const startTime = Date.now();

    // 模拟一些异步操作
    const timer = setTimeout(() => {
      const loadTime = Date.now() - startTime;

      // 上报自定义指标
      reportManualMetrics({
        FCP: loadTime, // 使用FCP字段来存储组件加载时间
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [reportManualMetrics]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Performance Monitoring Example</h2>
      <p className="text-muted-foreground">
        This component demonstrates how to use the performance tracking hook.
      </p>
    </div>
  );
}
