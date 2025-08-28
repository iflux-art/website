"use client";

import { useDashboardStats } from "@/features/admin/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils";

/**
 * 仪表盘统计卡片组件
 */
interface StatsCardProps {
  value: string | number;
  description: string;
  loading?: boolean;
  className?: string;
}

const StatsCard = ({ value, description, loading = false, className }: StatsCardProps) => (
  <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
    <CardContent className="py-6 px-4 text-center">
      {loading ? (
        <div className="h-12 w-32 mx-auto animate-pulse rounded bg-muted" />
      ) : (
        <div className="text-4xl font-bold text-primary">{value}</div>
      )}
      <p className="mt-2 text-sm font-medium text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

/**
 * 管理后台仪表盘组件
 * 显示系统概览和统计信息
 */
export const DashboardPage = () => {
  const { blogCount, docCount, linkCount, friendCount, loading } = useDashboardStats();

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="mt-2 text-muted-foreground">查看系统概览和统计信息，了解网站运行状况</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          value={loading ? "-" : blogCount.toLocaleString()}
          description="博客总数"
          loading={loading}
        />
        <StatsCard
          value={loading ? "-" : docCount.toLocaleString()}
          description="文档总数"
          loading={loading}
        />
        <StatsCard
          value={loading ? "-" : linkCount.toLocaleString()}
          description="导航总数"
          loading={loading}
        />
        <StatsCard
          value={loading ? "-" : friendCount.toLocaleString()}
          description="友链总数"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
