import { NextResponse } from 'next/server';
import { z } from 'zod';
import { WebVitalsRequestSchema, WebVitalsResponseSchema } from '@/lib/schemas/web-vitals';

/**
 * Web Vitals API 路由
 *
 * 用于接收 Web Vitals 指标
 *
 * @param request 请求对象
 * @returns 响应对象
 */
export async function POST(request: Request) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { metric } = WebVitalsRequestSchema.parse(requestBody);

    // 记录指标
    console.log('[Web Vitals]', metric);

    // 在实际项目中，可以将指标存储到数据库或发送到分析服务
    // 例如：
    // await saveMetricToDatabase(metric);
    // await sendMetricToAnalyticsService(metric);

    // 返回成功响应
    return NextResponse.json(
      WebVitalsResponseSchema.parse({
        success: true,
      })
    );
  } catch (error) {
    // 记录错误
    console.error('[Web Vitals] 处理指标失败:', error);

    // 返回错误响应
    return NextResponse.json(
      WebVitalsResponseSchema.parse({
        success: false,
        error: error instanceof z.ZodError ? '无效的指标数据' : '处理指标失败',
      }),
      { status: 500 }
    );
  }
}
