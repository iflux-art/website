/**
 * 错误追踪 Hook
 * 用于捕获和报告前端错误
 */

"use client";

import { useEffect, useCallback } from "react";

// 错误报告数据类型
export interface ErrorReport {
  message: string;
  timestamp: number;
  componentStack?: string;
  errorInfo?: { componentStack?: string };
  url?: string;
  userAgent?: string;
  stack?: string;
}

// 错误处理选项
export interface ErrorTrackingOptions {
  onError?: (error: Error, errorInfo?: { componentStack?: string }) => void;
  onUnhandledRejection?: (event: PromiseRejectionEvent) => void;
  sampleRate?: number; // 采样率 (0-1)
}

// 默认错误处理函数
const defaultOnError = (error: Error) => {
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Tracking]", error);
  }
};

const defaultOnUnhandledRejection = (event: PromiseRejectionEvent) => {
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Tracking] Unhandled promise rejection:", event.reason);
  }
};

/**
 * 全局错误追踪 Hook
 * @param options - 错误处理选项
 */
export function useErrorTracking(options: ErrorTrackingOptions = {}) {
  const {
    onError = defaultOnError,
    onUnhandledRejection = defaultOnUnhandledRejection,
    sampleRate = 1.0,
  } = options;

  // 决定是否应该报告错误（基于采样率）
  const shouldReport = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  // 上报错误到API
  const reportError = useCallback(
    async (errorReport: ErrorReport) => {
      if (!shouldReport()) return;

      try {
        await fetch("/api/errors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorReport),
        });
      } catch (error) {
        console.error("[Error Tracking] Failed to send error report:", error);
      }
    },
    [shouldReport]
  );

  // 错误事件处理函数
  const handleError = useCallback(
    (event: ErrorEvent) => {
      const errorReport: ErrorReport = {
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      };

      onError(event.error, { componentStack: event.error?.stack });
      reportError(errorReport);
    },
    [onError, reportError]
  );

  // 未处理的Promise拒绝事件处理函数
  const handleUnhandledRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      const errorReport: ErrorReport = {
        message:
          typeof event.reason === "string"
            ? event.reason
            : event.reason?.message || "Unhandled promise rejection",
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      };

      onUnhandledRejection(event);
      reportError(errorReport);
    },
    [onUnhandledRejection, reportError]
  );

  // 设置全局错误处理
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    // 添加事件监听器
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // 清理函数
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [handleError, handleUnhandledRejection]);

  // 手动报告错误的函数
  const trackError = useCallback(
    (error: Error, componentStack?: string, errorInfo?: { componentStack?: string }) => {
      const errorReport: ErrorReport = {
        message: error.message,
        stack: error.stack,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: Date.now(),
        componentStack,
        errorInfo,
      };

      onError(error, errorInfo);
      reportError(errorReport);
    },
    [onError, reportError]
  );

  return { trackError };
}

/**
 * React组件错误边界使用的Hook
 * @param options - 错误处理选项
 */
export function useErrorBoundaryTracking(options: ErrorTrackingOptions = {}) {
  const { trackError } = useErrorTracking(options);

  // 记录错误边界错误
  const recordErrorBoundaryError = useCallback(
    (error: Error, componentStack?: string, errorInfo?: { componentStack?: string }) => {
      trackError(error, componentStack, errorInfo);
    },
    [trackError]
  );

  return { recordErrorBoundaryError };
}
