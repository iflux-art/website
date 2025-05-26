'use client';

import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

/**
 * Web Vitals 指标类型
 */
export type WebVitalsMetric = Metric & {
  /**
   * 页面 URL
   */
  url: string;

  /**
   * 页面路径
   */
  path: string;

  /**
   * 用户 ID
   */
  userId?: string;

  /**
   * 会话 ID
   */
  sessionId?: string;
};

/**
 * Web Vitals 指标处理函数
 */
export type WebVitalsHandler = (metric: WebVitalsMetric) => void;

/**
 * 生成唯一 ID
 *
 * @returns 唯一 ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 获取用户 ID
 *
 * @returns 用户 ID
 */
function getUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // 从 localStorage 中获取用户 ID
  let userId = localStorage.getItem('web-vitals-user-id');

  // 如果不存在，生成一个新的用户 ID
  if (!userId) {
    userId = generateId();
    localStorage.setItem('web-vitals-user-id', userId);
  }

  return userId;
}

/**
 * 获取会话 ID
 *
 * @returns 会话 ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // 从 sessionStorage 中获取会话 ID
  let sessionId = sessionStorage.getItem('web-vitals-session-id');

  // 如果不存在，生成一个新的会话 ID
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('web-vitals-session-id', sessionId);
  }

  return sessionId;
}

/**
 * 增强 Web Vitals 指标
 *
 * @param metric Web Vitals 指标
 * @returns 增强后的 Web Vitals 指标
 */
function enhanceMetric(metric: Metric): WebVitalsMetric {
  return {
    ...metric,
    url: window.location.href,
    path: window.location.pathname,
    userId: getUserId(),
    sessionId: getSessionId(),
  };
}

/**
 * 发送 Web Vitals 指标
 *
 * @param metric Web Vitals 指标
 */
async function sendMetric(metric: WebVitalsMetric): Promise<void> {
  // 如果是开发环境，只在控制台输出
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
    return;
  }

  try {
    // 发送指标到服务器
    await fetch('/api/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
      // 使用 keepalive 选项，确保在页面卸载时也能发送请求
      keepalive: true,
    });
  } catch (error) {
    console.error('[Web Vitals] 发送指标失败:', error);
  }
}

/**
 * 报告 Web Vitals 指标
 *
 * @param handler Web Vitals 指标处理函数
 */
export function reportWebVitals(handler: WebVitalsHandler = sendMetric): void {
  if (typeof window === 'undefined') {
    return;
  }

  // 监听 CLS（Cumulative Layout Shift）
  onCLS(metric => {
    handler(enhanceMetric(metric));
  });

  // 监听 FCP（First Contentful Paint）
  onFCP(metric => {
    handler(enhanceMetric(metric));
  });

  // 监听 LCP（Largest Contentful Paint）
  onLCP(metric => {
    handler(enhanceMetric(metric));
  });

  // 监听 TTFB（Time to First Byte）
  onTTFB(metric => {
    handler(enhanceMetric(metric));
  });

  // 监听 INP（Interaction to Next Paint）
  onINP(metric => {
    handler(enhanceMetric(metric));
  });
}
