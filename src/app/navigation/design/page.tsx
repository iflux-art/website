"use client";

import React from "react";
import { CategoryPage } from "@/components/features/navigation/category-page";

/**
 * 设计资源页面
 *
 * 显示设计相关工具和资源的分类页面
 *
 * @returns {JSX.Element} 设计资源页面组件
 */
export default function DesignResourcesPage() {
  return <CategoryPage categoryId="design" />;
}

