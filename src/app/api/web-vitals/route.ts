import { NextResponse } from "next/server";

// WebVitalsMetric type removed as it's not currently used

type WebVitalsResponse = {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
};

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

    // 手动验证请求体
    if (!requestBody.metric || typeof requestBody.metric !== "object") {
      return NextResponse.json(
        { success: false, error: "无效的指标数据" },
        { status: 400 },
      );
    }

    // Record metrics (removed console.log for production)

    // 在实际项目中，可以将指标存储到数据库或发送到分析服务
    // 例如：
    // await saveMetricToDatabase(metric);
    // await sendMetricToAnalyticsService(metric);

    // 返回成功响应
    const response: WebVitalsResponse = {
      success: true,
    };
    return NextResponse.json(response);
  } catch {
    // Error processing metrics

    // 返回错误响应
    const response: WebVitalsResponse = {
      success: false,
      error: "处理指标失败",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
