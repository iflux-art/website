"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { NavCard } from "./nav-card";

// 导航项描述
const NAV_DESCRIPTIONS = {
  docs: "查看详细的文档和指南，了解如何使用我们的产品和服务",
  blog: "阅读最新的博客文章，了解行业动态和技术趋势",
  navigation: "发现精选的网站和工具，提高您的工作效率",
  friends: "查看我们的合作伙伴和友情链接"
};

interface NavCardsProps {
  onClose?: () => void;
}

/**
 * 导航卡片列表组件
 * 用于移动菜单中显示导航卡片列表
 */
export function NavCards({ onClose }: NavCardsProps) {
  const pathname = usePathname();

  // 判断当前路径是否属于某个版块
  const isActiveSection = (key: string) => {
    // 检查路径是否以版块名称开头
    if (pathname.startsWith(`/${key}`)) {
      return true;
    }
    // 首页特殊处理 - 当路径为根路径时，不高亮任何导航项
    return false;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {NAV_ITEMS.map((item) => (
        <NavCard
          key={item.key}
          title={item.label}
          description={NAV_DESCRIPTIONS[item.key as keyof typeof NAV_DESCRIPTIONS]}
          href={`/${item.key}`}
          isActive={isActiveSection(item.key)}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
