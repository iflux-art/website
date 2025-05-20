"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  isActive: boolean;
  onClose?: () => void;
}

/**
 * 导航卡片组件
 * 用于移动菜单中显示导航项
 */
export function NavCard({ title, description, href, isActive, onClose }: NavCardProps) {
  const router = useRouter();

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 先关闭菜单
    if (onClose) {
      onClose();
    }

    // 然后导航到目标页面
    // 使用setTimeout确保菜单关闭动画有时间执行
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <a href={href} className="block w-full" onClick={handleClick}>
        <div
          className={cn(
            "rounded-lg p-4 transition-all duration-200 h-full",
            isActive
              ? "bg-primary/10 border border-primary/20"
              : "bg-card hover:bg-accent border border-border hover:border-primary/20"
          )}
        >
          <h3 className={cn(
            "text-lg font-medium mb-1",
            isActive ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </a>
    </motion.div>
  );
}
