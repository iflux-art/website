/**
 * Web Vitals 相关类型定义
 */

/**
 * Web Vitals 指标名称
 */
export type WebVitalsMetricName =
  | "FCP"
  | "LCP"
  | "CLS"
  | "FID"
  | "TTFB"
  | "INP";

/**
 * Web Vitals 评级
 */
export type WebVitalsRating = "good" | "needs-improvement" | "poor";

/**
 * 导航类型
 */
export type NavigationType =
  | "navigate"
  | "reload"
  | "back-forward"
  | "back-forward-cache";

/**
 * Web Vitals 指标类型
 */
export interface WebVitalsMetric {
  name: WebVitalsMetricName;
  value: number;
  rating: WebVitalsRating;
  delta?: number;
  id?: string;
  navigationType?: NavigationType;
}

/**
 * Web Vitals 请求类型
 */
export interface WebVitalsRequest {
  metric: WebVitalsMetric;
}

/**
 * Web Vitals 响应类型
 */
export interface WebVitalsResponse {
  success: boolean;
  error?: string;
}
