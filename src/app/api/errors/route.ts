/**
 * 错误追踪 API 路由
 * 用于接收和存储前端错误报告
 */

import { NextResponse } from "next/server";
import type { ErrorReport } from "@/hooks/use-error-tracking";

// 模拟错误数据存储（在实际应用中应该存储到数据库）
const errorReports: ErrorReport[] = [];

/**
 * POST /api/errors
 * 接收错误报告
 */
export async function POST(request: Request) {
  try {
    const data: ErrorReport = await request.json();

    // 验证数据
    if (!(data.message && data.timestamp)) {
      return NextResponse.json({ error: "Invalid error report" }, { status: 400 });
    }

    // 添加服务器时间戳
    const serverTimestamp = Date.now();

    // 存储错误报告
    errorReports.push({
      ...data,
      timestamp: serverTimestamp,
    });

    // 在开发环境中打印错误报告
    if (process.env.NODE_ENV === "development") {
      console.log("[Error API] Received error report:", data);
    }

    // 如果错误数量过多，删除旧的错误报告
    if (errorReports.length > 1000) {
      errorReports.splice(0, errorReports.length - 500);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Error API] Error:", error);
    return NextResponse.json({ error: "Failed to process error report" }, { status: 500 });
  }
}

/**
 * 获取错误报告统计
 */
export function GET() {
  try {
    // 计算统计数据
    const totalErrors = errorReports.length;

    // 按错误类型分组统计
    const errorTypes: Record<string, number> = {};

    errorReports.forEach(report => {
      // 简单的错误类型分类
      let errorType = "Unknown";

      if (report.message.includes("TypeError")) {
        errorType = "TypeError";
      } else if (report.message.includes("ReferenceError")) {
        errorType = "ReferenceError";
      } else if (report.message.includes("SyntaxError")) {
        errorType = "SyntaxError";
      } else if (report.message.includes("NetworkError")) {
        errorType = "NetworkError";
      } else if (report.message.includes("ChunkLoadError")) {
        errorType = "ChunkLoadError";
      }

      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
    });

    // 获取最近的错误报告
    const recentErrors = errorReports.slice(-10).map(report => ({
      message: report.message,
      url: report.url,
      timestamp: report.timestamp,
    }));

    return NextResponse.json({
      totalErrors,
      errorTypes,
      recentErrors,
    });
  } catch (error) {
    console.error("[Error API] Error:", error);
    return NextResponse.json({ error: "Failed to retrieve error data" }, { status: 500 });
  }
}

/**
 * 清除所有错误报告
 */
export function DELETE() {
  try {
    const count = errorReports.length;
    errorReports.length = 0;

    return NextResponse.json({
      success: true,
      deletedCount: count,
    });
  } catch (error) {
    console.error("[Error API] Error:", error);
    return NextResponse.json({ error: "Failed to clear error reports" }, { status: 500 });
  }
}
