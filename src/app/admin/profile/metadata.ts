import type { Metadata } from "next";
import { PROFILE_PAGE_METADATA } from "@/config";

// 使用现有的个人资料页面元数据
export const metadata: Metadata = {
  ...PROFILE_PAGE_METADATA,
  title: "账号设置 | 管理后台",
};
