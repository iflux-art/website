"use client";

import React from "react";
import AdminPageContentLayout from "@/components/layout/admin/admin-page-content-layout";
import { LinkCard } from "@/components/common/cards/link-card";
import { Globe, BarChart3 } from "lucide-react";
import { AppGrid } from "@/components/layout/app-grid";

export default function AdminDashboard() {
  const stats = [
    {
      title: "网址管理",
      description: "添加、编辑、删除网址信息。",
      icon: Globe,
      color: "text-blue-600",
    },
  ];

  return (
    <AdminPageContentLayout
      title="管理仪表板"
      description="欢迎回来！这里是系统管理概览"
      icon={BarChart3}
      backUrl="/"
      backLabel="返回首页"
    >
      {/* 统计卡片 */}
      <AppGrid columns={4} className="mb-8">
        {stats.map((stat) => (
          <LinkCard
            key={stat.title}
            title={stat.title}
            description={stat.description}
            href="/admin/links"
            icon={<stat.icon className={stat.color} />}
            iconType="text"
          />
        ))}
      </AppGrid>
    </AdminPageContentLayout>
  );
}
