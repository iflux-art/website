/**
 * 性能监控 API 路由
 * 用于接收和存储性能监控数据
 */

import { NextResponse } from "next/server";
import type { WebVitalsMetrics } from "@/hooks/use-performance-tracking";

// 定义性能数据类型
interface PerformanceReport {
  pathname: string;
  metrics: WebVitalsMetrics;
  timestamp: number;
  userAgent: string;
  sessionId?: string;
}

// 模拟性能数据存储（在实际应用中应该存储到数据库）
const performanceData: PerformanceReport[] = [];

/**
 * POST /api/performance
 * 接收性能监控数据
 */
export async function POST(request: Request) {
  try {
    const data: PerformanceReport = await request.json();

    // 验证数据
    if (!(data.pathname && data.metrics && data.timestamp)) {
      return NextResponse.json({ error: "Invalid performance data" }, { status: 400 });
    }

    // 存储性能数据
    performanceData.push(data);

    // 在开发环境中打印性能数据
    if (process.env.NODE_ENV === "development") {
      console.log("[Performance API] Received data:", data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Performance API] Error:", error);
    return NextResponse.json({ error: "Failed to process performance data" }, { status: 500 });
  }
}

/**
 * GET /api/performance
 * 获取性能监控数据统计
 */
export function GET() {
  try {
    // 计算统计数据
    const totalReports = performanceData.length;

    // 计算平均指标
    const sums: WebVitalsMetrics = {} as WebVitalsMetrics;
    const counts: Record<string, number> = {};
    performanceData.forEach(report => {
      Object.entries(report.metrics).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const metricKey = key as keyof WebVitalsMetrics;
          sums[metricKey] = (sums[metricKey] || 0) + value;
          counts[metricKey] = (counts[metricKey] || 0) + 1;
        }
      });
    });

    // 计算平均值，添加安全检查
    const averages: WebVitalsMetrics = {};
    Object.keys(sums).forEach(key => {
      const metricKey = key as keyof WebVitalsMetrics;
      if (counts[metricKey] && counts[metricKey] > 0) {
        averages[metricKey] = (sums[metricKey] || 0) / counts[metricKey];
      } else {
        averages[metricKey] = 0;
      }
    });

    // 按路径分组统计
    const pathStats: Record<string, { count: number; metrics: WebVitalsMetrics }> = {};

    performanceData.forEach(report => {
      // 初始化路径统计对象，添加安全检查
      if (!pathStats[report.pathname]) {
        pathStats[report.pathname] = {
          count: 0,
          metrics: {} as WebVitalsMetrics,
        };
      }

      // 确保路径统计对象存在
      const pathStat = pathStats[report.pathname];
      if (pathStat) {
        pathStat.count = (pathStat.count || 0) + 1;

        // 处理指标数据，添加安全检查
        Object.entries(report.metrics).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const metricKey = key as keyof WebVitalsMetrics;
            if (!pathStat.metrics[metricKey]) {
              pathStat.metrics[metricKey] = 0;
            }
            pathStat.metrics[metricKey] = (pathStat.metrics[metricKey] || 0) + value;
          }
        });
      }
    });

    // 计算每个路径的平均指标
    Object.values(pathStats).forEach(pathStat => {
      Object.keys(pathStat.metrics).forEach(key => {
        const metricKey = key as keyof WebVitalsMetrics;
        if (pathStat.count && pathStat.count > 0) {
          pathStat.metrics[metricKey] = (pathStat.metrics[metricKey] || 0) / pathStat.count;
        }
      });
    });

    return NextResponse.json({
      totalReports,
      averages,
      pathStats,
    });
  } catch (error) {
    console.error("[Performance API] Error:", error);
    return NextResponse.json({ error: "Failed to retrieve performance data" }, { status: 500 });
  }
}
