"use client";

import { PageContainer } from "@/components/layout";
import { ProgressBarLoading } from "@/components/layout";
import dynamicImport from "next/dynamic";
import { AdminSidebarWrapper } from "@/features/admin/components";

// 使用动态导入来加载账号设置页面组件
const ProfileSettingsComponent = dynamicImport(
  () => import("@/features/admin/components").then(mod => mod.ProfileSettingsPage),
  {
    ssr: false, // 管理页面不需要服务端渲染
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <ProgressBarLoading />
      </div>
    ),
  }
);

const ProfileSettingsPage = () => (
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
      {/* 个人资料设置 */}
      <ProfileSettingsComponent />
    </div>
  </PageContainer>
);

export default ProfileSettingsPage;
