"use client";

import React from "react";
import { ResourceCard } from "./resource-card";
import { Resource } from "@/types/navigation";

/**
 * 资源列表组件属性
 *
 * @interface ResourceListProps
 */
interface ResourceListProps {
  /**
   * 资源列表数据
   */
  resources: Resource[];

  /**
   * 空状态显示的消息
   * @default "没有找到相关资源"
   */
  emptyMessage?: string;
}

/**
 * 资源列表组件
 *
 * 用于在导航页面中显示资源列表，支持空状态显示
 *
 * @param {ResourceListProps} props - 组件属性
 * @returns {JSX.Element} 资源列表组件
 *
 * @example
 * ```tsx
 * <ResourceList
 *   resources={[
 *     {
 *       title: "GitHub",
 *       description: "代码托管平台",
 *       url: "https://github.com",
 *       category: "开发",
 *       icon: "🐙",
 *       author: "GitHub, Inc.",
 *       free: true
 *     }
 *   ]}
 *   emptyMessage="暂无资源"
 * />
 * ```
 */
export function ResourceList({ resources, emptyMessage = "没有找到相关资源" }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-10">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} index={index} />
      ))}
    </div>
  );
}