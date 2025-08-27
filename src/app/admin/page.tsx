"use client";

import { PageContainer } from "@/components/layout";
import { ProgressBarLoading } from "@/components/layout";
import dynamicImport from "next/dynamic";

// 使用动态导入来加载管理页面组件
const LinksAdminPage = dynamicImport(
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

const AdminPage = () => (
  <PageContainer config={{ layout: "full-width" }}>
    <div className="mt-4">
      {/* 管理内容 */}
      <LinksAdminPage />
    </div>
  </PageContainer>
);

export default AdminPage;
