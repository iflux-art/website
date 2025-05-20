"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { slideUp, hoverScale } from "@/lib/animations";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * 导航项组件
 * 负责渲染导航链接列表
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function NavItems() {
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
    <ul className="flex lg:items-center lg:flex-row flex-col items-start gap-6 text-sm font-medium text-muted-foreground">
      {NAV_ITEMS.map((item) => (
        <motion.li
          key={item.key}
          variants={slideUp}
          whileHover={hoverScale}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/${item.key}`}
            className={cn(
              "transition-colors relative group",
              isActiveSection(item.key)
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {item.label}
            <span className={cn(
              "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
              isActiveSection(item.key) ? "w-full" : "w-0 group-hover:w-full"
            )}></span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );

}