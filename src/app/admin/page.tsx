"use client";

import React from "react";
import AdminPageContentLayout from "@/app/admin/src/components/admin-page-content-layout";
import { LinkCard } from "@/app/links/src/components/link-card";
import { BarChart3 } from "lucide-react";
import { AppGrid } from "packages/src/ui/components/app-grid";
// 内联 ADMIN_STATS 配置
import { Globe } from "lucide-react";
import type { AdminStatItem } from "@/app/admin/src/types/admin-types";

const ADMIN_STATS: AdminStatItem[] = [
  {
    title: "网址管理",
    description: "添加、编辑、删除网址信息。",
    icon: Globe,
    color: "text-blue-600",
    href: "/admin/links",
  },
  // 可扩展更多卡片
];

export default function AdminDashboard() {
  return (
    <AdminPageContentLayout
      title="管理仪表板"
      description="欢迎回来！这里是系统管理概览"
      icon={BarChart3}
      backUrl="/"
      backLabel="返回首页"
    >
      <AppGrid columns={4} className="mb-8">
        {ADMIN_STATS.map((stat: AdminStatItem) => (
          <LinkCard
            key={stat.title}
            title={stat.title}
            description={stat.description}
            href={stat.href}
            icon={<stat.icon className={stat.color} />}
            iconType="text"
          />
        ))}
      </AppGrid>
    </AdminPageContentLayout>
  );
}
