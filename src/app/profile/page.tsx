import type { Metadata } from "next";
import { PROFILE_PAGE_METADATA } from "@/config";
import { UserProfile } from "@/features/auth/components";
import { PageContainer } from "@/components/layout";

// 页面元数据
export const metadata: Metadata = PROFILE_PAGE_METADATA;

// 服务端组件
export default function ProfilePage() {
  return (
    <PageContainer config={{ layout: "full-width" }}>
      <div className="mt-4">
        <UserProfile />
      </div>
    </PageContainer>
  );
}
