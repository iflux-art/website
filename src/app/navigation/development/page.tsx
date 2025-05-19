"use client";

import React from "react";
import { CategoryPage } from "@/components/features/navigation/category-page";

/**
 * 开发工具页面
 *
 * 显示开发相关工具和资源的分类页面
 *
 * @returns {JSX.Element} 开发工具页面组件
 */
export default function DevelopmentToolsPage() {
  return <CategoryPage categoryId="development" />;
}

