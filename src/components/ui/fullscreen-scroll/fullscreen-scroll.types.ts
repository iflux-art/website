/**
 * fullscreen-scroll 组件类型定义
 */

import React from "react";

export interface FullscreenScrollProps {
  children: React.ReactNode;
  className?: string;
  navbarHeight?: number; // 导航栏高度
  footerHeight?: number; // 底栏高度（如果有）
  showIndicators?: boolean; // 是否显示指示器
  indicatorPosition?: "left" | "right" | "center"; // 指示器位置
}
