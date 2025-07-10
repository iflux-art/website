import { Globe } from "lucide-react";
import type { AdminStatItem } from "@/types/admin-types";

export const ADMIN_STATS: AdminStatItem[] = [
  {
    title: "网址管理",
    description: "添加、编辑、删除网址信息。",
    icon: Globe,
    color: "text-blue-600",
    href: "/admin/links",
  },
  // 可扩展更多卡片
];
