"use client";

import React from "react";
import { CategoryPage } from "@/components/features/navigation/category-page";

/**
 * 效率工具页面
 *
 * 显示效率相关工具和资源的分类页面
 *
 * @returns {JSX.Element} 效率工具页面组件
 */
export default function ProductivityToolsPage() {
  return <CategoryPage categoryId="productivity" />;
}

