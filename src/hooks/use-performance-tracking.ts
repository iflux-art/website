/**
 * 性能监控 Hook
 * 用于跟踪和报告Web Vitals和其他性能指标
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Web Vitals 指标类型
 */
export interface WebVitalsMetrics {
  // Core Web Vitals
  /** 累积布局偏移 */
  CLS?: number;
  /** 首次输入延迟 */
  FID?: number;
  /** 最大潜在首次输入延迟 */
  FID_ALL?: number;
  /** 最大内容绘制 */
  LCP?: number;
  /** 首次内容绘制 */
  FCP?: number;
  /** 首字节时间 */
  TTFB?: number;

  // Experimental metrics
  /** 自定义导航时间 */
  NavigationTime?: number;
  /** 自定义资源加载时间 */
  ResourceLoadTime?: number;
  /** 自定义脚本执行时间 */
  ScriptExecutionTime?: number;
}

/**
 * 性能数据类型
 */
export interface PerformanceData {
  /** 页面路径 */
  pathname: string;
  /** Web Vitals 指标 */
  metrics: WebVitalsMetrics;
  /** 时间戳 */
  timestamp: number;
  /** 用户代理 */
  userAgent?: string;
  /** 设备信息 */
  deviceInfo?: {
    /** 屏幕宽度 */
    screenWidth: number;
    /** 屏幕高度 */
    screenHeight: number;
    /** 设备像素比 */
    devicePixelRatio: number;
  };
}

// 上报函数类型
type ReportFunction = (data: PerformanceData) => void;

// 默认上报函数
const defaultReportFunction: ReportFunction = data => {
  // 在开发环境中打印性能数据
  if (process.env.NODE_ENV === "development") {
    console.log("[Performance Tracking]", data);
  }
};

/**
 * 性能监控 Hook
 * @param onReport - 自定义上报函数
 */
export function usePerformanceTracking(onReport: ReportFunction = defaultReportFunction) {
  const pathname = usePathname();
  // const _searchParams = useSearchParams();
  const metricsRef = useRef<WebVitalsMetrics>({});
  const hasReportedRef = useRef(false);

  // 检查是否所有指标都已收集完成并上报
  const reportIfComplete = useCallback(() => {
    // 确保所有关键指标都已收集
    if (
      !hasReportedRef.current &&
      metricsRef.current.FCP !== undefined &&
      metricsRef.current.LCP !== undefined &&
      metricsRef.current.CLS !== undefined
    ) {
      hasReportedRef.current = true;

      const performanceData: PerformanceData = {
        pathname,
        metrics: { ...metricsRef.current },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      };

      onReport(performanceData);
    }
  }, [pathname, onReport]);

  // 上报单个指标的函数
  const reportMetric = useCallback(
    (metric: { name: string; value: number }) => {
      // 存储指标
      metricsRef.current = {
        ...metricsRef.current,
        [metric.name]: metric.value,
      };

      // 检查是否所有指标都已收集完成并上报
      reportIfComplete();
    },
    [reportIfComplete]
  );

  // 获取Web Vitals指标
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    // 重置指标
    metricsRef.current = {};
    hasReportedRef.current = false;

    // 动态导入 web-vitals 以减少初始包大小
    import("web-vitals")
      .then(webVitals => {
        // Core Web Vitals
        webVitals.onCLS?.(reportMetric);
        webVitals.onFCP?.(reportMetric);
        webVitals.onLCP?.(reportMetric);
        webVitals.onTTFB?.(reportMetric);

        // Interaction to Next Paint (取代了FID)
        webVitals.onINP?.(reportMetric);
      })
      .catch(error => {
        console.warn("Failed to load web-vitals:", error);
      });

    // 清理函数
    return () => {
      // web-vitals库会自动清理
    };
  }, [reportMetric]);

  // 手动上报函数
  const reportManualMetrics = (customMetrics: Partial<WebVitalsMetrics>) => {
    const performanceData: PerformanceData = {
      pathname,
      metrics: { ...metricsRef.current, ...customMetrics },
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    onReport(performanceData);
  };

  return { reportManualMetrics };
}

/**
 * 简化版性能监控 Hook
 * 只监控基本指标，减少包大小
 */
export function useBasicPerformanceTracking(onReport: ReportFunction = defaultReportFunction) {
  const pathname = usePathname();
  // const _searchParams = useSearchParams();
  const metricsRef = useRef<WebVitalsMetrics>({});
  const hasReportedRef = useRef(false);

  // 获取基本性能指标
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    // 重置指标
    metricsRef.current = {};
    hasReportedRef.current = false;

    // 简化版指标获取
    const getBasicMetrics = () => {
      // 页面加载时间
      if (performance?.timing) {
        const timing = performance.timing;
        metricsRef.current.FCP = timing.responseStart - timing.navigationStart;
        metricsRef.current.TTFB = timing.responseStart - timing.requestStart;
      }

      // 内存使用情况
      if (performance && (performance as unknown as { memory?: unknown }).memory) {
        const memory = (performance as unknown as { memory?: unknown }).memory;
        // 这些指标可以帮助了解内存使用情况
        console.log("Memory usage:", {
          used: (memory as { usedJSHeapSize?: number }).usedJSHeapSize,
          total: (memory as { totalJSHeapSize?: number }).totalJSHeapSize,
          limit: (memory as { jsHeapSizeLimit?: number }).jsHeapSizeLimit,
        });
      }

      // 立即上报基本指标
      setTimeout(() => {
        const performanceData: PerformanceData = {
          pathname,
          metrics: { ...metricsRef.current },
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        };

        onReport(performanceData);
      }, 3000); // 3秒后上报，确保页面加载完成
    };

    // 页面加载完成后获取指标
    if (document.readyState === "complete") {
      getBasicMetrics();
    } else {
      window.addEventListener("load", getBasicMetrics);
    }

    // 清理函数
    return () => {
      window.removeEventListener("load", getBasicMetrics);
    };
  }, [pathname, onReport]);

  return {};
}
