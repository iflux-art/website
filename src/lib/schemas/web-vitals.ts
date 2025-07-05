import { z } from 'zod';

// Web Vitals 指标基础schema
export const WebVitalsMetricSchema = z.object({
  name: z.enum(['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'INP']),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  delta: z.number().optional(),
  id: z.string().optional(),
  navigationType: z.enum(['navigate', 'reload', 'back-forward', 'back-forward-cache']).optional(),
});

// Web Vitals 请求schema
export const WebVitalsRequestSchema = z.object({
  metric: WebVitalsMetricSchema,
});

// Web Vitals 响应schema
export const WebVitalsResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

// Web Vitals 类型
export type WebVitalsMetric = z.infer<typeof WebVitalsMetricSchema>;
export type WebVitalsRequest = z.infer<typeof WebVitalsRequestSchema>;
export type WebVitalsResponse = z.infer<typeof WebVitalsResponseSchema>;
