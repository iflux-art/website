/**
 * 性能监控显示组件
 * 在开发环境中显示实时性能指标
 */

"use client";

import { useState, useEffect } from "react";
import { usePerformance } from "@/contexts/performance-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 性能监控面板组件
 */
export function PerformanceMonitorPanel() {
  const { metrics, isTracking, setIsTracking } = usePerformance();
  const [isVisible, setIsVisible] = useState(false);

  // 只在开发环境中显示
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsVisible(true);
    }
  }, []);

  if (!(isVisible && isTracking)) return null;

  // 计算最新指标
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : undefined;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Performance Monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Page Views</span>
            <span className="font-medium">{metrics.length}</span>
          </div>

          {latestMetrics?.FCP && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">FCP</span>
              <span className="font-medium">{latestMetrics.FCP.toFixed(2)}ms</span>
            </div>
          )}

          {latestMetrics?.LCP && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">LCP</span>
              <span className="font-medium">{latestMetrics.LCP.toFixed(2)}ms</span>
            </div>
          )}

          {latestMetrics?.CLS && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">CLS</span>
              <span className="font-medium">{latestMetrics.CLS.toFixed(4)}</span>
            </div>
          )}

          {latestMetrics?.FID && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">FID</span>
              <span className="font-medium">{latestMetrics.FID.toFixed(2)}ms</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Tracking</span>
            <button
              type="button"
              onClick={() => setIsTracking(!isTracking)}
              className={`px-2 py-1 rounded text-xs ${
                isTracking ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isTracking ? "ON" : "OFF"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 简化版性能监控组件
 */
export function SimplePerformanceMonitor() {
  const { metrics, isTracking } = usePerformance();

  // 只在开发环境中显示
  if (process.env.NODE_ENV !== "development" || !isTracking) return null;

  // 计算最新指标
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : undefined;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs">
      <div>Views: {metrics.length}</div>
      {latestMetrics?.FCP && <div>FCP: {latestMetrics.FCP.toFixed(0)}ms</div>}
      {latestMetrics?.LCP && <div>LCP: {latestMetrics.LCP.toFixed(0)}ms</div>}
    </div>
  );
}
