"use client";

import { PageContainer } from "@/components/layout";
import { ProgressBarLoading } from "@/components/layout";
import dynamicImport from "next/dynamic";
import { AdminSidebarWrapper } from "@/features/admin/components";

// 使用动态导入来加载网址管理页面组件
const LinksAdminComponent = dynamicImport(
  () => import("@/features/admin/components").then(mod => mod.LinksAdminPage),
  {
    ssr: false, // 管理页面不需要服务端渲染
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <ProgressBarLoading />
      </div>
    ),
  }
);

const LinksAdminPage = () => (
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
      <LinksAdminComponent />
    </div>
  </PageContainer>
);

export default LinksAdminPage;
