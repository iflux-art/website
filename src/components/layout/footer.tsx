"use client";

import { GitHubButton, TravelButton } from "@/components/button";
import { cn } from "@/utils";

/**
 * 底栏组件
 * 版权信息左对齐，右侧显示登录、GitHub 和开往按钮
 */
export const Footer = () => (
  <footer className={cn("w-full py-4 md:py-6", "border-t border-border/30", "bg-transparent")}>
    <div className="container mx-auto flex items-center justify-between px-4">
      <div className="text-sm text-muted-foreground">© 2025 iFluxArt 保留所有权利</div>
      <div className="flex items-center gap-1">
        <GitHubButton />
        <TravelButton />
      </div>
    </div>
  </footer>
);
