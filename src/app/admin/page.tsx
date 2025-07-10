"use client";

import React from "react";
import AdminPageContentLayout from "@/components/layout/admin/admin-page-content-layout";
import { LinkCard } from "@/components/common/card/link-card";
import { BarChart3 } from "lucide-react";
import { AppGrid } from "@/components/layout/app-grid";
import { ADMIN_STATS } from "@/config/admin";
import type { AdminStatItem } from "@/types/admin-types";

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
