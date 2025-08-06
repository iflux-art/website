/**
 * 导航按钮组件
 * 内联所有相关类型和逻辑，避免过度抽象
 */

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/button";

// 内联导航按钮相关类型定义
interface NavButtonProps {
  href: string;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "ghost" | "outline";
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 导航按钮组件
 * 完整的独立实现，包含所有必要的样式和交互逻辑
 */
export function NavButton({
  href,
  icon: Icon,
  variant = "default",
  active = false,
  children,
  className,
}: NavButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: active ? "default" : variant }),
        "gap-2",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}
