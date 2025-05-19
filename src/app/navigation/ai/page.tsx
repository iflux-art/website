"use client";

import React from "react";
import { CategoryPage } from "@/components/features/navigation/category-page";

/**
 * AI工具页面
 *
 * 显示AI相关工具和资源的分类页面
 *
 * @returns {JSX.Element} AI工具页面组件
 */
export default function AIToolsPage() {
  return <CategoryPage categoryId="ai" />;
}

