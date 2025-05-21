"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getCategoryColorClasses, getCategoryCardClasses } from "@/lib/color-utils";

/**
 * 分类颜色背景组件
 * 
 * 根据传入的颜色名称，应用相应的背景、文本和边框颜色
 * 
 * @param props 组件属性
 * @returns React组件
 */
export function CategoryColorBackground({
  color,
  className,
  children,
  ...props
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // 获取颜色类名
  const colorClasses = getCategoryColorClasses(color);
  
  return (
    <div className={cn(colorClasses, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * 分类颜色卡片组件
 * 
 * 根据传入的颜色名称，应用相应的背景、文本和边框颜色，适用于卡片
 * 
 * @param props 组件属性
 * @returns React组件
 */
export function CategoryColorCard({
  color,
  className,
  children,
  ...props
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // 获取颜色类名
  const colorClasses = getCategoryCardClasses(color);
  
  return (
    <div className={cn(colorClasses, "rounded-lg border transition-colors", className)} {...props}>
      {children}
    </div>
  );
}
