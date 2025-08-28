"use client";

import { PageContainer } from "@/components/layout";
import { ProgressBarLoading } from "@/components/layout";
import { AdminSidebarWrapper } from "@/features/admin/components";
import dynamicImport from "next/dynamic";

// 使用动态导入来加载管理页面组件
const DashboardComponent = dynamicImport(
  () => import("@/features/admin/components").then(mod => mod.DashboardPage),
  {
    ssr: false, // 管理页面不需要服务端渲染
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <ProgressBarLoading />
      </div>
    ),
  }
);

const AdminDashboardPage = () => (
  <PageContainer
    config={{ layout: "single-sidebar" }}
    sidebars={[
      {
        position: "left",
        content: <AdminSidebarWrapper />,
        sticky: true,
        stickyTop: "6rem",
      },
    ]}
  >
    <div className="mt-4">
      {/* 管理内容 */}
      <DashboardComponent />
    </div>
  </PageContainer>
);

export default AdminDashboardPage;
