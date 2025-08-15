"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 底栏组件
 * 简洁样式，文字居中，纯文本显示
 */
export function Footer() {
  return (
    <footer
      role="contentinfo"
      className={cn(
        "w-full py-4 md:py-6",
        "border-t border-border/30",
        "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-center">
        <div className="text-center text-sm text-muted-foreground">
          © 2025 iFluxArt 保留所有权利
        </div>
      </div>
    </footer>
  );
}
