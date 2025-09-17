"use client";

import { cn } from "@/utils";

/**
 * 底栏组件
 * 版权信息居中
 */
export const Footer = () => (
  <footer
    className={cn(
      "w-full py-4 md:py-6",
      "border-t border-border/30",
      "bg-transparent",
    )}
  >
    <div className="container mx-auto flex items-center justify-center px-4">
      <div className="text-sm text-muted-foreground">
        © 2025 iFluxArt 保留所有权利
      </div>
    </div>
  </footer>
);
