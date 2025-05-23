'use client';

import React, { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals 监控组件属性
 */
export interface WebVitalsMonitorProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * Web Vitals 监控组件
 * 
 * 用于监控 Web Vitals 指标
 * 
 * @example
 * ```tsx
 * <WebVitalsMonitor />
 * ```
 */
export function WebVitalsMonitor({ children }: WebVitalsMonitorProps) {
  useEffect(() => {
    // 报告 Web Vitals 指标
    reportWebVitals();
  }, []);
  
  return <>{children}</>;
}
